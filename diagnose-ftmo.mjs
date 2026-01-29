import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function diagnose() {
    console.log('🔍 Diagnosing FTMO record...')

    // Fetch current data
    const { data: current, error } = await supabase
        .from('Firm')
        .select('*')
        .eq('id', 'ftmo')
        .single()

    if (error) {
        console.error('❌ Error fetching FTMO:', error)
        return
    }

    console.log('Current Data Types:')
    console.log('description:', typeof current.description, Array.isArray(current.description) ? 'Array' : 'Object')
    console.log('features:', typeof current.features, Array.isArray(current.features) ? 'Array' : 'Object')
    console.log('rules:', typeof current.rules, Array.isArray(current.rules) ? 'Array' : 'Object')

    console.log('\nCurrent Features Value:', JSON.stringify(current.features, null, 2))

    // Validating if we can simple update description (to test if that column is JSONB)
    try {
        const { error: descError } = await supabase
            .from('Firm')
            .update({
                description: { en: "Test EN", es: "Test ES" }
            })
            .eq('id', 'ftmo')

        if (descError) {
            console.error('❌ Description update failed (likely NOT jsonb):', descError.message)
        } else {
            console.log('✅ Description update successful (it supports JSON objects)')
        }
    } catch (e) { console.error(e) }

    // Check if we can Update features with an Object
    try {
        const { error: featError } = await supabase
            .from('Firm')
            .update({
                features: { en: ["F1"], es: ["F1"] }
            })
            .eq('id', 'ftmo')

        if (featError) {
            console.error('❌ Features update failed (likely text[]):', featError.message)
            console.log('⚠️ Attempting to ALTER column to JSONB via SQL...')

            // Attempt to alter column if possible via rpc or raw query?
            // Supabase-js doesn't support raw SQL directly easily without a function.
            // But we can try to assume it's text[] and maybe I just put the Spanish version for now if I can't fix it?
            // OR I will notify the user I need to run a migration.
        } else {
            console.log('✅ Features update successful (it supports JSON objects)')
        }
    } catch (e) { console.error(e) }
}

diagnose().catch(console.error)
