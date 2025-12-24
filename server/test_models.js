const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const apiKey = process.env.GOOGLE_AI_API_KEY;

if (!apiKey) {
    console.error('Error: API key is missing in .env file');
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log('Fetching available models from:', url.replace(apiKey, 'HIDDEN'));

axios.get(url)
    .then(response => {
        console.log('--- Available Models ---');
        const models = response.data.models || [];
        const chatModels = models.filter(m => m.supportedGenerationMethods.includes('generateContent'));

        chatModels.forEach(m => {
            console.log(`- Name: ${m.name}`);
            console.log(`  Display Name: ${m.displayName}`);
            console.log(`  Version: ${m.version}`);
            console.log('---');
        });

        if (chatModels.length === 0) {
            console.log('No models found that support generateContent.');
        }
    })
    .catch(error => {
        console.error('Error fetching models:', error.response ? error.response.data : error.message);
    });
