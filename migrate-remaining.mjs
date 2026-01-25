// Migration script for remaining data: Pages, Categories, Translations, Settings
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migratePages() {
    console.log('📄 Migrating Pages...')
    try {
        const pagesData = JSON.parse(readFileSync('./src/lib/pages.json', 'utf-8'))
        const pages = pagesData.map(page => ({
            slug: page.slug.en, // Use English slug as ID
            slugMap: page.slug,
            title: page.title,
            content: page.content,
            lastUpdated: new Date(page.lastUpdated).toISOString(),
        }))

        const { data, error } = await supabase.from('Page').upsert(pages)
        if (error) throw error
        console.log(`✅ Migrated ${pages.length} pages`)
        return true
    } catch (e) {
        console.error('❌ Error migrating pages:', e.message)
        return false
    }
}

async function migrateCategories() {
    console.log('📁 Migrating Blog Categories...')
    try {
        const categoriesData = JSON.parse(readFileSync('./src/lib/categories.json', 'utf-8'))
        const categories = categoriesData.map(name => ({ name }))

        const { data, error } = await supabase.from('BlogCategory').upsert(categories)
        if (error) throw error
        console.log(`✅ Migrated ${categories.length} categories`)
        return true
    } catch (e) {
        console.error('❌ Error migrating categories:', e.message)
        return false
    }
}

async function migrateTranslations() {
    console.log('🌐 Migrating Dynamic Translations...')
    try {
        const transData = JSON.parse(readFileSync('./src/lib/translations.json', 'utf-8'))
        const translations = Object.entries(transData).map(([key, value]) => ({
            key,
            en: value.en,
            es: value.es,
        }))

        const { data, error } = await supabase.from('DynamicTranslation').upsert(translations)
        if (error) throw error
        console.log(`✅ Migrated ${translations.length} translations`)
        return true
    } catch (e) {
        console.error('❌ Error migrating translations:', e.message)
        return false
    }
}

async function migrateSettings() {
    console.log('⚙️ Migrating Settings...')
    try {
        const settingsData = JSON.parse(readFileSync('./src/lib/settings.json', 'utf-8'))
        const settings = {
            id: 'default',
            socials: settingsData.socials,
        }

        const { data, error } = await supabase.from('Setting').upsert(settings)
        if (error) throw error
        console.log(`✅ Migrated settings`)
        return true
    } catch (e) {
        console.error('❌ Error migrating settings:', e.message)
        return false
    }
}

async function main() {
    console.log('🚀 Starting remaining migration...\n')
    await migratePages()
    await migrateCategories()
    await migrateTranslations()
    await migrateSettings()
    console.log('\n🎉 Finished!')
}

main().catch(console.error)
