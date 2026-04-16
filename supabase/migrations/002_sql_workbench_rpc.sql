-- Deprecado: el workbench del frontend ya no usa esta RPC (solo SELECT * FROM tabla vía REST).
-- Si en tu proyecto de Supabase creaste run_sql_workbench y quieres eliminarla:
--
-- DROP FUNCTION IF EXISTS public.run_sql_workbench(text);
-- NOTIFY pgrst, 'reload schema';

SELECT 1;
