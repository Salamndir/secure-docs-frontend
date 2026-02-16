import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, from, lastValueFrom } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private isRefreshing = false;

  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1. Skip public assets/files (no token needed for images/translations)
    if (req.url.includes('/assets/') || req.url.includes('/i18n/')) {
        return next.handle(req);
    }

    // 2. Convert the Promise-based logic to an Observable
    return from(this.handleRequest(req, next));
  }

  private async handleRequest(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const keycloakInstance = this.keycloakService.getKeycloakInstance();

    // --- CASE A: User NOT Logged In ---
    if (!keycloakInstance.token) {
        // Just attach language and go.
        const localizedReq = this.addLanguageHeader(req);
        return await lastValueFrom(next.handle(localizedReq));
    }

    // --- CASE B: Token Refresh Logic ---
    if (keycloakInstance.isTokenExpired(20)) {
        try {
            if (!this.isRefreshing) {
                this.isRefreshing = true;
                await this.keycloakService.updateToken(20);
                this.isRefreshing = false;
            }
        } catch (error) {
            this.isRefreshing = false;
            console.error(' Session expired during refresh attempt.');
            // ⚠️ ERROR PROPAGATION:
            // We do NOT logout here anymore. We just throw the error.
            // The ErrorInterceptor will catch this throw and handle the logout.
            throw error;
        }
    }

    // --- CASE C: User Logged In (Attach Token & Language) ---
    const token = keycloakInstance.token;
    
    // Read from LocalStorage directly (Breaks Circular Dependency)
    const currentLang = localStorage.getItem('lang') || 'en';

    const authReq = req.clone({
        setHeaders: { 
          Authorization: `Bearer ${token}`,
          'Accept-Language': currentLang 
        }
    });

    // --- D. Send Request (THE CLEANUP) ---
    // Just send the request. If it fails, the error bubbles up automatically.
    return await lastValueFrom(next.handle(authReq));
  }

  /**
   * Helper Method: addLanguageHeader
   */
  private addLanguageHeader(req: HttpRequest<any>): HttpRequest<any> {
    const lang = localStorage.getItem('lang') || 'en';
    return req.clone({
        setHeaders: { 
            'Accept-Language': lang
        }
    });
  }
}