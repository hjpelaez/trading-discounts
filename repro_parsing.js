
const locale = 'es';

function renderBilingual(val) {
    if (!val) return "";

    console.log("Input:", val, typeof val);

    let parsedVal = val;

    // Try to parse recursively up to 3 times
    let attempts = 0;
    while (typeof parsedVal === 'string' && (parsedVal.trim().startsWith('{') || parsedVal.trim().startsWith('"')) && attempts < 5) {
        try {
            console.log(`Attempt ${attempts + 1}: Parsing string...`);
            const result = JSON.parse(parsedVal);
            parsedVal = result;
            console.log("Parsed result:", parsedVal, typeof parsedVal);
        } catch (e) {
            console.log("Parse error:", e.message);
            break;
        }
        attempts++;
    }

    if (typeof parsedVal === 'string') return parsedVal;

    if (typeof parsedVal === 'object' && parsedVal !== null) {
        // Get the candidate translation
        let candidate = parsedVal[locale] || parsedVal.en || parsedVal.es || "";
        console.log("Extracted candidate:", candidate);

        // CHECK IF CANDIDATE ITSELF IS A JSON STRING
        if (typeof candidate === 'string' && (candidate.trim().startsWith('{') || candidate.trim().startsWith('"'))) {
            try {
                const inner = JSON.parse(candidate);
                // If that parsed into an object, maybe it has keys? 
                // Or if it parsed into a string?
                if (typeof inner === 'object' && inner !== null) {
                    return inner[locale] || inner.en || inner.es || candidate;
                }
                return inner;
            } catch (e) { }
        }

        return candidate;
    }

    return String(val);
};

// Test Cases based on theories
const cases = [
    // 1. Double encoded string
    '"{\\\"en\\\":\\\"Hello\\\",\\\"es\\\":\\\"Hola\\\"}"',
    // 2. Triple encoded?
    '"\\"{\\\\\\\"en\\\\\\\":\\\\\\\"Hello\\\\\\\",\\\\\\\"es\\\\\\\":\\\\\\\"Hola\\\\\\\"}\\\""',
    // 3. The "Mixed" bug theory: Object containing stringified JSON as value
    JSON.stringify({ en: JSON.stringify({ es: "Hola (Nested)" }) }),
    // 4. The raw screenshot string approximation
    '{"en":"{\\"es\\":\\"Líder en prop trading...\\",\\"en\\":\\"Leader...\\"}"}',
    // 5. Valid object
    { en: "Hello", es: "Hola" }
];

cases.forEach((c, i) => {
    console.log(`\n--- Case ${i + 1} ---`);
    const res = renderBilingual(c);
    console.log("Final Output:", res);
});
