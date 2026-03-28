import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import schemes from "@/lib/schemes.json";

// Fallback logic for when Gemini API Key is missing (MVP Demo mode)
function getFallbackResponse(message: string): string {
    const query = message.toLowerCase();

    if (query.includes("hello") || query.includes("hi") || query.includes("namaste")) {
        return "Namaste! I am Sahayak (Demo Mode). I notice the Gemini API key isn't set yet, but I can still help you find schemes! Try asking about 'scholarships' or 'farming'.";
    }

    const matches = schemes.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.descriptionSimple.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.occupationTags.some(tag => query.includes(tag.toLowerCase()))
    );

    if (matches.length > 0) {
        const top = matches[0];
        return `[Demo Mode] I found a match: **${top.name}**. It's a ${top.category} program for ${top.occupationTags.join(", ")}. Would you like to check your eligibility?`;
    }

    return "I'm in Demo Mode right now because a Gemini API key isn't configured. I can't understand complex questions yet, but you can search for keywords like 'scholarship', 'farming', or 'loan'!";
}

export async function POST(req: Request) {
    try {
        const { message, history, userContext } = await req.json();

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
            console.warn("GEMINI_API_KEY missing - falling back to keyword matching.");
            return NextResponse.json({ text: getFallbackResponse(message) });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        let systemPrompt = `
You are 'Sahayak', a digital welfare assistant for the CitizenDesk portal. 
Your goal is to help Indian citizens find and understand government welfare schemes they are eligible for.

Here is the current database of schemes you should refer to:
${JSON.stringify(schemes, null, 2)}
`;

        if (userContext) {
            systemPrompt += `\n
IMPORTANT: You are speaking to a specific citizen with the following profile:
- Name: ${userContext.name || "Unknown"}
- Age: ${userContext.age || "Unknown"}
- Gender: ${userContext.gender || "Unknown"}
- Occupation: ${userContext.occupation || "Unknown"}
- Income Band: ${userContext.incomeBand || userContext.income || "Unknown"}
- State: ${userContext.state || "Unknown"}
- District: ${userContext.district || "Unknown"}

Please tailor your responses to this profile. matched schemes should be highlighted.
`;
        }

        systemPrompt += `
Instructions:
1. Use the provided JSON data to answer questions about specific schemes.
2. If a user asks broadly (e.g., "help me with farming"), identify relevant schemes from the list.
3. If information is missing to determine eligibility (age, income, state, occupation), ask clarifying questions politely.
4. Keep responses helpful, empathetic, and concise. 
5. You can communicate in English, Hindi, or Telugu.
6. If a scheme is not in the database, honestly state that you don't have information on that specific one but can help with the ones you know.
7. Always encourage users to "Check Eligibility" using the portal's automated tool for a definitive answer.
`;

        const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        let lastError = null;
        let text = "";

        for (const modelName of modelsToTry) {
            try {
                console.log(`Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemPrompt
                });

                const chat = model.startChat({
                    history: history || [],
                });

                const result = await chat.sendMessage(message);
                const response = await result.response;
                text = response.text();

                if (text) break; // Success!
            } catch (err: any) {
                console.warn(`Model ${modelName} failed:`, err.message);
                lastError = err;
                // If it's a 404, we continue to the next model
                if (err.message?.includes("404") || err.message?.includes("not found")) {
                    continue;
                }
                // If it's another error (like 429), we stop
                throw err;
            }
        }

        if (!text && lastError) throw lastError;

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Gemini API Error Detail:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });

        // Detect Rate Limit (429) errors
        if (error.message?.includes("429") || error.message?.includes("quota")) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please try again in a moment." },
                { status: 429 }
            );
        }

        // Detect Invalid Model Errors
        if (error.message?.includes("404") || error.message?.includes("not found")) {
            return NextResponse.json(
                { error: `Model error: ${error.message}. Please check if the model name is correct.` },
                { status: 404 }
            );
        }

        return NextResponse.json({ error: error.message || "Unknown error occurred" }, { status: 500 });
    }
}
