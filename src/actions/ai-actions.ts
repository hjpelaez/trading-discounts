/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { callGroq, cleanHtmlForAI } from "@/lib/ai-utils";

export async function extractFirmDataFromURL(url: string) {
    try {
        // Fetch the webpage content
        let html = "";
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to access URL: ${response.status} ${response.statusText}`);
            }
            html = await response.text();
        } catch (fetchError: any) {
            console.error("Error fetching target URL:", fetchError);
            throw new Error(`Could not access the provided URL: ${fetchError.message}`);
        }

        const cleanedContent = cleanHtmlForAI(html);

        // Call Groq API
        const prompt = `Extract prop firm information from this HTML and return ONLY a valid JSON object with these exact fields (use null for missing data):

{
  "name": "firm name",
  "description": {
    "en": "English marketing description (max 100 chars)",
    "es": "Spanish marketing description (max 100 chars)"
  },
  "rating": 4.5,
  "trustpilotScore": 4.5,
  "country": "country code or flag emoji",
  "activeYears": 3,
  "maxAllocation": "$2,000,000",
  "broker": "broker name",
  "categories": ["crypto", "forex", "futures"],
  "platforms": ["MT4", "MT5"],
  "instruments": ["CFD", "Stocks"],
  "assets": ["Crypto", "FX", "Indices"],
  "minPrice": 100,
  "maxLeverage": "1:100",
  "drawdownType": "Trailing",
  "features": {
    "en": ["Feature 1", "Feature 2"],
    "es": ["Característica 1", "Característica 2"]
  },
  "rules": {
    "en": ["Rule 1", "Rule 2"],
    "es": ["Regla 1", "Regla 2"]
  },
  "consistencyRules": {
    "en": "English consistency rule text",
    "es": "Spanish consistency rule text"
  },
  "prohibitedPractices": {
    "en": ["Practice 1", "Practice 2"],
    "es": ["Práctica 1", "Práctica 2"]
  },
  "paymentMethods": ["Credit Card", "Crypto"],
  "payoutMethods": ["Crypto", "Wire Transfer"],
  "payoutFrequency": "14 days",
  "minPayout": "$100"
}

HTML content:
${cleanedContent}

Return ONLY the JSON object, no conversation or markdown.`;

        const responseText = await callGroq([
            { role: "user", content: prompt }
        ], {
            jsonMode: true,
            temperature: 0.1
        });

        const firmData = JSON.parse(responseText);
        return { success: true, data: firmData };

    } catch (error: any) {
        console.error("Error extracting firm data:", error);
        return {
            success: false,
            error: error.message || "Failed to extract firm data"
        };
    }
}

export async function extractCourseDataFromURL(url: string) {
    try {
        // Fetch the webpage content
        let html = "";
        try {
            const response = await fetch(url, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
                }
            });
            if (!response.ok) {
                throw new Error(`Failed to access URL: ${response.status} ${response.statusText}`);
            }
            html = await response.text();
        } catch (fetchError: any) {
            console.error("Error fetching target URL:", fetchError);
            throw new Error(`Could not access the provided URL: ${fetchError.message}`);
        }

        const cleanedContent = cleanHtmlForAI(html);

        // Call Groq API to extract structured data
        try {
            const prompt = `You are a strict data assistant. Your goal is to extract course data in a SINGLE language.

RULES:
1. DETECT the primary language of the course content.
2. IF there is a target language provided (contextual), use that. Otherwise, use the detected primary language.
3. OUTPUT the entire JSON in that SINGLE language.
4. DO NOT return mixed "Spanglish". Translate any mixed content to the chosen single language.

Extract and return ONLY this JSON structure:
{
  "title": "Course Title",
  "description": "Short engaging description (max 150 chars) - IN THE CHOSEN LANGUAGE",
  "instructor": "Instructor Name",
  "platform": "e.g. Udemy, Teachable, Youtube",
  "rating": 4.8,
  "duration": "e.g. 12h 30m",
  "level": "Beginner/Intermediate/Advanced/All Levels (translated to the chosen language)",
  "language": "English" or "Spanish",
  "category": "Forex/Crypto/Futures/Options/Stocks (translated to the chosen language)",
  "priceLabel": "$197" or "Free" or "$97 - $197",
  "priceMin": 197.00,
  "learningPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"] (TOP 5 takeaways - TRANSLATED TO CHOSEN LANGUAGE)
}

HTML content:
${cleanedContent}

Return ONLY the JSON object, no conversation or markdown.`;

            const responseText = await callGroq([
                { role: "user", content: prompt }
            ], {
                jsonMode: true,
                temperature: 0.1
            });

            const courseData = JSON.parse(responseText);
            return { success: true, data: courseData };

        } catch (apiError: any) {
            console.warn("Groq API failed, attempting local fallback...", apiError.message);

            // FALLBACK: Local Regex Scraping (Free & Robust)
            const titleMatch = html.match(/<title>([^<]*)<\/title>/i) || html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
            const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) || html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
            const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i) || html.match(/<img[^>]+src="([^">]+)"[^>]*>/i);

            const fallbackData = {
                title: titleMatch ? titleMatch[1].trim() : "Course Title",
                description: descMatch ? descMatch[1].trim().substring(0, 150) : "",
                instructor: "Unknown Instructor",
                link: url,
                imageUrl: imageMatch ? imageMatch[1] : "",
                platform: url.includes("udemy") ? "Udemy" : "Other",
                rating: 0,
                duration: "",
                level: "All Levels",
                language: "English",
                category: "General",
                priceLabel: "",
                priceMin: 0,
                learningPoints: []
            };

            return { success: true, data: fallbackData };
        }

    } catch (error: any) {
        console.error("Error extracting course data:", error);
        return {
            success: false,
            error: error.message || "Failed to extract course data"
        };
    }
}

