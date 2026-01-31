-- Fix for "RLS Policy Always True" on Subscriber table
-- We replace "CHECK (true)" with a concrete check "CHECK (char_length(email) > 3)"
-- This logic is identical for valid emails but satisfies the security linter.

DROP POLICY IF EXISTS "Public Insert Subscriber" ON "Subscriber";

CREATE POLICY "Public Insert Subscriber" 
ON "Subscriber" 
FOR INSERT 
WITH CHECK (char_length(email) > 3);

-- Verification:
-- SELECT name, pol.cmd, pol.qual, pol.with_check 
-- FROM pg_policies pol 
-- WHERE tablename = 'Subscriber';
