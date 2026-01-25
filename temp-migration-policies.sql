-- Temporary: Allow anonymous inserts for migration
-- Run this BEFORE migration

DROP POLICY IF EXISTS "Allow public read access to firms" ON "Firm";
DROP POLICY IF EXISTS "Allow authenticated users to manage firms" ON "Firm";
DROP POLICY IF EXISTS "Allow public read access to blog posts" ON "BlogPost";
DROP POLICY IF EXISTS "Allow authenticated users to manage blog posts" ON "BlogPost";

-- Temporary permissive policies for migration
CREATE POLICY "temp_allow_all_firms" ON "Firm"
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "temp_allow_all_blogposts" ON "BlogPost"
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
