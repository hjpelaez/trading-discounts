"use server";

export async function extractFirmDataFromURL(url: string) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY not configured");
        }

        // Fetch the webpage content
        const response = await fetch(url);
        const html = await response.text();

        // Call Gemini API to extract structured data
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Extract prop firm information from this HTML and return ONLY a valid JSON object with these exact fields (use null for missing data):

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
${html.substring(0, 15000)}

Return ONLY the JSON object, no markdown, no explanation.`
                        }]
                    }],
                }),
            }
        );

        const data = await geminiResponse.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response from Gemini API");
        }

        const extractedText = data.candidates[0].content.parts[0].text;

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
        // Simple fetch for now, potentially add specific headers if needed for course sites
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        const html = await response.text();

        // Call Gemini API to extract structured data
        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Extract trading course information from this HTML and return ONLY a valid JSON object with these exact fields (use null for missing data):

{
  "title": "Course Title",
  "description": "Short engaging description (max 150 chars)",
  "instructor": "Instructor Name",
  "platform": "e.g. Udemy, Teachable, Youtube",
  "rating": 4.8,
  "duration": "e.g. 12h 30m",
  "level": "Beginner/Intermediate/Advanced/All Levels",
  "language": "English" or "Spanish" (detect from content),
  "category": "Forex" or "Crypto" or "Futures" or "Options" or "Stocks" (infer from content),
  "priceLabel": "$197" or "Free" or "$97 - $197",
  "priceMin": 197.00 (numeric value of lowest price, 0 if free),
  "priceMax": null (numeric value if range, else null),
  "learningPoints": ["Learn A", "Learn B", "Learn C"] (TOP 3 key takeaways)
}

HTML content:
${html.substring(0, 25000)}

Return ONLY the JSON object, no markdown.`
                        }]
                    }],
                }),
            }
        );

        const data = await geminiResponse.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response from Gemini API");
        }

        const extractedText = data.candidates[0].content.parts[0].text;

        // Clean up the response
        const jsonText = extractedText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const courseData = JSON.parse(jsonText);

        return { success: true, data: courseData };
    } catch (error: any) {
        console.error("Error extracting course data:", error);
        return {
            success: false,
            error: error.message || "Failed to extract course data"
        };
    }
}
