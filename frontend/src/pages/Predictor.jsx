/**
 * Predictor - EduInsights ML predictor page.
 * Propósito: Permite ingresar los datos del estudiante y consultar el modelo de ML.
 */
import { useState, useEffect, useRef } from 'react'
import { useMLPredict } from '../hooks/useMLPredict'
import MLPredictor from '../components/predictor/MLPredictor'

const MODEL_DESCRIPTION =
  'Este predictor estima si un estudiante aprobará matemáticas (score ≥ 60) usando 7 características del dataset.'

const MAX_HISTORY = 5

export default function Predictor() {
  const { predict, result, loading, error, reset } = useMLPredict()
  const [history, setHistory] = useState([])
  const lastInputRef = useRef(null)

  const handlePredict = async (inputData) => {
    lastInputRef.current = inputData
    await predict(inputData)
  }

  const handleReset = () => {
    reset()
  }

  useEffect(() => {
    if (!result || loading) return
    const input = lastInputRef.current
    if (input == null) return
    setHistory((prev) =>
      [
        {
          input,
          prediction: result.prediction,
          confidence: result.confidence,
          label: result.label,
          at: new Date(),
        },
        ...prev,
      ].slice(0, MAX_HISTORY)
    )
    lastInputRef.current = null
  }, [result, loading])

  const isPass = result && (result.prediction === 1 || result.label === 'Aprueba')
  const confidencePct = result?.confidence != null ? Math.round(result.confidence * 100) : null

  return (
    <div>
      <header style={{ marginBottom: '1.5rem' }}>
        <h1>Predictor de Rendimiento</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Ingresa los datos del estudiante para predecir si aprobará matemáticas
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Panel izquierdo: formulario */}
        <MLPredictor onPredict={handlePredict} loading={loading} error={error} onReset={handleReset} />

        {/* Panel derecho: resultado + historial */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Resultado */}
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              padding: '1.25rem 1.5rem',
              borderLeft: result
                ? `4px solid ${isPass ? 'var(--color-success)' : 'var(--color-danger)'}`
                : '4px solid #e5e7eb',
            }}
          >
            {!result && !loading && !error && (
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
                Completa el formulario y presiona <strong>Predecir Resultado</strong> para ver el resultado.
              </div>
            )}

            {loading && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                Consultando el modelo...
              </div>
            )}

            {result && !loading && (
              <>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.7rem',
                      borderRadius: 999,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      background: isPass ? '#bbf7d0' : '#fee2e2',
                      color: isPass ? '#166534' : '#b91c1c',
                    }}
                  >
                    {isPass ? '✅ APRUEBA' : '⚠️ EN RIESGO'}
                  </span>
                </div>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
                  {isPass
                    ? 'El modelo predice que este estudiante aprobará matemáticas.'
                    : 'El modelo predice que este estudiante podría reprobar matemáticas.'}
                </p>

                {confidencePct != null && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                        marginBottom: '0.25rem',
                      }}
                    >
                      <span>Confianza del modelo</span>
                      <span>{confidencePct}%</span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: 8,
                        borderRadius: 999,
                        background: '#e5e7eb',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, confidencePct))}%`,
                          height: '100%',
                          background: isPass ? 'var(--color-success)' : 'var(--color-danger)',
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Historial */}
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              padding: '1rem 1.25rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem' }}>Últimas Predicciones</h3>
            {history.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                Las predicciones de esta sesión aparecerán aquí.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {history.map((h, i) => {
                  const time = h.at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  const pass = h.prediction === 1 || h.label === 'Aprueba'
                  const conf = h.confidence != null ? Math.round(h.confidence * 100) : null
                  return (
                    <li
                      key={i}
                      style={{
                        padding: '0.5rem 0',
                        borderTop: i === 0 ? 'none' : '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <div>
                        <div style={{ color: 'var(--color-text-muted)', marginBottom: '0.15rem' }}>{time}</div>
                        <div>
                          {h.input.gender}, {h.input.ethnicity},{' '}
                          {h.input.test_prep === 'completed' ? 'con prep' : 'sin prep'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontWeight: 600,
                            color: pass ? 'var(--color-success)' : 'var(--color-danger)',
                            marginBottom: '0.1rem',
                          }}
                        >
                          {pass ? 'Aprueba' : 'En riesgo'}
                        </div>
                        {conf != null && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{conf}% conf.</div>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Sección informativa */}
      <section
        style={{
          marginTop: '0.5rem',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius)',
          background: 'var(--color-primary-light)',
          border: '1px solid #c7d2fe',
          fontSize: '0.85rem',
          color: '#4338ca',
        }}
      >
        <h3 style={{ margin: '0 0 0.4rem', fontSize: '0.9rem' }}>ℹ️ ¿Cómo funciona este modelo?</h3>
        <p style={{ margin: 0 }}>
          Este predictor usa un modelo de Random Forest entrenado con datos de 1,000 estudiantes. Analiza 7
          características para estimar la probabilidad de aprobar matemáticas (score ≥ 60). La confianza indica qué tan
          seguro está el modelo — valores sobre 75% son considerados confiables.
        </p>
      </section>
    </div>
  )
}
