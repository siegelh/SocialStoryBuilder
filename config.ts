
/**
 * ==============================================================================
 * CONFIGURATION: LOCAL API ROUTES
 * ==============================================================================
 * 
 * The keys are now managed by the Azure Static Web App backend (api folder).
 * The frontend simply calls the relative /api/ endpoints.
 */

export const AZURE_CONFIG = {
  // Points to the Azure Function in /api/text
  textEndpoint: "/api/text",
  
  // Points to the Azure Function in /api/image
  imageEndpoint: "/api/image",
  
  // Keys are no longer needed on the frontend
  textKey: "",
  fluxKey: "",
  fluxGenEndpoint: "",
  fluxEditEndpoint: ""
};

export const isConfigured = () => {
  // We assume configuration is handled on the server side now.
  // In a real app, you might have a health check endpoint.
  return true; 
};
