/**
 * Generic data fetching hook for Supabase.
 * Purpose: Centralized way to query Supabase tables. Components MUST use this hook, never fetch Supabase directly.
 * Modify: Add auth, realtime subscriptions, or more filter types here.
 *
 * @example
 * // Simple fetch
 * const { data, loading, error, refetch } = useSupabase('products')
 *
 * @example
 * // With filters
 * const { data } = useSupabase('orders', { status: 'pending' })
 *
 * @example
 * // With order, limit and custom select
 * const { data } = useSupabase('events', {}, { column: 'created_at', ascending: false }, 50, {
 *   select: 'id,name,created_at',
 * })
 *
 * @param {string} tableName - Supabase table name
 * @param {Object} [filters] - Optional. { key: value } pairs for .eq filters
 * @param {Object} [order] - Optional. { column, ascending } for .order()
 * @param {number} [limit] - Optional. Max rows to return
 * @param {Object} [options] - Optional. { select, enabled, inFilters, gteFilters, lteFilters }
 * @returns {{ data: any[], loading: boolean, error: Error|null, refetch: () => Promise<void> }}
 */
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

export function useSupabase(tableName, filters = {}, order = null, limit = null, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {
    select = '*',
    enabled = true,
    inFilters = {},
    gteFilters = {},
    lteFilters = {},
  } = options

  const fetchData = useCallback(async () => {
    if (!tableName || !enabled) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let query = supabase.from(tableName).select(select)

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          query = query.eq(key, value)
        }
      })
      Object.entries(inFilters).forEach(([key, values]) => {
        if (Array.isArray(values) && values.length > 0) {
          query = query.in(key, values)
        }
      })
      Object.entries(gteFilters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          query = query.gte(key, value)
        }
      })
      Object.entries(lteFilters).forEach(([key, value]) => {
        if (value != null && value !== '') {
          query = query.lte(key, value)
        }
      })

      if (order) {
        query = query.order(order.column, { ascending: order.ascending ?? true })
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data: rows, error: err } = await query

      if (err) throw err
      setData(rows || [])
    } catch (err) {
      setError(err)
      setData([])
    } finally {
      setLoading(false)
    }
  }, [
    tableName,
    select,
    enabled,
    JSON.stringify(filters),
    JSON.stringify(inFilters),
    JSON.stringify(gteFilters),
    JSON.stringify(lteFilters),
    order?.column,
    order?.ascending,
    limit,
  ])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
