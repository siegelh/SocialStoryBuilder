# Azure Functions API

This directory contains Azure Functions that serve as API endpoints for the DreamWeaver application.

## Configuration

The API functions use a shared configuration module (`shared/config.js`) that supports both local development and production environments:

### Local Development

For local development, create a `local.settings.json` file in the `api` directory with the following structure:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AZURE_TEXT_ENDPOINT": "your-text-endpoint",
    "AZURE_TEXT_KEY": "your-text-key",
    "AZURE_FLUX_GEN_ENDPOINT": "your-flux-gen-endpoint",
    "AZURE_FLUX_EDIT_ENDPOINT": "your-flux-edit-endpoint",
    "AZURE_FLUX_KEY": "your-flux-key"
  }
}
```

**Note:** `local.settings.json` is already in `.gitignore` and should never be committed to version control.

### Production (Azure Static Web Apps)

In production, the configuration module automatically falls back to Azure Static Web Apps environment variables. Configure these in the Azure Portal under your Static Web App's Configuration settings.

## How It Works

The `shared/config.js` module:
1. First checks if `local.settings.json` exists
2. If found, loads configuration from `local.settings.json` (for local development)
3. If not found, uses `process.env` (for Azure Static Web Apps production environment)

This allows seamless switching between local and production environments without code changes.

## API Endpoints

- **`/api/text`** - Text generation endpoint
- **`/api/image`** - Image generation and editing endpoint
- **`/api/debug`** - Debug endpoint to verify configuration (shows which keys are available)
