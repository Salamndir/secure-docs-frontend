import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Important for *ngIf
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular'; // Import Service

import { LanguageService } from '../../services/language.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ButtonModule, TranslateModule], // Added CommonModule
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  isDarkMode: boolean;
  isLoggedIn = false; // To track login status
  username = '';

  constructor(
    public languageService: LanguageService,
    private themeService: ThemeService,
    private keycloak: KeycloakService // Inject Keycloak
  ) {
    this.isDarkMode = this.themeService.activeTheme === 'lara-dark-teal';
  }

  async ngOnInit() {
    // Check login status when component loads
    this.isLoggedIn = await this.keycloak.isLoggedIn();

    if (this.isLoggedIn) {
      // Load user profile to get name
      const profile = await this.keycloak.loadUserProfile();
      this.username = profile.firstName || '';
      console.log('User is logged in:', this.username);
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'lara-dark-teal' : 'lara-light-blue';
    this.themeService.switchTheme(theme);
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout(window.location.origin);
  }
}