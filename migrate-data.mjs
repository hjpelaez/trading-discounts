// Migration script to populate Supabase with existing data
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const firmsData = JSON.parse(readFileSync('./src/lib/json_backup/firms.json', 'utf-8'))
const blogData = JSON.parse(readFileSync('./src/lib/json_backup/blog.json', 'utf-8'))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateFirms() {
    console.log('🏢 Migrating Firms...')

    const firms = firmsData.map(firm => ({
        id: firm.id,
        name: firm.name,
        description: firm.description,
        discount: firm.discount,
        code: firm.code,
        link: firm.link,
        imageUrl: firm.imageUrl || null,
        featured: firm.featured || false,
        rating: firm.rating,
        trustpilotScore: firm.trustpilotScore || null,
        categories: firm.categories,
        platforms: firm.platforms,
        country: null, // Placeholder
        activeYears: null, // Placeholder
        maxAllocation: null, // Placeholder
        broker: null, // Placeholder
        minPrice: firm.minPrice,
        maxLeverage: firm.maxLeverage,
        drawdownType: firm.drawdownType,
        instruments: null, // Placeholder
        assets: null, // Placeholder
        features: firm.features,
        rules: firm.rules,
        consistencyRules: null, // Placeholder
        prohibitedPractices: null, // Placeholder
        paymentMethods: firm.paymentMethods,
        payoutMethods: null, // Placeholder
        payoutFrequency: null, // Placeholder
        minPayout: null, // Placeholder
    }))

    const { data, error } = await supabase
        .from('Firm')
        .upsert(firms)
        .select()

    if (error) {
        console.error('❌ Error migrating firms:', error)
        return false
    }

    console.log(`✅ Migrated ${data.length} firms`)
    return true
}

async function migrateBlogPosts() {
    console.log('📝 Migrating Blog Posts...')

    const posts = blogData.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title, // Already in {"en": "...", "es": "..."} format
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        category: post.category,
        imageUrl: post.imageUrl || null,
        publishedAt: new Date(post.date).toISOString(),
    }))

    const { data, error } = await supabase
        .from('BlogPost')
        .upsert(posts)
        .select()

    if (error) {
        console.error('❌ Error migrating blog posts:', error)
        return false
    }

    console.log(`✅ Migrated ${data.length} blog posts`)
    return true
}

async function main() {
    console.log('🚀 Starting migration...\n')

    const firmsSuccess = await migrateFirms()
    const blogSuccess = await migrateBlogPosts()

    console.log('\n📊 Migration Summary:')
    console.log(`Firms: ${firmsSuccess ? '✅' : '❌'}`)
    console.log(`Blog Posts: ${blogSuccess ? '✅' : '❌'}`)

    if (firmsSuccess && blogSuccess) {
        console.log('\n🎉 Migration completed successfully!')
    } else {
        console.log('\n⚠️ Migration completed with errors')
    }
}

main().catch(console.error)
