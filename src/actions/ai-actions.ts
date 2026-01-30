/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { callGroq, cleanHtmlForAI } from "@/lib/ai-utils";

export async function extractFirmDataFromURL(url: string, customInstruction?: string) {
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
                console.warn(`Fetch failed with status ${response.status}, proceeding with internal knowledge fallback.`);
                html = "";
            } else {
                html = await response.text();
            }
        } catch (fetchError: any) {
            console.warn("Fetch failed, proceeding with internal knowledge fallback:", fetchError.message);
            html = "";
        }

        const cleanedContent = cleanHtmlForAI(html);

        // Call Groq API
        const prompt = `You are an expert Data Extraction & Research Assistant.

        CRITICAL TASK:
        Extract detailed Prop Firm information for the firm associated with the URL: "${url}".

        STRICT CONSTRAINTS (VIOLATION = FAILURE):
        1. MARKETING DESCRIPTIONS: MUST be between 30 and 40 words. Count them.
           - IF TOO SHORT: Expand with details about credibility, funding model, or payouts.
           - IF TOO LONG: Summarize.
        2. LISTS (Features, Rules, Prohibited, Consistency): Extract ALL relevant items but output a MAXIMUM of 10 items per list.
        3. Do NOT create empty items or placeholders.
        
        INPUT DATA:
        I may provide HTML content below.
        - IF the HTML contains the data, prefer extracting it from there.
        - IF the HTML is blocked, incomplete, or insufficient (common with cloudflare/SPAs), YOU MUST DATA-MINE YOUR INTERNAL KNOWLEDGE BASE to find accurate, up-to-date details for this firm.
        - The user wants this form filled AUTOMATICALLY. Do not return nulls if you know the answer.

        OUTPUT FORMAT:
        Return ONLY a valid JSON object matching this EXACT SCHEMA.
        Follow the formatting rules in parentheses strictly.

{
  "name": "Firm Name",
  "description": {
    "en": "MINIMUM 30 words, MAX 40 words. Detailed marketing summary in English.",
    "es": "MÍNIMO 30 palabras, MÁX 40 palabras. Resumen detallado en Español."
  },
  "rating": 4.5, (Number out of 5. Estimate if unknown)
  "trustpilotScore": 4.5, (Number out of 5)
  "country": "Country Name (e.g. United Kingdom, USA)",
  "activeYears": 5, (Number)
  "maxAllocation": "$2,000,000", (String with currency symbol)
  "broker": "Broker Name (e.g. Eightcap, ThinkMarkets)",
  "categories": ["forex", "futures"], (Array from: "forex", "futures", "crypto", "stocks")
  "platforms": ["MT4", "MT5", "cTrader"], (Array of strings)
  "instruments": ["CFDs", "Forex", "Indices", "Commodities"], (Array of strings)
  "assets": ["Crypto", "FX", "Gold"], (Array of strings)
  "minPrice": 99, (Lowest challenge price as Number)
  "maxLeverage": "1:100", (String format 1:X)
  "drawdownType": "Trailing", (Trailing / Static / Relative)
  "features": {
    "en": ["Feature 1", ...], (Max 10 items)
    "es": ["Característica 1", ...] (Máx 10 items)
  },
  "rules": {
    "en": ["Rule 1", ...], (Max 10 rules)
    "es": ["Regla 1", ...] (Máx 10 reglas)
  },
  "consistencyRules": {
    "en": ["Consistency Rule 1", ...], (Max 10 rules)
    "es": ["Regla de Consistencia 1", ...] (Máx 10 reglas)
  },
  "prohibitedPractices": {
    "en": ["Practice 1", ...], (Max 10 practices)
    "es": ["Práctica 1", ...] (Máx 10 prácticas)
  },
  "paymentMethods": ["Credit Card", "Crypto"], (Array of strings)
  "payoutMethods": ["Crypto", "Bank Transfer", "Deel"], (Array of strings)
  "payoutFrequency": "14 days", (String, e.g. "Bi-weekly", "On-demand")
  "minPayout": "$0" (String with currency)
}

HTML CONTENT (May be partial):
${cleanedContent}

CRITICAL: Return ONLY the JSON. Verify the JSON syntax is perfect.
REMINDER: MAX 10 ITEMS PER LIST. 30-40 WORDS PER DESCRIPTION.`;

        const responseText = await callGroq([
            { role: "user", content: prompt }
        ], {
            jsonMode: true,
            temperature: 0.1
        });

        const firmData = JSON.parse(responseText);

        // POST-PROCESSING: Enforcing constraints programmatically
        const truncateList = (list: any[], limit: number) => Array.isArray(list) ? list.slice(0, limit) : [];

        if (firmData.features) {
            firmData.features.en = truncateList(firmData.features.en, 10);
            firmData.features.es = truncateList(firmData.features.es, 10);
        }
        if (firmData.rules) {
            firmData.rules.en = truncateList(firmData.rules.en, 10);
            firmData.rules.es = truncateList(firmData.rules.es, 10);
        }
        if (firmData.consistencyRules) {
            firmData.consistencyRules.en = truncateList(firmData.consistencyRules.en, 10);
            firmData.consistencyRules.es = truncateList(firmData.consistencyRules.es, 10);
        }
        if (firmData.prohibitedPractices) {
            firmData.prohibitedPractices.en = truncateList(firmData.prohibitedPractices.en, 10);
            firmData.prohibitedPractices.es = truncateList(firmData.prohibitedPractices.es, 10);
        }

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

