-- ============================================
-- SUPABASE MIGRATION: Pages, Categories, Translations, Settings
-- ============================================

-- Table: Page
CREATE TABLE IF NOT EXISTS "Page" (
  slug TEXT PRIMARY KEY, -- We'll use the english slug as primary or just a unique id
  "slugMap" JSONB NOT NULL, -- {"en": "terms", "es": "terminos"}
  title JSONB NOT NULL,
  content JSONB NOT NULL,
  "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: BlogCategory
CREATE TABLE IF NOT EXISTS "BlogCategory" (
  name TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: DynamicTranslation
CREATE TABLE IF NOT EXISTS "DynamicTranslation" (
  key TEXT PRIMARY KEY,
  en TEXT NOT NULL,
  es TEXT NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: Setting
CREATE TABLE IF NOT EXISTS "Setting" (
  id TEXT PRIMARY KEY DEFAULT 'default',
  "socials" JSONB NOT NULL,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE "Page" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DynamicTranslation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Allow public read access to pages" ON "Page" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog categories" ON "BlogCategory" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dynamic translations" ON "DynamicTranslation" FOR SELECT USING (true);
CREATE POLICY "Allow public read access to settings" ON "Setting" FOR SELECT USING (true);

-- Authenticated management
CREATE POLICY "Allow authenticated users to manage pages" ON "Page" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage categories" ON "BlogCategory" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage translations" ON "DynamicTranslation" FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated users to manage settings" ON "Setting" FOR ALL TO authenticated USING (true) WITH CHECK (true);
