import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private keycloak: KeycloakService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    // Check if user is logged in
    const isLoggedIn = this.keycloak.isLoggedIn();

    if (isLoggedIn) {
      return true;
    }

    // If not logged in, force login
    await this.keycloak.login({
      redirectUri: window.location.href
    });
    return false;
  }
}