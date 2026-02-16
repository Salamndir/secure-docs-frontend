import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../environments/environment.prod';

export function initializeKeycloak(keycloak: KeycloakService) {
  // We return a function that returns a Promise. 
  // Angular's APP_INITIALIZER waits for this promise to resolve before starting the app.
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId
      }, 
      
      initOptions: {
        /**
         * 'check-sso':
         * Silently checks if the user is already logged in.
         * If yes -> logs them in.
         * If no -> keeps them as a guest (doesn't force redirect).
         */
        onLoad: 'check-sso',

        /**
         * checkLoginIframe: false
         * CRITICAL FIX: We disable the default iFrame check because modern browsers
         * (Safari, Chrome Incognito) block third-party cookies, causing silent failures.
         */
        checkLoginIframe: false,
      },
      // Automatically fetch user details (email, name) upon successful login
      loadUserProfileAtStartUp: true,
      
      // We disable the library's default interceptor because we built a 
      // custom, more robust one (AuthInterceptor) to handle edge cases.
      enableBearerInterceptor: false,
    }).then(() => {
      
      /**
       * MANUAL SESSION MONITORING (The iFrame Replacement):
       * Since we disabled the iFrame, we need a local "Heartbeat" mechanism.
       * This timer runs every 60 seconds to ensure the session stays alive.
       */
      setInterval(() => {
        const keycloakInstance = keycloak.getKeycloakInstance();
        
        // Check if token exists AND expires within the next 70 seconds
        if (keycloakInstance.token && keycloakInstance.isTokenExpired(70)) {
           console.log(' Token is about to expire, refreshing in background...');
           
           // Force a token refresh
           keycloak.updateToken(70).catch(() => {
             console.error(' Background refresh failed. Session expired.');
             // If refresh fails, redirect user to the IDP login page immediately
             keycloak.logout(window.location.origin);
           });
        }
        else {
            // Optional: Log remaining time for debugging
            console.log(' Session is healthy');
        }

      }, 10000); // Run check every 1 minute
    });
}