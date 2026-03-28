const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

async function listModels() {
    let apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        try {
            const envPath = path.resolve(__dirname, '..', '.env.local');
            const envContent = fs.readFileSync(envPath, 'utf8');
            const match = envContent.match(/GEMINI_API_KEY="?([^"\n]+)"?/);
            if (match) {
                apiKey = match[1];
            }
        } catch (e) {
            console.error("Could not read .env.local");
        }
    }

    if (!apiKey) {
        console.error("No API key found.");
        return;
    }

    console.log("Using API Key (last 4 chars):", apiKey.slice(-4));
    const genAI = new GoogleGenerativeAI(apiKey);

    try {
        // For listing models, we don't need a specific model instance, 
        // but the SDK structure usually involves getting a model or using the manager.
        // Actually, the SDK doesn't always expose listModels directly in the simplest way 
        // without digging, but we can try a simple generation with a known 'safe' model 
        // like 'gemini-pro' to see if it works, OR just use the error message which told us to ListModels.
        // A better approach for debugging: Try the most standard 'gemini-pro'.

        console.log("Testing 'gemini-1.5-flash'...");
        const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
            const result1 = await model1.generateContent("Hello");
            console.log("Success with gemini-1.5-flash!");
        } catch (e) {
            console.log("Failed gemini-1.5-flash. Error details:");
            console.log(e.message);
            // Sometimes the error object needs stringifying or has response inside
            if (e.response) console.log(JSON.stringify(e.response, null, 2));
        }

        console.log("\nTesting 'gemini-pro'...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
        try {
            const result2 = await model2.generateContent("Hello");
            console.log("Success with gemini-pro!");
        } catch (e) {
            console.log("Failed gemini-pro:", e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
