"use server";

import { CourseDB } from "@/lib/db";
import { callGroq, cleanHtmlForAI } from "@/lib/ai-utils";

export async function autoFillCourseFromUrl(url: string): Promise<Partial<CourseDB> | null> {
    try {
        // 1. Fetch the HTML content
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch URL: ${res.statusText}`);
        }

        const html = await res.text();
        const contentSample = cleanHtmlForAI(html);

        // 2. Prompt Groq
        const prompt = `
        You are a Data Extraction Assistant.
        I will provide the HTML source of a course landing page.
        Your task is to extract the course details and Format them as a JSON object.
        
        CRITICAL: 
        1. You MUST generate content in BOTH English (en) and Spanish (es). Translate accuratey.
        2. Detect the "Language" of the audio/video content (English, Spanish, or Mixed).
        3. Guess the "Category" from: [General, Forex, Crypto, Futures, Options, Stocks].
        4. "Level": Beginner, Intermediate, Advanced, or All Levels.
        
        JSON Schema to return:
        {
           "title": { "en": "...", "es": "..." },
           "description": { "en": "...", "es": "..." },
           "instructor": "...",
           "platform": "...", (e.g. Teachable, Udemy, YouTube, Hotmart, etc.)
           "rating": 4.8, (Estimate if not found)
           "duration": "...", (e.g. 10h 30m)
           "level": "...",
           "language": "...",
           "category": "...",
           "priceLabel": "...", (e.g. "$497", "Free", "$49/mo")
           "priceMin": 0, (Numeric value of price)
           "learningPoints": {
               "en": ["point 1", "point 2", "point 3"],
               "es": ["punto 1", "punto 2", "punto 3"]
           }
        }
        
        HTML Source:
        ${contentSample}
        
        Return ONLY the JSON. No conversation or markdown.
        `;

        const responseText = await callGroq([
            { role: "user", content: prompt }
        ], {
            jsonMode: true,
            temperature: 0.2 // Lower temperature for extraction
        });

        const data = JSON.parse(responseText);
        return data as Partial<CourseDB>;

    } catch (error) {
        console.error("AutoFill Course Error:", error);
        throw error;
    }
}
