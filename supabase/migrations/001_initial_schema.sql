-- 001_initial_schema.sql
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
--
-- How to run:
-- 1. Open Supabase Dashboard > SQL Editor
-- 2. Paste this migration
-- 3. Click Run
--
-- To add a computed column after creation:
-- ALTER TABLE sample_data ADD COLUMN full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED;
--
-- To add an index for frequently queried columns:
-- CREATE INDEX idx_sample_data_category ON sample_data(category);
-- CREATE INDEX idx_sample_data_created_at ON sample_data(created_at DESC);

-- Example CREATE TABLE template
-- Replace column names and types with your schema
CREATE TABLE IF NOT EXISTS sample_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  value NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE sample_data ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow anon read" ON sample_data FOR SELECT USING (true);
