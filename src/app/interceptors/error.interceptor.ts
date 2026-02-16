import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { MessageService } from 'primeng/api'; // ✅ Import MessageService for Toasts

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private keycloakService: KeycloakService,
    private messageService: MessageService // ✅ Inject it
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        
        // 1. Handle Network Error (Server Down / No Internet)
        if (error.status === 0) {
            this.showError('Connection Error', 'Unable to connect to the server. Please check your internet.');
            return throwError(() => error);
        }

        // 2. Handle Unauthorized (401)
        if (error.status === 401) {
          // Optional: Show toast before logout
          // this.showError('Session Expired', 'Please login again.');
          this.keycloakService.logout(window.location.origin);
          return throwError(() => error); // Stop here
        }

        // 3. Handle Forbidden (403)
        if (error.status === 403) {
             this.showError('Access Denied', 'You do not have permission to perform this action.');
             return throwError(() => error);
        }

        // 🚀 4. Handle Backend Structured Errors (400, 404, 500)
        // Check if the error body is JSON and has the structure we expect
        const serverError = error.error; 

        if (serverError && typeof serverError === 'object') {
            
            // A. VALIDATION_ERROR (Has 'fieldErrors')
            if (serverError.code === 'VALIDATION_ERROR' && serverError.fieldErrors) {
                // Loop through the map and create a bulleted list of errors
                let validationMsg = '';
                for (const key in serverError.fieldErrors) {
                    if (serverError.fieldErrors.hasOwnProperty(key)) {
                        // Example: "• Title: Note title is required"
                        validationMsg += `• ${serverError.fieldErrors[key]}\n`; 
                    }
                }
                // Show the main message as summary, and the list as detail
                // Note: To show newlines in Toast, make sure to enable [escape]="false" in p-toast if supported, or just use it as string.
                this.showError(serverError.message, validationMsg);
            } 
            
            // B. BUSINESS_ERROR (NOTE_NOT_FOUND, etc.)
            else if (serverError.message) {
                // Show the backend message directly (it is already localized ar/en)
                this.showError('Error', serverError.message);
            }
            
            // C. Fallback for structured error without message
            else {
                this.showError('Error', 'An unexpected error occurred.');
            }

        } else {
            // D. Fallback for non-JSON errors (HTML error pages, etc.)
            this.showError('System Error', `Error Code: ${error.status}`);
        }

        // Re-throw the error so the component knows the request failed
        // (The component might want to stop a loading spinner)
        return throwError(() => error);
      })
    );
  }

  /**
   * Helper to show Toast using PrimeNG MessageService
   */
  private showError(summary: string, detail: string) {
    this.messageService.add({
        severity: 'error', 
        summary: summary, 
        detail: detail,
        life: 5000 // Duration in ms
    });
  }
}