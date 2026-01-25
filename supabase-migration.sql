-- ============================================
-- SUPABASE MIGRATION: Firms & Blog Posts
-- ============================================

-- Table: Firm
-- Stores all prop firm data with comprehensive details
CREATE TABLE IF NOT EXISTS "Firm" (
  -- Basic Info
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  discount TEXT NOT NULL,
  code TEXT NOT NULL,
  link TEXT NOT NULL,
  "imageUrl" TEXT,
  featured BOOLEAN DEFAULT false,
  rating DECIMAL(2,1) NOT NULL,
  "trustpilotScore" DECIMAL(2,1),
  
  -- Categories & Platforms
  categories TEXT[] NOT NULL,
  platforms TEXT[] NOT NULL,
  
  -- Firm Details
  country TEXT,
  "activeYears" INTEGER,
  "maxAllocation" TEXT,
  broker TEXT,
  
  -- Trading Info
  "minPrice" INTEGER NOT NULL,
  "maxLeverage" TEXT NOT NULL,
  "drawdownType" TEXT NOT NULL,
  
  -- Instruments & Assets
  instruments TEXT[],
  assets TEXT[],
  
  -- Features & Rules
  features TEXT[] NOT NULL,
  rules TEXT[] NOT NULL,
  "consistencyRules" TEXT,
  "prohibitedPractices" TEXT[],
  
  -- Payout Info
  "paymentMethods" TEXT[] NOT NULL,
  "payoutMethods" TEXT[],
  "payoutFrequency" TEXT,
  "minPayout" TEXT,
  
  -- Timestamps
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: BlogPost
-- Stores blog posts with multilingual support
CREATE TABLE IF NOT EXISTS "BlogPost" (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  
  -- Multilingual fields (JSON)
  title JSONB NOT NULL,
  excerpt JSONB NOT NULL,
  content JSONB NOT NULL,
  
  -- Metadata
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  "imageUrl" TEXT,
  "publishedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE "Firm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Firm
CREATE POLICY "Allow public read access to firms" ON "Firm"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage firms" ON "Firm"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for BlogPost
CREATE POLICY "Allow public read access to blog posts" ON "BlogPost"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage blog posts" ON "BlogPost"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_firm_categories ON "Firm" USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_firm_featured ON "Firm" (featured);
CREATE INDEX IF NOT EXISTS idx_firm_rating ON "Firm" (rating DESC);
CREATE INDEX IF NOT EXISTS idx_blogpost_slug ON "BlogPost" (slug);
CREATE INDEX IF NOT EXISTS idx_blogpost_category ON "BlogPost" (category);
CREATE INDEX IF NOT EXISTS idx_blogpost_published ON "BlogPost" ("publishedAt" DESC);
