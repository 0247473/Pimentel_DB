/**
 * Ejecuta SQL de solo lectura vía RPC en Supabase (run_sql_workbench).
 * Los componentes no deben llamar a supabase.rpc directamente; usan este hook.
 */
import { useState, useCallback } from 'react'
import { supabase } from '../services/supabase'

const RPC_NAME = import.meta.env.VITE_SQL_WORKBENCH_RPC || 'run_sql_workbench'

function normalizeRpcRows(payload) {
  if (payload == null) return []
  if (Array.isArray(payload)) return payload
  if (typeof payload === 'string') {
    try {
      const parsed = JSON.parse(payload)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

export function useExecuteSql() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const execute = useCallback(async (queryText) => {
    setLoading(true)
    setError(null)
    try {
      const { data: raw, error: err } = await supabase.rpc(RPC_NAME, {
        p_query: queryText,
      })
      if (err) throw err
      setData(normalizeRpcRows(raw))
    } catch (err) {
      setError(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, execute }
}
