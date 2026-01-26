-- =========================================================
-- SETUP SCRIPT: CREATE TABLE & SEED DATA FOR COURSES
-- =========================================================

-- 1. Create Course Table
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
-- Allow everyone to read
DROP POLICY IF EXISTS "Allow public read access to courses" ON "Course";
CREATE POLICY "Allow public read access to courses" ON "Course"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to manage
DROP POLICY IF EXISTS "Allow authenticated users to manage courses" ON "Course";
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

-- 2. Seed Data (15 Sample Courses)
INSERT INTO "Course" (
    id, title, description, instructor, link, "imageUrl", platform, rating, duration, featured, level, language, category, "priceLabel", "priceMin", "priceMax", "learningPoints"
) VALUES 
-- 1. Crypto Masterclass (English, High Ticket)
(
    'crypto-master-2025',
    'Crypto Trading Masterclass 2025',
    'The ultimate guide to Bitcoin, Ethereum and Altcoin trading. Master technical analysis and on-chain data.',
    'Alex Hormozi',
    'https://example.com/crypto1',
    'https://images.unsplash.com/photo-1518546305927-5a440bbabb91?w=800&q=80',
    'Teachable',
    4.9,
    '12h 30m',
    true,
    'All Levels',
    'English',
    'Crypto',
    '$497',
    497,
    null,
    '["Blockchain Fundamentals", "Advanced Technical Analysis", "Risk Management"]'::jsonb
),
-- 2. Forex Zero to Hero (Spanish, Mid Ticket)
(
    'forex-zero-hero',
    'Forex de Cero a Rentable',
    'Aprende a operar el mercado de divisas sin indicadores. Acción del precio pura y estructura de mercado.',
    'Juan Trading',
    'https://example.com/forex1',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80',
    'Hotmart',
    4.7,
    '8h',
    true,
    'Beginner',
    'Spanish',
    'Forex',
    '$297',
    297,
    null,
    '["Estructura de Mercado", "Psicología del Trading", "Gestión de Capital"]'::jsonb
),
-- 3. ICT Concepts (English, Free)
(
    'ict- mentorship',
    'ICT Inner Circle Trader Concepts',
    'Deep dive into Smart Money Concepts (SMC). Learn to trade like the institutions with liquidity and fair value gaps.',
    'Michael J. Huddleston',
    'https://youtube.com',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80',
    'YouTube',
    5.0,
    '40h+',
    false,
    'Advanced',
    'English',
    'Futures',
    'Free',
    0,
    null,
    '["Order Blocks", "Fair Value Gaps", "Liquidity Runs"]'::jsonb
),
-- 4. Futures Scalping (English, Subscription Range)
(
    'futures-scalping',
    'Naked Trading & Futures Scalping',
    'High frequency scalping strategies for S&P 500 and Nasdaq futures. No indicators, just price.',
    'Tom Dante',
    'https://example.com/futures1',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80',
    'Vimeo',
    4.8,
    '15h',
    false,
    'Advanced',
    'English',
    'Futures',
    '$49/mo',
    49,
    null,
    '["DOM Reading", "Volume Profile", "Execution Speed"]'::jsonb
),
-- 5. Estrategias de Opciones (Spanish, Cheap)
(
    'opciones-financieras',
    'Dominando las Opciones Financieras',
    'Genera ingresos pasivos vendiendo opciones. Iron Condors, Butterflies y más.',
    'Maria Inversiones',
    'https://example.com/options1',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    'Udemy',
    4.6,
    '6h',
    false,
    'Intermediate',
    'Spanish',
    'Options',
    '$29',
    29,
    null,
    '["Venta de Puts", "Covered Calls", "Gestión de Griegas"]'::jsonb
),
-- 6. Algorithmic Trading Python (English, Expensive)
(
    'algo-trading-python',
    'Algorithmic Trading with Python',
    'Build and deploy your own trading bots using Python, Pandas, and Backtrader.',
    'Tech Trader',
    'https://example.com/algo1',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    'Coursera',
    4.9,
    '25h',
    true,
    'Advanced',
    'English',
    'Stocks',
    '$997',
    997,
    null,
    '["Python Backtesting", "API Integration", "Bot Deployment"]'::jsonb
),
-- 7. Psicología del Trading (Spanish, Ebook/Course)
(
    'psicologia-trading',
    'Psicología y Gestión Emocional',
    'El 90% del trading es mental. Aprende a controlar el FOMO, la ira y la euforia.',
    'Dr. Trading',
    'https://example.com/psych',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    'Teachable',
    4.5,
    '4h',
    false,
    'All Levels',
    'Spanish',
    'General',
    '$47',
    47,
    null,
    '["Mindfulness", "Diario de Trading", "Rutinas de Alto Rendimiento"]'::jsonb
),
-- 8. Swing Trading Stocks (English, Mid)
(
    'swing-stocks',
    'Swing Trading Growth Stocks',
    'Catch the meat of the move. CANSLIM methodology and trend following for US Stocks.',
    'Mark Minervini Style',
    'https://example.com/stocks1',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    'Private',
    4.8,
    '10h',
    false,
    'Intermediate',
    'English',
    'Stocks',
    '$497',
    497,
    null,
    '["VCP Patterns", "Risk/Reward", "Portfolio Management"]'::jsonb
),
-- 9. Smart Money en Español (Spanish, Free/Range)
(
    'smc-espanol',
    'Conceptos Smart Money (SMC) en Español',
    'Todo lo que necesitas saber sobre SMC explicado en tu idioma. Order blocks y liquidez.',
    'Pedro FX',
    'https://youtube.com',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80',
    'YouTube',
    4.9,
    '12h',
    true,
    'Advanced',
    'Spanish',
    'Forex',
    'Gratis',
    0,
    null,
    '["Rangos Asiáticos", "Killzones", "Estructura Fractal"]'::jsonb
),
-- 10. Options Income Generation (English)
(
    'options-income-pro',
    'Monthly Income with Options',
    'Learn how to generate consistent monthly income using conservative option selling strategies. Wheel Strategy explained.',
    'Options Alpha Style',
    'https://example.com/options2',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?w=800&q=80',
    'Teachable',
    4.7,
    '8h',
    false,
    'Intermediate',
    'English',
    'Options',
    '$197',
    197,
    null,
    '["The Wheel Strategy", "Selling Covered Calls", "Cash Secured Puts"]'::jsonb
),
-- 11. Criptomonedas 101 (Spanish, Beginner)
(
    'cripto-basico',
    'Criptomonedas para Principiantes',
    'Entiende bitcoin, blockchain y cómo comprar tu primera cripto de forma segura sin caer en estafas.',
    'Hola Cripto',
    'https://example.com/crypto2',
    'https://images.unsplash.com/photo-1518546305927-5a440bbabb91?w=800&q=80',
    'Udemy',
    4.8,
    '5h',
    false,
    'Beginner',
    'Spanish',
    'Crypto',
    '$19',
    19,
    null,
    '["Qué es Bitcoin", "Wallets Frías vs Calientes", "Evitar Scams"]'::jsonb
),
-- 12. Volume Profile Mastery (English, Advanced)
(
    'vol-profile-master',
    'Volume Profile & Order Flow',
    'See where the big money is hiding. Use Volume Profile (VPVR) to find key support and resistance levels.',
    'Trader Dale',
    'https://example.com/volprofile',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    'Private',
    4.9,
    '15h',
    true,
    'Advanced',
    'English',
    'Futures',
    '$299',
    299,
    null,
    '["Volume Profile Shapes", "VWAP Strategies", "Footprint Charts"]'::jsonb
),
-- 13. Trading Institucional (Spanish, Advanced)
(
    'institucional-latam',
    'Trading Institucional Avanzado',
    'Descubre cómo operan los bancos centrales y los fondos de cobertura. Deja de operar como un minorista.',
    'Forex Latam',
    'https://example.com/insti',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&q=80',
    'Hotmart',
    4.6,
    '20h',
    true,
    'Advanced',
    'Spanish',
    'Forex',
    '$497',
    497,
    null,
    '["Manipulación de Mercado", "Niveles Institucionales", "Correlaciones"]'::jsonb
),
-- 14. Stock Market Investing (English, Long Term)
(
    'value-investing-101',
    'Value Investing Fundamentals',
    'Warren Buffett style investing. How to read balance sheets and find undervalued companies.',
    'Investing Academy',
    'https://example.com/value',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80',
    'Coursera',
    4.5,
    '10h',
    false,
    'Beginner',
    'English',
    'Stocks',
    'Free',
    0,
    null,
    '["Financial Statement Analysis", "Moat & Competitive Advantage", "Intrinsic Value Calculation"]'::jsonb
),
-- 15. Bot de Trading en 1 Hora (Spanish, Algo)
(
    'bot-trading-express',
    'Crea tu primer Bot de Trading',
    'Taller práctico para programar un bot sencillo en TradingView (Pine Script) y automatizar alertas.',
    'PrograTrading',
    'https://example.com/botap',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
    'YouTube',
    4.7,
    '2h',
    false,
    'Intermediate',
    'Spanish',
    'General',
    'Gratis',
    0,
    null,
    '["Intro a Pine Script", "Backtesting Básico", "Conectar Alertas"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    "priceLabel" = EXCLUDED."priceLabel",
    "priceMin" = EXCLUDED."priceMin";
