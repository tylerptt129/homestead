-- Homestead Forge — Complete Seed Data
-- Run each chunk in order. Each file is a self-contained DO block.
-- Usage: cat seed/01_land_assessment.sql seed/02_water.sql ... | psql
-- Or run individually: psql -f seed/01_land_assessment.sql

-- To run all seed files in order, use:
-- for f in supabase/seed/*.sql; do psql "$DATABASE_URL" -f "$f"; done

\i seed/01_land_assessment.sql
\i seed/02_water.sql
\i seed/03_shelter.sql
\i seed/04_power.sql
\i seed/05_garden.sql
\i seed/06_orchard.sql
\i seed/07_livestock.sql
\i seed/08_preservation.sql
\i seed/09_tools.sql
\i seed/10_security.sql
\i seed/11_finance.sql
\i seed/12_community.sql
