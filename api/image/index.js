const fetch = require('node-fetch');
const config = require('../shared/config');

module.exports = async function (context, req) {
    // Read environment variables
    const fluxKey = config.AZURE_FLUX_KEY;
    const genEndpoint = config.AZURE_FLUX_GEN_ENDPOINT;
    const editEndpoint = config.AZURE_FLUX_EDIT_ENDPOINT;

    if (!fluxKey || !genEndpoint || !editEndpoint) {
        context.res = {
            status: 500,
            body: "Server misconfiguration: Missing Image API keys."
        };
        return;
    }

    const { mode, prompt, image } = req.body;

    // Determine which endpoint to use based on mode
    let endpoint = genEndpoint;
    const payload = {
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 25,
        response_format: "b64_json" // Request base64 to avoid public URL issues
    };

    if (mode === 'edit' && image) {
        endpoint = editEndpoint;

        // Clean the image string if it has the data prefix
        let cleanImage = image;
        if (cleanImage.startsWith('data:image')) {
            cleanImage = cleanImage.split(',')[1];
        }

        payload.image = cleanImage;
        payload.strength = 0.75;
    } else {
        // Generation mode
        payload.strength = 1.0;
    }

    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': fluxKey
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                // If it's a client error (4xx), don't retry unless it's a rate limit (429)
                if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    context.res = {
                        status: response.status,
                        body: data
                    };
                    return;
                }
                throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
            }

            context.res = {
                body: data
            };
            return; // Success, exit function

        } catch (error) {
            console.error(`Attempt ${attempt} failed: ${error.message}`);
            lastError = error;

            if (attempt < maxRetries) {
                // Wait 1 second before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    // If all retries fail
    context.res = {
        status: 500,
        body: `Failed after ${maxRetries} attempts. Last error: ${lastError.message}`
    };
};