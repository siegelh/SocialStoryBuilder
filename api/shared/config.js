const fs = require('fs');
const path = require('path');

/**
 * Loads environment variables from local.settings.json if available,
 * otherwise falls back to process.env (Azure Static Web Apps environment variables)
 */
function getConfig() {
    const localSettingsPath = path.join(__dirname, '..', 'local.settings.json');

    // Start with process.env
    let config = { ...process.env };

    // Try to load local.settings.json if it exists
    if (fs.existsSync(localSettingsPath)) {
        try {
            const localSettings = JSON.parse(fs.readFileSync(localSettingsPath, 'utf8'));

            // Support standard Azure Functions format (Values) or flat JSON
            const values = localSettings.Values || localSettings;

            console.log('Loading configuration from local.settings.json');
            console.log('Keys found in local.settings.json:', Object.keys(values));

            // Merge local settings on top of process.env
            config = { ...config, ...values };
        } catch (error) {
            console.warn('Failed to parse local.settings.json, falling back to environment variables:', error.message);
        }
    } else {
        console.log('local.settings.json not found at:', localSettingsPath);
        console.log('Using Azure Static Web Apps environment variables');
    }

    return config;
}

// Export a singleton config object
module.exports = getConfig();
