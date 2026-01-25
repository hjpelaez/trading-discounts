-- Run this in Supabase SQL Editor to sync your database manually

-- 1. Remove the 'source' column (no longer needed)
ALTER TABLE "Subscriber" DROP COLUMN IF EXISTS "source";

-- 2. Add the 'name' column (for the new form)
ALTER TABLE "Subscriber" ADD COLUMN IF NOT EXISTS "name" TEXT;
