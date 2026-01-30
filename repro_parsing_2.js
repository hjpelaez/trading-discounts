
function parseBilingual(val, locale) {
    if (!val) return "";

    let current = val;
    let attempts = 0;

    // Recursive "Onion Peeler"
    while (attempts < 5) {
        // 1. Try to parse if it looks like a JSON string
        if (typeof current === 'string' && (current.trim().startsWith('{') || current.trim().startsWith('"'))) {
            try {
                const parsed = JSON.parse(current);
                current = parsed;
            } catch (e) {
                break; // If it fails to parse, it's just a string, stop loop
            }
        }
        // 2. If it's an object, try to extract the locale
        else if (typeof current === 'object' && current !== null) {
            // Priority: direct match > en > es
            const candidate = current[locale] || current.en || current.es;

            if (candidate !== undefined) {
                current = candidate; // Continue loop to verify if it needs parsing
            } else {
                break; // Object but no locale keys found
            }
        }
        // 3. If it's a simple string that doesn't look like JSON, we are done
        else {
            break;
        }

        attempts++;
    }

    if (typeof current === 'object') return JSON.stringify(current);
    return String(current);
}

function test() {
    // Data mimicking the screenshot EXACTLY
    // The screenshot shows: {"en": "Líder en prop trading...", "es": "{\\"en\\":...}"}
    // So 'en' is actually Spanish text, and 'es' is more JSON.
    const badDataString = JSON.stringify({
        en: "Líder en prop trading desde 2015...",
        es: JSON.stringify({
            en: "Leading prop firm since 2015...",
            es: "Líder en prop trading desde 2015..."
        })
    });

    const badDataObject = {
        en: "Líder en prop trading desde 2015...",
        es: JSON.stringify({
            en: "Leading prop firm since 2015...",
            es: "Líder en prop trading desde 2015..."
        })
    };

    console.log("--- Testing String Input ---");
    console.log("Input:", badDataString);
    console.log("Result (en):", parseBilingual(badDataString, 'en'));
    console.log("Result (es):", parseBilingual(badDataString, 'es'));

    console.log("\n--- Testing Object Input ---");
    console.log("Input:", JSON.stringify(badDataObject));
    console.log("Result (en):", parseBilingual(badDataObject, 'en'));
    console.log("Result (es):", parseBilingual(badDataObject, 'es'));
}

test();
