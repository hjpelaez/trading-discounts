"use server";

const MAX_RETRIES = 5;
const INITIAL_DELAY = 2000;

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, delay = INITIAL_DELAY): Promise<Response> {
    try {
        const response = await fetch(url, options);
        if ((response.status === 429 || response.status === 503) && retries > 0) {
            console.warn(`Gemini API busy (${response.status}). Retrying in ${delay}ms... (${retries} retries left)`);
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

export async function extractFirmDataFromURL(url: string) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            throw new Error("GROQ_API_KEY not configured");
        }

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

        // Clean HTML to reduce token usage (reuse logic if possible or inline)
        const cleanHtml = (html: string) => {
            const truncatedHtml = html.substring(0, 50000);
            return truncatedHtml
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                .replace(/<!--[\s\S]*?-->/g, "")
                .replace(/\s+/g, " ")
                .substring(0, 15000);
        };
        const cleanedContent = cleanHtml(html);

        // Call Groq API
        const groqResponse = await fetchWithRetry(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{
                        role: "user",
                        content: `Extract prop firm information from this HTML and return ONLY a valid JSON object with these exact fields (use null for missing data):

{
  "name": "firm name",
  "description": "short marketing description (max 100 chars)",
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
  "features": ["Fast Payouts", "No Time Limit"],
  "rules": ["Max DD 10%", "Consistency rule"],
  "consistencyRules": "detailed text about consistency",
  "prohibitedPractices": ["No martingale", "No HFT"],
  "paymentMethods": ["Credit Card", "Crypto"],
  "payoutMethods": ["Crypto", "Wire Transfer"],
  "payoutFrequency": "14 days",
  "minPayout": "$100"
}

HTML content:
${cleanedContent}

Return ONLY the JSON object, no markdown.`
                    }],
                    response_format: { type: "json_object" }
                }),
            }
        );

        if (!groqResponse.ok) {
            const errorText = await groqResponse.text();
            throw new Error(`Groq API Error: ${groqResponse.statusText} (${groqResponse.status}) - ${errorText}`);
        }

        const data = await groqResponse.json();

        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error("Invalid response from Groq API: No content returned");
        }

        const extractedText = data.choices[0].message.content;

        // Clean up the response (remove markdown code blocks if present)
        const jsonText = extractedText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const firmData = JSON.parse(jsonText);

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
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY not configured");
        }

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

        // Clean HTML to reduce token usage
        const cleanHtml = (html: string) => {
            // Limit input size BEFORE regex to avoid performance issues/freezes on large pages
            const truncatedHtml = html.substring(0, 50000);
            return truncatedHtml
                .replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
                .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gim, "")
                .replace(/<!--[\s\S]*?-->/g, "")
                .replace(/\s+/g, " ")
                .substring(0, 15000); // Final limit
        };

        const cleanedContent = cleanHtml(html);

        // Call Groq API to extract structured data
        try {
            const apiKey = process.env.GROQ_API_KEY;
            if (!apiKey) throw new Error("GROQ_API_KEY missing");

            const groqResponse = await fetchWithRetry(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [{
                            role: "user",
                            content: `You are a strict data assistant. Your goal is to extract course data and ensure consistency in language.

RULES:
1. DETECT the primary language of the course content (usually the Title's language).
2. OUTPUT the entire JSON in that SINGLE detected language.
3. IF the content is mixed (e.g. Spanish title but English learning points), YOU MUST TRANSLATE the English parts into Spanish.
4. DO NOT return mixed "Spanglish". If the course is Spanish, everything must be Spanish.

Extract and return ONLY this JSON structure:
{
  "title": "Course Title",
  "description": "Short engaging description (max 150 chars) - IN THE DETECTED LANGUAGE",
  "instructor": "Instructor Name",
  "platform": "e.g. Udemy, Teachable, Youtube",
  "rating": 4.8,
  "duration": "e.g. 12h 30m",
  "level": "Beginner/Intermediate/Advanced/All Levels",
  "language": "English" or "Spanish",
  "category": "Forex" or "Crypto" or "Futures" or "Options" or "Stocks" (infer from content),
  "priceLabel": "$197" or "Free" or "$97 - $197",
  "priceMin": 197.00 (numeric value of lowest price, 0 if free),
  "priceMax": null (numeric value if range, else null),
  "learningPoints": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"] (TOP 5 key takeaways - TRANSLATED TO DETECTED LANGUAGE)
}

HTML content:
${cleanedContent}

Return ONLY the JSON object, no markdown.`
                        }],
                        response_format: { type: "json_object" }
                    }),
                }
            );

            if (!groqResponse.ok) {
                const errorText = await groqResponse.text();
                throw new Error(`Groq API Error: ${groqResponse.statusText} (${groqResponse.status}) - ${errorText}`);
            }

            const data = await groqResponse.json();

            if (!data.choices || !data.choices[0]?.message?.content) {
                throw new Error("Invalid response from Groq API: No content returned");
            }

            const extractedText = data.choices[0].message.content;
            const courseData = JSON.parse(extractedText);
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

