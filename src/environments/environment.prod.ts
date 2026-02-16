export const environment = {
  production: true,
  
  // Backend API URL (Production)
  // Usually behind a domain like api.salem-dev.online
  apiUrl: 'https://salem-dev.online/api',

  // Keycloak Configuration (Production)
  keycloak: {
    url: 'https://auth.salem-dev.online',
    realm: 'notes-realm', // Could be different for prod
    clientId: 'notes-client-frontend'
  }
};