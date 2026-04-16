-- 002_sql_workbench_rpc.sql
-- Ejecuta SELECT arbitrarios desde el cliente vía supabase.rpc('run_sql_workbench', { p_query: '...' }).
-- Debes ejecutar este script en Supabase: Dashboard > SQL Editor > Run.
--
-- Notas:
-- - Solo permite una sentencia (sin ; en medio).
-- - Debe empezar con SELECT o WITH (CTE).
-- - Resultado limitado a 1000 filas.
-- - SECURITY INVOKER: aplica RLS del usuario que llama (anon/authenticated).

CREATE OR REPLACE FUNCTION public.run_sql_workbench(p_query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  q text;
  result jsonb;
BEGIN
  q := trim(both from p_query);
  IF q = '' THEN
    RAISE EXCEPTION 'Consulta vacía';
  END IF;

  -- Quitar punto y coma final si existe (una sola sentencia)
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

-- Recarga la caché de esquema de PostgREST (API REST) para que aparezca la RPC sin esperar
SELECT pg_notify('pgrst', 'reload schema');
