-- 1. Enable RLS on all tables
ALTER TABLE "Firm" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Course" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Page" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Setting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BlogCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DynamicTranslation" ENABLE ROW LEVEL SECURITY;

-- 2. Clean up existing permissive policies (Drop if they exist)
-- Note: You might see errors if they don't exist, that's fine.
DROP POLICY IF EXISTS "Enable read access for all users" ON "Firm";
DROP POLICY IF EXISTS "Enable write access for all users" ON "Firm";
-- (Repeat for other tables if you had previous policies, generic drop below attempts to cover common names or you can just drop all policies via UI if easier)
-- For this script, we will just CREATE OR REPLACE via creating new names or dropping specific ones we know might be there from "True" warnings.
-- Assuming standard default names or custom ones. Best robust way is to drop specific known insecure ones if we knew names.
-- Since we don't, we'll proceed to CREATE policies. Supabase policies are additive, so we MUST ensure no "USING (true)" policies remain.
-- INSTRUCTION TO USER: Please delete any existing policies in the dashboard before running this, OR run these drops:

DROP POLICY IF EXISTS "Public Access" ON "Firm";
DROP POLICY IF EXISTS "Public Access" ON "Course";
DROP POLICY IF EXISTS "Public Access" ON "Page";
DROP POLICY IF EXISTS "Public Access" ON "Setting";
DROP POLICY IF EXISTS "Public Access" ON "Subscriber";
DROP POLICY IF EXISTS "Public Access" ON "BlogPost";
DROP POLICY IF EXISTS "Public Access" ON "BlogCategory";
DROP POLICY IF EXISTS "Public Access" ON "DynamicTranslation";

-- 3. Define Public Read Policies (Content is visible to everyone)
CREATE POLICY "Public Read Firms" ON "Firm" FOR SELECT USING (true);
CREATE POLICY "Public Read Courses" ON "Course" FOR SELECT USING (true);
CREATE POLICY "Public Read Pages" ON "Page" FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON "Setting" FOR SELECT USING (true);
CREATE POLICY "Public Read BlogPosts" ON "BlogPost" FOR SELECT USING (true);
CREATE POLICY "Public Read BlogCategories" ON "BlogCategory" FOR SELECT USING (true);
CREATE POLICY "Public Read Translations" ON "DynamicTranslation" FOR SELECT USING (true);

-- 4. Define Restricted Write Policies (Only Authenticated Users can Edit/Delete/Insert)
-- This assumes "Authenticated" = Admin. If you have public signup, you MUST disable it in Supabase Auth Settings.
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
-- Only Admin can Read/Delete Subscribers
CREATE POLICY "Admin All Subscriber" ON "Subscriber" FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Delete Subscriber" ON "Subscriber" FOR DELETE USING (auth.role() = 'authenticated');
