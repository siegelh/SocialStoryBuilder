const config = require('../shared/config');

module.exports = async function (context, req) {
    const keys = {
        AZURE_TEXT_ENDPOINT: !!config.AZURE_TEXT_ENDPOINT,
        AZURE_TEXT_KEY: !!config.AZURE_TEXT_KEY,
        AZURE_FLUX_GEN_ENDPOINT: !!config.AZURE_FLUX_GEN_ENDPOINT,
        AZURE_FLUX_EDIT_ENDPOINT: !!config.AZURE_FLUX_EDIT_ENDPOINT,
        AZURE_FLUX_KEY: !!config.AZURE_FLUX_KEY
    };

    context.res = {
        body: keys
    };
};
