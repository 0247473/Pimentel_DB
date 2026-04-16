/**
 * ML API client for prediction requests.
 * Purpose: Centralized HTTP client for the ML service.
 * Modify: Change endpoints, add auth headers, or new methods here.
 *
 * BASE_URL: Set via VITE_ML_API_URL in .env.local
 * To use a different model endpoint: add a new method and update the route in the API.
 */

const BASE_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000'

/**
 * POST /predict - Sends input features and returns prediction.
 * @param {Object} inputData - Object with feature keys matching your model's input
 * @returns {Promise<{prediction: *, confidence: number, label?: string}>}
 */
export async function predict(inputData) {
  try {
    const res = await fetch(`${BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputData),
    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.detail || `ML API error: ${res.status} ${res.statusText}`)
    }

    return await res.json()
  } catch (err) {
    if (err.message) throw err
    throw new Error('Failed to reach ML API. Is it running? Check VITE_ML_API_URL.')
  }
}

/**
 * GET /health - Checks if the ML API is up and model is loaded.
 * @returns {Promise<{status: string, model_loaded: boolean}>}
 */
export async function healthCheck() {
  try {
    const res = await fetch(`${BASE_URL}/health`)
    if (!res.ok) throw new Error(`Health check failed: ${res.status}`)
    return await res.json()
  } catch (err) {
    if (err.message) throw err
    throw new Error('Failed to reach ML API. Check VITE_ML_API_URL.')
  }
}
