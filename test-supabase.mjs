// Quick test script to verify Supabase connection
// Run with: node --loader ts-node/esm test-supabase.mjs

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jepnznorrcorvbbxlgba.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcG56bm9ycmNvcnZiYnhsZ2JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzM5NzgsImV4cCI6MjA4NDkwOTk3OH0.Uv_no7GvF5AgVSEiWJM-kpidZ5VlK_WwPVm3iM0dJh8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
    console.log('🔍 Testing Supabase connection...\n')

    // Test different table name variations
    const tableNames = ['Subscriber', 'subscriber', 'subscribers', 'Subscribers']
    let foundTableName = null

    for (const tableName of tableNames) {
        console.log(`Testing table name: "${tableName}"...`)
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1)

        if (!error) {
            console.log(`✅ Found table: "${tableName}"`)
            console.log(`   Records found: ${data?.length || 0}`)
            if (data && data.length > 0) {
                console.log(`   Sample record:`, JSON.stringify(data[0], null, 2))
            }
            foundTableName = tableName
            break // Exit loop once a valid table is found
        } else {
            console.log(`❌ "${tableName}" - ${error.message}`)
        }
    }

    if (!foundTableName) {
        console.error('❌ No valid table name found among variations. Exiting.')
        return
    }
    console.log('✅ Connection successful\n')

    // Test 2: Try to fetch all subscribers
    console.log('2. Fetching subscribers...')
    const { data: subscribers, error: fetchError } = await supabase
        .from('Subscriber')
        .select('*')

    if (fetchError) {
        console.error('❌ Fetch failed:', fetchError.message)
        return
    }
    console.log(`✅ Found ${subscribers?.length || 0} subscribers`)
    console.log('Data:', JSON.stringify(subscribers, null, 2))
    console.log('\n')

    // Test 3: Try to insert a test record
    console.log('3. Testing insert...')
    const testEmail = `test-${Date.now()}@example.com`
    const { data: inserted, error: insertError } = await supabase
        .from('Subscriber')
        .insert([{ email: testEmail, name: 'Test User' }])
        .select()

    if (insertError) {
        console.error('❌ Insert failed:', insertError.message)
        return
    }
    console.log('✅ Insert successful:', inserted)

    // Clean up test record
    if (inserted && inserted[0]) {
        await supabase
            .from('Subscriber')
            .delete()
            .eq('id', inserted[0].id)
        console.log('✅ Test record cleaned up\n')
    }

    console.log('🎉 All tests passed!')
}

testConnection().catch(console.error)
