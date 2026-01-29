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

async function diagnose() {
    console.log('--- DATABASE HEADER DIAGNOSIS ---');
    const { data: pages, error } = await supabase.from('Page').select('*').in('slug', ['disclaimer', 'privacy-policy', 'terms-of-service']);

    for (const page of pages) {
        console.log(`Page: ${page.slug}`);
        for (const lang in page.content) {
            const content = page.content[lang];
            const h2Match = content.match(/<h2[^>]*>.*?<\/h2>/gi);
            console.log(`  Lang ${lang}:`, h2Match);
        }
    }
}

diagnose();
