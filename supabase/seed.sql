-- seed.sql
-- Example INSERT statements matching 001_initial_schema.sql
-- Run in Supabase SQL Editor after running the migration
--
-- Alternative: Import CSV via Supabase Dashboard
-- 1. Table Editor > sample_data (or your table) > Insert > Import data from CSV
-- 2. Upload your CSV and map columns

INSERT INTO sample_data (name, category, value) VALUES
  ('Item A', 'A', 100),
  ('Item B', 'A', 150),
  ('Item C', 'B', 200),
  ('Item D', 'B', 180),
  ('Item E', 'C', 90)
ON CONFLICT DO NOTHING;
