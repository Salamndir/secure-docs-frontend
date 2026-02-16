// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
// };


import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MessageService } from 'primeng/api';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { initializeKeycloak } from './init/keycloak-init';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { routes } from './app.routes';

import { ErrorInterceptor } from './interceptors/error.interceptor';


// =================================================================
// Factory function for Translation Loader
// =================================================================
// This function tells the library HOW to load the translation files.
// It uses HttpClient to fetch JSON files from the 'assets/i18n/' directory.
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

// =================================================================
// Main Application Configuration
// =================================================================
export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Router Provider: Enables navigation between pages defined in app.routes.ts
    provideRouter(routes),

    // 2. Animations Provider: Required by PrimeNG components (e.g., Dialogs, Menus)
    // We use 'provideAnimations' (standard) instead of 'Async' for better stability with PrimeNG v17.
    provideAnimations(),
    

    
// 3. HTTP Client with Interceptors support
    provideHttpClient(withInterceptorsFromDi(), withFetch()), // Enables HttpClient and allows us to use interceptors defined in DI (like AuthInterceptor)

    // 4. Translation Module Setup
    // We use 'importProvidersFrom' to integrate the translation library into the standalone app.
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en', // <--- Changed to English as per your request
        loader: {
          provide: TranslateLoader, // The abstract class we want to provide
          useFactory: HttpLoaderFactory, // The factory function that creates the loader
          deps: [HttpClient] // Dependencies required by the factory (HttpClient)
        }
      }),
    ),
      // 4. Keycloak Module
    importProvidersFrom(KeycloakAngularModule),

    // 5. Initialize Keycloak
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    MessageService,

    // 6. Register Custom AuthInterceptor

    // 7. Register Interceptors (ORDER IS CRITICAL!)
    // order importent: first Auth  then Error
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }

    
  ]
};

