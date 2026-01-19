# Local Development Guide

## Running the Application Locally

This application is an Azure Static Web App with both frontend (React/Vite) and backend (Azure Functions) components.

### ⚠️ IMPORTANT: Use the Correct Command

**For local development with working API endpoints:**
```bash
npm start
```

This command uses the Azure Static Web Apps CLI (`swa`) which:
- Starts the Vite dev server for the frontend
- Starts the Azure Functions runtime for the backend APIs
- Proxies API requests from the frontend to the backend
- Loads environment variables from `api/local.settings.json`

### ❌ Don't Use These for Local Development

```bash
# These commands DO NOT start the Azure Functions backend
npm run dev      # Only frontend, no API
npm run build    # Only builds frontend
npm run preview  # Only previews built frontend, no API
```

If you use these commands, you'll get errors like:
- `SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`
- API calls returning 404 errors

## Configuration

### Local Settings (`api/local.settings.json`)

Create this file with your Azure credentials:

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

**Note:** This file is in `.gitignore` and should never be committed.

### How Configuration Works

The backend uses a smart configuration loader (`api/shared/config.js`) that:
1. **Locally**: Reads from `api/local.settings.json` if it exists
2. **Production**: Falls back to Azure Static Web Apps environment variables

This means:
- You don't need to change any code between local and production
- Your secrets stay local and aren't committed to git
- Production uses secure Azure environment variables

## Troubleshooting

### "Failed to check env vars" Error

**Problem:** You're seeing `SyntaxError: Unexpected token '<'` in the console.

**Cause:** You're running `npm run preview` or `npm run dev` instead of `npm start`.

**Solution:** Use `npm start` to run both frontend and backend together.

### API Returns 404

**Problem:** API calls to `/api/text` or `/api/image` return 404.

**Cause:** Azure Functions runtime is not running.

**Solution:** Use `npm start` instead of `npm run dev` or `npm run preview`.

### Environment Variables Not Loading

**Problem:** API returns "Server misconfiguration: Missing API keys".

**Cause:** `api/local.settings.json` doesn't exist or has incorrect structure.

**Solution:** 
1. Create `api/local.settings.json` with the correct structure (see above)
2. Ensure the `Values` object contains all required keys
3. Check the console for "Using local.settings.json for configuration" message

## Development Workflow

1. **Start the dev server:**
   ```bash
   npm start
   ```

2. **Open your browser:**
   - The app will be available at `http://localhost:4280` (SWA CLI default port)
   - The SWA CLI will proxy requests to Vite (port 5173) and Azure Functions

3. **Make changes:**
   - Frontend changes: Edit React/TypeScript files, Vite will hot-reload
   - Backend changes: Edit files in `/api`, Functions runtime will reload

4. **Check the console:**
   - Look for "Using local.settings.json for configuration" to confirm local config is loaded
   - Check "Environment Variable Status" to see which keys are available

## Production Deployment

When you deploy to Azure Static Web Apps:
- The build process uses `npm run build` to create the production frontend
- Azure automatically deploys the `/api` folder as Azure Functions
- Environment variables are read from Azure Static Web Apps Configuration (not `local.settings.json`)
- No code changes needed!
