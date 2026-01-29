import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function definitiveScrub() {
    console.log('DEFINITIVE SCRUB - Purging all headers and numbers...');

    const { data: pages, error } = await supabase.from('Page').select('*').in('slug', ['disclaimer', 'privacy-policy', 'terms-of-service']);
    if (error) return console.error(error);

    for (const page of pages) {
        let content = { ...page.content };
        let modified = false;

        for (const lang in content) {
            let s = content[lang];

            // 1. Remove the specific redundant risk headers
            s = s.replace(/<h2[^>]*>\s*(ADVERTENCIA DE RIESGO DE INVERSIÓN \(CRÍTICO\)|HIGH-RISK INVESTMENT WARNING \(CRITICAL\))\s*<\/h2>/gi, '');

            // 2. Remove ANY manual numbering from ANY h2 tag (e.g. "1. ", "5. ")
            s = s.replace(/<h2([^>]*)>\s*\d+\.\s+/gi, '<h2$1>');

            // 3. Remove any manual numbering from standard h2
            s = s.replace(/<h2>\s*\d+\.\s+/gi, '<h2>');

            // 4. Remove blue color classes (text-primary) just in case
            s = s.replace(/text-primary/g, 'text-foreground');

            // 5. Clean up any double spaces or empty tags left behind
            s = s.replace(/<h2>\s*<\/h2>/gi, '');

            if (content[lang] !== s) {
                content[lang] = s;
                modified = true;
            }
        }

        if (modified) {
            console.log(`- CLEANED: ${page.slug}`);
            await supabase.from('Page').update({ content, lastUpdated: new Date().toISOString() }).eq('id', page.id);
        }
    }
    console.log('Scrub complete.');
}

definitiveScrub();
