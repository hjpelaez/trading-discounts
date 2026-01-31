-- 1. Enable RLS on all tables
ALTER TABLE "Firm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Page" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DynamicTranslation" ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (Guesses common names to cleanup)
DO $$ 
DECLARE 
  pol RECORD;
BEGIN 
  FOR pol IN SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' 
  LOOP 
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', pol.policyname, pol.tablename); 
  END LOOP; 
END $$;

-- 3. Define Public Read Policies (Content is visible to everyone)
CREATE POLICY "Public Read Firms" ON "Firm" FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON "Course" FOR SELECT USING (true);
CREATE POLICY "Public Read Pages" ON "Page" FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON "Setting" FOR SELECT USING (true);
CREATE POLICY "Public Read BlogPosts" ON "BlogPost" FOR SELECT USING (true);
CREATE POLICY "Public Read BlogCategories" ON "BlogCategory" FOR SELECT USING (true);
CREATE POLICY "Public Read Translations" ON "DynamicTranslation" FOR SELECT USING (true);

-- 4. Define Restricted Write Policies (Only Authenticated Users can Edit/Delete/Insert)
-- Checks if user is authenticated. 
-- IMPORTANT: Ensure Public Signup is disabled in Supabase if "Authenticated" means "Admin".
CREATE POLICY "Admin All Firm" ON "Firm" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Course" ON "Course" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Page" ON "Page" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Setting" ON "Setting" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All BlogPost" ON "BlogPost" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All BlogCategory" ON "BlogCategory" FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin All Translation" ON "DynamicTranslation" FOR ALL USING (auth.role() = 'authenticated');

-- 5. Special Case: Subscribers (Newsletter)
-- Anyone can Insert (Subscribe)
CREATE POLICY "Public Insert Subscriber" ON "Subscriber" FOR INSERT WITH CHECK (true);
-- Only Admin can Read (Select) and Delete
CREATE POLICY "Admin Read Subscriber" ON "Subscriber" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Subscriber" ON "Subscriber" FOR DELETE USING (auth.role() = 'authenticated');
