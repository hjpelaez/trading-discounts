-- Table: Course
-- Stores trading courses with flexible pricing and AI-extracted data
CREATE TABLE IF NOT EXISTS "Course" (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor TEXT NOT NULL,
  
  -- Links & Media
  link TEXT NOT NULL,
  "imageUrl" TEXT,
  
  -- Metadata
  platform TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  duration TEXT,
  featured BOOLEAN DEFAULT false,
  level TEXT NOT NULL, -- Beginner, Intermediate, Advanced, All Levels
  
  -- New Fields
  language TEXT NOT NULL, -- English, Spanish, Mixed
  category TEXT NOT NULL, -- Forex, Crypto, Futures, Options, Stocks, General
  
  -- Flexible Pricing
  "priceLabel" TEXT NOT NULL, -- Display text e.g. "$497", "Free", "$97 - $197"
  "priceMin" NUMERIC,         -- For sorting/filtering
  "priceMax" NUMERIC,         -- Nullable, for ranges
  
  -- Rich Content
  "learningPoints" JSONB, -- Array of strings
  curriculum JSONB,       -- Array of modules: { title: string, lessons: string[] }
  
  -- Timestamps
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to courses" ON "Course"
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage courses" ON "Course"
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_featured ON "Course" (featured);
CREATE INDEX IF NOT EXISTS idx_course_rating ON "Course" (rating DESC);
CREATE INDEX IF NOT EXISTS idx_course_category ON "Course" (category);
CREATE INDEX IF NOT EXISTS idx_course_price ON "Course" ("priceMin");
CREATE INDEX IF NOT EXISTS idx_course_language ON "Course" (language);
