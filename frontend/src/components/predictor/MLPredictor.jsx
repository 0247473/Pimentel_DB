/**
 * MLPredictor - EduInsights-specific ML prediction form.
 * Mapea el formulario del PRD a los 7 features esperados por el modelo.
 *
 * Props: onPredict, loading, error, onReset
 */
import { useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import styles from './MLPredictor.module.css'

export default function MLPredictor({ onPredict, loading = false, error = null, onReset }) {
  const [gender, setGender] = useState('male')
  const [ethnicity, setEthnicity] = useState('group A')
  const [parentalEducation, setParentalEducation] = useState('some high school')
  const [lunch, setLunch] = useState('free/reduced')
  const [prepCompleted, setPrepCompleted] = useState(false)
  const [readingScore, setReadingScore] = useState(35)
  const [writingScore, setWritingScore] = useState(30)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      gender,
      ethnicity,
      parental_education: parentalEducation,
      lunch,
      test_prep: prepCompleted ? 'completed' : 'none',
      reading_score: Number(readingScore),
      writing_score: Number(writingScore),
    }
    await onPredict(payload)
  }

  const handleReset = () => {
    setGender('male')
    setEthnicity('group A')
    setParentalEducation('some high school')
    setLunch('free/reduced')
    setPrepCompleted(false)
    setReadingScore(35)
    setWritingScore(30)
    onReset?.()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.cardTitle}>
          <span className={styles.cardIcon}>🎓</span> Datos del Estudiante
        </h2>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Género */}
        <div className={styles.field}>
          <label className={styles.label}>Género</label>
          <div className={styles.pillGroup}>
            <button
              type="button"
              className={`${styles.pill} ${gender === 'male' ? styles.pillActive : ''}`}
              onClick={() => setGender('male')}
            >
              Masculino
            </button>
            <button
              type="button"
              className={`${styles.pill} ${gender === 'female' ? styles.pillActive : ''}`}
              onClick={() => setGender('female')}
            >
              Femenino
            </button>
          </div>
        </div>

        {/* Grupo étnico */}
        <div className={styles.field}>
          <label className={styles.label}>Grupo Étnico</label>
          <select
            value={ethnicity}
            onChange={(e) => setEthnicity(e.target.value)}
            className={styles.input}
          >
            <option value="group A">Group A</option>
            <option value="group B">Group B</option>
            <option value="group C">Group C</option>
            <option value="group D">Group D</option>
            <option value="group E">Group E</option>
          </select>
        </div>

        {/* Educación de los padres */}
        <div className={styles.field}>
          <label className={styles.label}>Nivel Educativo de los Padres</label>
          <select
            value={parentalEducation}
            onChange={(e) => setParentalEducation(e.target.value)}
            className={styles.input}
          >
            <option value="some high school">Some high school</option>
            <option value="high school">High school</option>
            <option value="some college">Some college</option>
            <option value="associate's degree">Associate's degree</option>
            <option value="bachelor's degree">Bachelor's degree</option>
            <option value="master's degree">Master's degree</option>
          </select>
        </div>

        {/* Tipo de almuerzo */}
        <div className={styles.field}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Tipo de Almuerzo</label>
            <span className={styles.tooltip}>ℹ️ Indicador de nivel socioeconómico</span>
          </div>
          <div className={styles.pillGroup}>
            <button
              type="button"
              className={`${styles.pill} ${lunch === 'standard' ? styles.pillActive : ''}`}
              onClick={() => setLunch('standard')}
            >
              Estándar
            </button>
            <button
              type="button"
              className={`${styles.pill} ${lunch === 'free/reduced' ? styles.pillActive : ''}`}
              onClick={() => setLunch('free/reduced')}
            >
              Subsidiado
            </button>
          </div>
        </div>

        {/* Curso de preparación */}
        <div className={styles.field}>
          <label className={styles.label}>Completó Curso de Preparación</label>
          <button
            type="button"
            className={`${styles.toggle} ${prepCompleted ? styles.toggleOn : ''}`}
            onClick={() => setPrepCompleted((v) => !v)}
          >
            <span className={styles.toggleThumb} />
          </button>
        </div>

        {/* Lectura */}
        <div className={styles.field}>
          <label className={styles.label}>Score de Lectura</label>
          <div className={styles.sliderRow}>
            <input
              type="number"
              min={0}
              max={100}
              value={readingScore}
              onChange={(e) =>
                setReadingScore(() => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return 0
                  return Math.max(0, Math.min(100, v))
                })
              }
              className={styles.numberInput}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={readingScore}
              onChange={(e) => setReadingScore(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        {/* Escritura */}
        <div className={styles.field}>
          <label className={styles.label}>Score de Escritura</label>
          <div className={styles.sliderRow}>
            <input
              type="number"
              min={0}
              max={100}
              value={writingScore}
              onChange={(e) =>
                setWritingScore(() => {
                  const v = Number(e.target.value)
                  if (Number.isNaN(v)) return 0
                  return Math.max(0, Math.min(100, v))
                })
              }
              className={styles.numberInput}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={writingScore}
              onChange={(e) => setWritingScore(Number(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={loading} className={styles.submit}>
            {loading ? (
              <>
                <LoadingSpinner /> <span style={{ marginLeft: '0.5rem' }}>Analizando...</span>
              </>
            ) : (
              <>
                <span style={{ marginRight: '0.25rem' }}>▶</span> Predecir Resultado
              </>
            )}
          </button>
          <button type="button" onClick={handleReset} className={styles.reset}>
            Limpiar
          </button>
        </div>

        {error && <div className={styles.error}>{error.message || 'La predicción falló'}</div>}
      </form>
    </div>
  )
}
