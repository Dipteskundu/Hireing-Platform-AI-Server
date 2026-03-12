// backend/test-gemini.js
// Standalone script to verify Gemini API connection
// Using the official Google Generative AI SDK (@google/generative-ai)
// Documentation: https://ai.google.dev/gemini-api/docs/get-started/node

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

// Load .env
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY NOT FOUND in .env");
    console.log("\nPlease add your API key to the .env file:");
    console.log("GEMINI_API_KEY=your_api_key_here");
    console.log("\nGet your API key from: https://ai.google.dev/");
    process.exit(1);
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

async function runTest() {
    console.log("🚀 Testing Gemini API connection...");
    console.log("📚 Using official @google/generative-ai SDK");
    console.log(`🔑 API Key: ${apiKey.slice(0, 5)}...${apiKey.slice(-5)}\n`);

    const testPrompt = "Say 'Gemini API is working perfectly!' if you can hear me.";
    
    // List of models to try - using available model names
    // Run 'node list-models.js' to see all available models for your API key
    const modelsToTry = [
        "gemini-2.5-flash",          // Latest stable Flash (recommended)
        "gemini-flash-latest",       // Alias for latest Flash
        "gemini-2.0-flash",          // Gemini 2.0 Flash
        "gemini-2.0-flash-001",      // Stable Gemini 2.0 Flash
        "gemini-2.5-pro",            // Latest stable Pro
        "gemini-pro-latest",         // Alias for latest Pro
        "gemini-2.0-flash-lite",     // Lighter version
        "gemini-2.0-flash-lite-001"  // Stable lite version
    ];

    let successCount = 0;
    let quotaExceeded = false;

    for (const modelName of modelsToTry) {
        try {
            console.log(`\n📡 Trying model: ${modelName}...`);
            
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(testPrompt);
            const response = result.response;
            const text = response.text();

            console.log("✅ SUCCESS!");
            console.log(`📝 Response: ${text}`);
            console.log(`🎯 Model used: ${modelName}`);
            
            successCount++;
            
            // If we got one successful response, that's enough for the test
            if (successCount === 1) {
                console.log("\n" + "=".repeat(60));
                console.log("✨ Gemini API is working perfectly!");
                console.log("=".repeat(60));
                return;
            }
        } catch (error) {
            const errorMsg = error.message || String(error);
            
            // Log full error for debugging
            console.log(`❌ Full error:`, error);
            
            if (errorMsg.includes("429") || errorMsg.includes("quota exceeded")) {
                console.log(`⚠️  Quota exceeded for ${modelName}`);
                quotaExceeded = true;
                // Continue trying other models
            } else if (errorMsg.includes("404") || errorMsg.includes("not found")) {
                console.log(`⚠️  Model not available: ${modelName}`);
            } else if (errorMsg.includes("503") || errorMsg.includes("unavailable")) {
                console.log(`⚠️  Service temporarily unavailable for ${modelName}`);
            } else {
                console.log(`❌ Error: ${errorMsg.substring(0, 100)}...`);
            }
        }
    }
    
    console.log("\n" + "=".repeat(60));
    if (successCount > 0) {
        console.log("✨ Gemini API connection successful!");
    } else if (quotaExceeded) {
        console.log("⚠️  API Key quota exceeded");
        console.log("\nThis usually means:");
        console.log("• Free tier daily limit reached");
        console.log("• Wait 24 hours or upgrade your plan");
        console.log("• Check usage: https://ai.google.dev/");
        console.log("• Rate limits: https://ai.google.dev/gemini-api/docs/rate-limits");
    } else {
        console.log("❌ All models failed");
        console.log("\nTroubleshooting:");
        console.log("• Verify your API key is correct");
        console.log("• Check your internet connection");
        console.log("• Visit: https://ai.google.dev/");
    }
    console.log("=".repeat(60));
}

runTest();
