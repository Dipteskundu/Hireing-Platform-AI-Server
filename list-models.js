// backend/list-models.js
// Script to list all available Gemini models for your API key

const dotenv = require("dotenv");
const https = require("https");

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY NOT FOUND in .env");
    process.exit(1);
}

async function listModels() {
    console.log("📋 Listing available Gemini models for your API key...\n");
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    
                    if (response.error) {
                        console.error("❌ API Error:");
                        console.error(response.error.message);
                        reject(response.error);
                        return;
                    }
                    
                    if (!response.models || response.models.length === 0) {
                        console.log("No models found.");
                        resolve([]);
                        return;
                    }
                    
                    console.log(`Found ${response.models.length} models:\n`);
                    
                    response.models.forEach((model, index) => {
                        console.log(`${index + 1}. ${model.name}`);
                        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
                        console.log(`   Description: ${model.description || 'N/A'}`);
                        console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
                        console.log();
                    });
                    
                    // Extract model names that support generateContent
                    const contentModels = response.models
                        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
                        .map(m => m.name.replace('models/', ''));
                    
                    if (contentModels.length > 0) {
                        console.log("\n✅ Models that support generateContent:");
                        contentModels.forEach(name => console.log(`   - ${name}`));
                    }
                    
                    resolve(response.models);
                } catch (error) {
                    console.error("❌ Error parsing response:");
                    console.error(error.message);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error("❌ Network error:");
            console.error(error.message);
            reject(error);
        });
    });
}

listModels();
