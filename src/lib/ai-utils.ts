/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 2000;

/**
 * Realiza una petición fetch con reintentos exponenciales para manejar límites de ratio (429/503).
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, delay = INITIAL_DELAY): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if ((response.status === 429 || response.status === 503) && retries > 0) {
            console.warn(`Groq API busy (${response.status}). Retrying in ${delay}ms... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Fetch error. Retrying in ${delay}ms... (${retries} retries left)`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        throw error;
    }
}

/**
 * Llama a la API de Groq (Chat Completions).
 */
export async function callGroq(
    messages: { role: string; content: string }[],
    options: {
        model?: string;
        jsonMode?: boolean;
        temperature?: number;
    } = {}
) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY not configured");
    }

    const {
        model = "llama-3.3-70b-versatile",
        jsonMode = false,
        temperature = 0.7
    } = options;

    const body: any = {
        model,
        messages,
        temperature,
    };

    if (jsonMode) {
        body.response_format = { type: "json_object" };
    }

    const response = await fetchWithRetry(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API Error: ${response.statusText} (${response.status}) - ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Invalid response from Groq API: No content returned");
    }

    return data.choices[0].message.content;
}

/**
 * Limpia el HTML para reducir el uso de tokens antes de enviarlo a la IA.
 */
export function cleanHtmlForAI(html: string) {
    if (!html) return "";
    const truncatedHtml = html.substring(0, 50000);
    return truncatedHtml
        .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/\s+/g, " ")
        .substring(0, 15000); // Final limit for LLM context
}
