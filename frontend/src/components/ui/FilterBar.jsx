/**
 * FilterBar - Flexible filter controls for data pages.
 * Purpose: Emits filter state changes so pages can pass to useSupabase.
 * Modify: Add more filter types (date, multi-select, etc).
 */
import { useState, useEffect } from 'react'
import styles from './FilterBar.module.css'

/**
 * @param {Array<{key: string, label: string, type: 'select'|'range'|'text', options?: Array<{value: string|number, label: string}>}>} filters
 * @param {Function} onChange - (state: Object) => void
 */
export default function FilterBar({ filters = [], onChange }) {
  const [state, setState] = useState({})

  useEffect(() => {
    const initial = {}
    filters.forEach((f) => {
      if (f.type === 'select' && f.options?.length) initial[f.key] = f.options[0].value
      else if (f.type === 'range') initial[f.key] = { min: f.min ?? 0, max: f.max ?? 100 }
      else initial[f.key] = ''
    })
    setState(initial)
  }, [filters])

  useEffect(() => {
    onChange?.(state)
  }, [state, onChange])

  const update = (key, value) => {
    setState((s) => ({ ...s, [key]: value }))
  }

  return (
    <div className={styles.bar}>
      {filters.map((f) => (
        <div key={f.key} className={styles.field}>
          <label>{f.label}</label>
          {f.type === 'select' && (
            <select
              value={state[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              className={styles.input}
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          {f.type === 'range' && (
            <div className={styles.range}>
              <input
                type="number"
                placeholder="Min"
                value={state[f.key]?.min ?? ''}
                onChange={(e) =>
                  update(f.key, { ...state[f.key], min: e.target.value ? Number(e.target.value) : undefined })
                }
                min={f.min}
                max={f.max}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Max"
                value={state[f.key]?.max ?? ''}
                onChange={(e) =>
                  update(f.key, { ...state[f.key], max: e.target.value ? Number(e.target.value) : undefined })
                }
                min={f.min}
                max={f.max}
                className={styles.input}
              />
            </div>
          )}
          {f.type === 'text' && (
            <input
              type="text"
              placeholder={f.label}
              value={state[f.key] ?? ''}
              onChange={(e) => update(f.key, e.target.value)}
              className={styles.input}
            />
          )}
        </div>
      ))}
    </div>
  )
}
