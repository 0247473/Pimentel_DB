/**
 * DataExplorer - Explorador de Datos para la tabla `students`.
 * Propósito: Filtrar, ver y exportar el dataset crudo según el PRD.
 */
import { useState, useMemo } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import FilterBar from '../components/ui/FilterBar'
import DataTable from '../components/ui/DataTable'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import styles from '../components/ui/DataTable.module.css'

const TABLE_NAME = 'students'
const TOTAL_ROWS = 1000

const FILTER_CONFIG = [
  {
    key: 'gender',
    label: 'Género',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  },
  {
    key: 'parental_education',
    label: 'Educación Parental',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: 'some high school', label: 'Some high school' },
      { value: 'high school', label: 'High school' },
      { value: 'some college', label: 'Some college' },
      { value: "associate's degree", label: "Associate's degree" },
      { value: "bachelor's degree", label: "Bachelor's degree" },
      { value: "master's degree", label: "Master's degree" },
    ],
  },
  {
    key: 'test_prep',
    label: 'Curso de Prep.',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: 'completed', label: 'Completado' },
      { value: 'none', label: 'No completado' },
    ],
  },
  {
    key: 'math_score_range',
    label: 'Math Score',
    type: 'range',
    min: 0,
    max: 100,
  },
  {
    key: 'pass_math',
    label: 'Resultado',
    type: 'select',
    options: [
      { value: '', label: 'Todos' },
      { value: '1', label: 'Aprobó' },
      { value: '0', label: 'Reprobó' },
    ],
  },
]

const COLUMNS = [
  { key: 'id', label: '#', sortable: true },
  {
    key: 'gender',
    label: 'Género',
    sortable: true,
    render: (value) => {
      if (value === 'male') {
        return <span className={`${styles.badge} ${styles.badgeMale}`}>Male</span>
      }
      if (value === 'female') {
        return <span className={`${styles.badge} ${styles.badgeFemale}`}>Female</span>
      }
      return '—'
    },
  },
  { key: 'ethnicity', label: 'Grupo', sortable: true },
  { key: 'parental_education', label: 'Educ. Parental', sortable: true },
  {
    key: 'lunch',
    label: 'Almuerzo',
    sortable: false,
    render: (value) => {
      if (value === 'standard') {
        return <span className={`${styles.badge} ${styles.badgeLunchStandard}`}>standard</span>
      }
      if (value === 'free/reduced') {
        return <span className={`${styles.badge} ${styles.badgeLunchFree}`}>free/reduced</span>
      }
      return '—'
    },
  },
  {
    key: 'test_prep',
    label: 'Curso Prep.',
    sortable: true,
    render: (value) => {
      if (value === 'completed') {
        return <span className={`${styles.badge} ${styles.badgePrepCompleted}`}>completed</span>
      }
      if (value === 'none') {
        return <span className={`${styles.badge} ${styles.badgePrepNone}`}>none</span>
      }
      return '—'
    },
  },
  {
    key: 'math_score',
    label: 'Matemáticas',
    sortable: true,
    render: (value) => {
      const v = Number(value) || 0
      const width = Math.max(0, Math.min(100, v))
      return (
        <div className={styles.scoreCell}>
          <div className={styles.scoreValue}>{v}</div>
          <div className={styles.scoreBarOuter}>
            <div className={styles.scoreBarInner} style={{ width: `${width}%` }} />
          </div>
        </div>
      )
    },
  },
  {
    key: 'reading_score',
    label: 'Lectura',
    sortable: true,
    render: (value) => {
      const v = Number(value) || 0
      const width = Math.max(0, Math.min(100, v))
      return (
        <div className={styles.scoreCell}>
          <div className={styles.scoreValue}>{v}</div>
          <div className={styles.scoreBarOuter}>
            <div className={styles.scoreBarInner} style={{ width: `${width}%` }} />
          </div>
        </div>
      )
    },
  },
  {
    key: 'writing_score',
    label: 'Escritura',
    sortable: true,
    render: (value) => {
      const v = Number(value) || 0
      const width = Math.max(0, Math.min(100, v))
      return (
        <div className={styles.scoreCell}>
          <div className={styles.scoreValue}>{v}</div>
          <div className={styles.scoreBarOuter}>
            <div className={styles.scoreBarInner} style={{ width: `${width}%` }} />
          </div>
        </div>
      )
    },
  },
  {
    key: 'pass_math',
    label: 'Resultado',
    sortable: true,
    render: (value) => {
      if (value === 1 || value === '1') {
        return <span className={`${styles.badge} ${styles.badgeResultPass}`}>Aprobó</span>
      }
      if (value === 0 || value === '0') {
        return <span className={`${styles.badge} ${styles.badgeResultFail}`}>Reprobó</span>
      }
      return '—'
    },
  },
]

function exportToCSV(data, columns, filename = 'export.csv') {
  const headers = columns.map((c) => c.label).join(',')
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const v = row[c.key]
        const asString = v == null ? '' : String(v)
        return asString.includes(',') ? `"${asString}"` : asString
      })
      .join(',')
  )
  const csv = [headers, ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function DataExplorer() {
  const [rawFilterState, setRawFilterState] = useState({})
  const [appliedFilters, setAppliedFilters] = useState({})
  const [mathRange, setMathRange] = useState({ min: 0, max: 100 })
  const [filterKey, setFilterKey] = useState(0)

  const { data, loading, error } = useSupabase(TABLE_NAME, appliedFilters)

  const filteredByRange = useMemo(() => {
    return data.filter((row) => {
      const score = Number(row.math_score)
      if (Number.isNaN(score)) return false
      return score >= mathRange.min && score <= mathRange.max
    })
  }, [data, mathRange])

  const handleApplyFilters = () => {
    const nextFilters = {}
    const gender = rawFilterState.gender
    const parental = rawFilterState.parental_education
    const prep = rawFilterState.test_prep
    const result = rawFilterState.pass_math
    const range = rawFilterState.math_score_range

    if (gender) nextFilters.gender = gender
    if (parental) nextFilters.parental_education = parental
    if (prep) nextFilters.test_prep = prep
    if (result !== '' && result != null) nextFilters.pass_math = Number(result)

    setAppliedFilters(nextFilters)

    if (range) {
      setMathRange({
        min: range.min ?? 0,
        max: range.max ?? 100,
      })
    }
  }

  const handleClearFilters = () => {
    setRawFilterState({})
    setAppliedFilters({})
    setMathRange({ min: 0, max: 100 })
    setFilterKey((k) => k + 1)
  }

  if (error) {
    return (
      <div>
        Error loading data: {error.message}. Check Supabase config and table name.
      </div>
    )
  }

  const shownCount = filteredByRange.length

  return (
    <div>
      <header style={{ marginBottom: '1rem' }}>
        <h1>Explorador de Datos</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          Filtra, ordena y exporta el dataset completo
        </p>
      </header>

      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--color-border)',
          padding: '1rem 1.25rem',
          marginBottom: '0.75rem',
        }}
      >
        <div style={{ marginBottom: '0.75rem' }}>
          <FilterBar key={filterKey} filters={FILTER_CONFIG} onChange={setRawFilterState} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={handleClearFilters}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Limpiar
          </button>
          <button
            onClick={handleApplyFilters}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius)',
              border: 'none',
              background: 'var(--color-primary)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500,
            }}
          >
            Aplicar filtros
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
        Mostrando <strong style={{ color: 'var(--color-primary)' }}>{shownCount}</strong> de{' '}
        <strong>{TOTAL_ROWS}</strong> estudiantes
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : filteredByRange.length === 0 ? (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--color-border)',
          }}
        >
          <p style={{ marginBottom: '0.75rem' }}>Ningún estudiante coincide con los filtros aplicados.</p>
          <button
            onClick={handleClearFilters}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--color-border)',
              background: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 500 }}>Resultados</div>
            <button
              onClick={() => exportToCSV(filteredByRange, COLUMNS)}
              disabled={!filteredByRange.length}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              ⬇ Exportar CSV
            </button>
          </div>
          <DataTable data={filteredByRange} columns={COLUMNS} pageSize={10} />
        </>
      )}
    </div>
  )
}
