import { Scheme } from "@/lib/types";

export interface ChatMessage {
    role: 'user' | 'bot'; // 'bot' translates to 'model' for Gemini history
    content: string;
}

export async function getBotResponse(input: string, history: ChatMessage[] = []): Promise<string> {
    try {
        // Convert and clean history for Gemini (strict user/model alternation)
        let geminiHistory: any[] = [];
        let nextRole = 'user';

        for (const msg of history) {
            const geminiRole = msg.role === 'user' ? 'user' : 'model';
            if (geminiRole === nextRole) {
                geminiHistory.push({
                    role: geminiRole,
                    parts: [{ text: msg.content }]
                });
                nextRole = nextRole === 'user' ? 'model' : 'user';
            }
        }

        // Gemini requires history to end with 'model' so the current input 'user' alternates correctly
        if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === 'user') {
            geminiHistory = geminiHistory.slice(0, -1);
        }

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: input,
                history: geminiHistory
            }),
        });

        if (response.status === 429) {
            return "I'm processing a lot of requests right now! Please wait about 30-60 seconds and try your question again. I'll be ready for you then! 🙏";
        }

        const data = await response.json();

        if (data.error) {
            console.error("AI Assistant Error:", data.error);
            return "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!";
        }

        return data.text;
    } catch (error) {
        console.error("AI Assistant Fetch Error:", error);
        return "Oops! Something went wrong. I might be offline for maintenance. Try asking again soon!";
    }
}
