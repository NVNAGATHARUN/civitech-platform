import { getAllSchemes } from "./schemes";
import { Scheme } from "@/lib/types";

export interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
}

export async function getBotResponse(input: string): Promise<string> {
    const query = input.toLowerCase();
    const schemes = await getAllSchemes();

    // 1. Basic Intent Recognition
    if (query.includes("hello") || query.includes("hi") || query.includes("namaste")) {
        return "Namaste! I am Sahayak, your digital welfare assistant. How can I help you find government benefits today?";
    }

    if (query.includes("who are you") || query.includes("what can you do")) {
        return "I help you find government schemes you are eligible for, like scholarships, farming support, or healthcare. Just tell me what you need!";
    }

    // 2. Keyword Matching across schemes
    const matches = schemes.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.descriptionSimple.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.occupationTags.some(tag => query.includes(tag.toLowerCase()))
    );

    if (matches.length > 0) {
        const top = matches[0];
        return `I found a great match for you: **${top.name}**. It's a ${top.category} program for ${top.occupationTags.join(", ")}. Would you like to check your eligibility for this?`;
    }

    // 3. Fallback
    return "I'm not quite sure about that specific search. Try asking about 'scholarships', 'farming', or 'health schemes'!";
}
