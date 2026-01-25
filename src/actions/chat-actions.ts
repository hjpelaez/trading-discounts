"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getFirms } from "@/lib/db";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function sendMessageAction(messages: { role: "user" | "model"; content: string }[], locale: string = 'en') {
    if (!genAI) {
        // Fallback for demo mode if no API Key is provided
        const lastMessage = messages[messages.length - 1].content.toLowerCase();

        if (lastMessage.includes("hola") || lastMessage.includes("hello")) {
            return locale === 'es' ? "¡Hola! Soy Tidi, tu asistente de Trading Discounts. Puedo ayudarte a encontrar la mejor empresa de fondeo. ¿Qué estás buscando exactamente?" : "Hello! I am Tidi, your Trading Discounts assistant. I can help you find the best prop firm deal. What are you looking for?";
        }

        return locale === 'es' ? "Actualmente estoy en modo demo (sin API Key). En la versión final, usaré Gemini para analizar todas nuestras ofertas y recomendarte la ideal." : "I am currently in demo mode (no API Key). In the final version, I will use Gemini to analyze all offers and give you a personalized recommendation.";
    }

    try {
        const firms = await getFirms();
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
You are "Tidi", the expert AI assistant for "Trading Discounts" (TD).
Your goal is to help users find the best funding deals based on our database.

DETECTED USER LANGUAGE: "${locale}" (ISO 639-1).
IMPORTANT: YOU MUST REPLY IN THIS LANGUAGE (${locale}).

OUR DATABASE OF FIRMS:
${JSON.stringify(firms, null, 2)}

RULES:
1. Use the data provided above to answer questions.
2. Always mention the discount code (usually 'PFT' or 'LINK') when recommending a firm.
3. Be professional, friendly, and concise.
4. If a firm is featured, prioritize it if it fits the user's needs.
5. EXTREMELY IMPORTANT: Answer in the detected language (${locale === 'es' ? 'Spanish/Español' : 'English'}).
6. If you don't have specific data for a question, be honest and suggest the closest match.
`;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: `Understood. I am Tidi. I will reply in ${locale === 'es' ? 'Spanish' : 'English'}.` }],
                },
                ...messages.slice(0, -1).map(m => ({
                    role: m.role,
                    parts: [{ text: m.content }],
                }))
            ],
        });

        const result = await chat.sendMessage(messages[messages.length - 1].content);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Error:", error);
        return locale === 'es' ? "Lo siento, ha habido un error procesando tu consulta. Por favor, inténtalo de nuevo más tarde." : "Sorry, I encountered an error processing your request. Please try again later.";
    }
}
