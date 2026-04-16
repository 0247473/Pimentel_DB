/**
 * Hook for ML prediction requests.
 * Purpose: Manages prediction state and calls mlApi.predict.
 * Modify: Add caching, debouncing, or batch predictions if needed.
 *
 * @returns {{ predict: (input: Object) => Promise<void>, result: Object|null, loading: boolean, error: Error|null, reset: () => void }}
 */
import { useState, useCallback } from 'react'
import * as mlApi from '../services/mlApi'

export function useMLPredict() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const predict = useCallback(async (inputData) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await mlApi.predict(inputData)
      setResult(res)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { predict, result, loading, error, reset }
}
