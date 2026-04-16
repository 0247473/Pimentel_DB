-- 002_sql_workbench_rpc.sql
-- Ejecuta SELECT arbitrarios desde el cliente vía:
--   supabase.rpc('run_sql_workbench', { sql_text: '...' })
--
-- IMPORTANTE: ejecútalo en el MISMO proyecto que VITE_SUPABASE_URL
-- (Supabase Dashboard > SQL Editor > Run todo el archivo).
--
-- Si ves "Could not find the function ... in the schema cache":
-- 1) Confirma que esta query devuelve una fila:
--      SELECT proname, proargnames FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
--      WHERE n.nspname = 'public' AND proname = 'run_sql_workbench';
-- 2) Al final de este archivo se fuerza recarga del esquema de PostgREST.

-- Quitar versión anterior (misma firma text, distinto nombre de arg en metadatos)
DROP FUNCTION IF EXISTS public.run_sql_workbench(text);

CREATE OR REPLACE FUNCTION public.run_sql_workbench(sql_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  q text;
  result jsonb;
BEGIN
  q := trim(both from sql_text);
  IF q = '' THEN
    RAISE EXCEPTION 'Consulta vacía';
  END IF;

  WHILE length(q) > 0 AND right(q, 1) = ';' LOOP
    q := trim(both from left(q, length(q) - 1));
  END LOOP;

  IF position(';' IN q) > 0 THEN
    RAISE EXCEPTION 'Solo se permite una sentencia SQL (sin punto y coma en medio)';
  END IF;

  IF NOT (q ~* '^\s*(WITH|SELECT)\s') THEN
    RAISE EXCEPTION 'Solo se permiten consultas SELECT (o WITH ... SELECT)';
  END IF;

  EXECUTE
    'SELECT coalesce(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || q || ') AS t LIMIT 1000'
  INTO result;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION public.run_sql_workbench(text) IS
  'Workbench: ejecuta un SELECT y devuelve filas como jsonb (array de objetos).';

GRANT EXECUTE ON FUNCTION public.run_sql_workbench(text) TO anon, authenticated;

-- PostgREST (API REST): recargar caché de esquema
NOTIFY pgrst, 'reload schema';
SELECT pg_notify('pgrst', 'reload schema');
