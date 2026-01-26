"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { CourseDB } from "@/lib/db";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function autoFillCourseFromUrl(url: string): Promise<Partial<CourseDB> | null> {
    if (!genAI) {
        throw new Error("Missing API Key");
    }

    try {
        // 1. Fetch the HTML content (simplified)
        // Note: Real world would use specialized scrapers for SPA handling,
        // but for many course landing pages, simple fetch gets enough meta tags/text.
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch URL: ${res.statusText}`);
        }

        const html = await res.text();

        // Truncate HTML to avoid token limits if extremely large (e.g. 100k chars is plenty for metadata)
        const contentSample = html.substring(0, 150000);

        // 2. Prompt Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
        
        Return ONLY the JSON. No markdown formatting.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(jsonStr);

        return data;

    } catch (error) {
        console.error("AutoFill Error:", error);
        throw error;
    }
}
