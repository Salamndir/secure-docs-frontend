// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  
  // Backend API URL (Spring Boot)
  // In development, this usually points to localhost
  apiUrl: 'https://salem-dev.online/api',

  // Keycloak Configuration (Development / QA)
  keycloak: {
    // The URL of the Keycloak Identity Provider
    url: 'https://auth.salem-dev.online', 
    
    // The Realm Name (Tenant)
    realm: 'notes-realm',
    
    // The Client ID for the Frontend Application
    clientId: 'notes-client-frontend'
  }
};