const fetch = require('node-fetch');
const config = require('../shared/config');

module.exports = async function (context, req) {
    const url = config.AZURE_TEXT_ENDPOINT;
    const key = config.AZURE_TEXT_KEY;

    if (!url || !key) {
        context.res = {
            status: 500,
            body: "Server misconfiguration: Missing Text API keys."
        };
        return;
    }

    try {
        context.log(`Proxying request to: ${url}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': key
            },
            body: JSON.stringify(req.body)
        });

        let data;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            context.log.error(`Upstream API Error: ${response.status}`, data);
            context.res = {
                status: response.status,
                body: `Upstream Error (${response.status}): ${JSON.stringify(data)}`
            };
            return;
        }

        context.res = {
            body: data
        };
    } catch (error) {
        context.log.error("Internal Server Error:", error);
        context.res = {
            status: 500,
            body: `Internal Server Error: ${error.message}`
        };
    }
};