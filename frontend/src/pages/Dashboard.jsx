/**
 * Dashboard - SQL Workbench + Schema Explorer.
 * Purpose: Execute SELECT queries (incl. JOINs) via RPC and inspect schema reference.
 */
import { useMemo, useState } from 'react'
import { useSupabase } from '../hooks/useSupabase'
import { useExecuteSql } from '../hooks/useExecuteSql'
import styles from './Dashboard.module.css'

const ALLOWED_TABLES = ['content', 'genres', 'profiles', 'subscription_tiers', 'watch_history']
const DEFAULT_SQL = `SELECT c.title, g.name AS genero
FROM content c
JOIN genres g ON c.genre_id = g.id
LIMIT 50;`
const TABLE_SCHEMAS = {
  content: [
    { name: 'id', type: 'uuid' },
    { name: 'title', type: 'text' },
    { name: 'release_year', type: 'integer' },
    { name: 'genre_id', type: 'uuid' },
    { name: 'duration_minutes', type: 'integer' },
  ],
  genres: [
    { name: 'id', type: 'uuid' },
    { name: 'name', type: 'text' },
  ],
  profiles: [
    { name: 'id', type: 'uuid' },
    { name: 'user_id', type: 'uuid' },
    { name: 'display_name', type: 'text' },
    { name: 'age_rating', type: 'text' },
  ],
  subscription_tiers: [
    { name: 'id', type: 'uuid' },
    { name: 'tier_name', type: 'text' },
    { name: 'price_usd', type: 'numeric' },
    { name: 'max_screens', type: 'integer' },
  ],
  watch_history: [
    { name: 'id', type: 'uuid' },
    { name: 'profile_id', type: 'uuid' },
    { name: 'content_id', type: 'uuid' },
    { name: 'watched_at', type: 'timestamp' },
    { name: 'progress_pct', type: 'integer' },
  ],
}

export default function Dashboard() {
  const [sql, setSql] = useState(DEFAULT_SQL)
  const [hasExecuted, setHasExecuted] = useState(false)

  const {
    data: rows,
    loading: rowsLoading,
    error: rowsError,
    execute,
  } = useExecuteSql()

  const contentSchema = useSupabase('content', {}, null, 1)
  const genresSchema = useSupabase('genres', {}, null, 1)
  const profilesSchema = useSupabase('profiles', {}, null, 1)
  const tiersSchema = useSupabase('subscription_tiers', {}, null, 1)
  const historySchema = useSupabase('watch_history', {}, null, 1)

  const columns = useMemo(() => {
    if (!rows || rows.length === 0) return []
    return Object.keys(rows[0])
  }, [rows])

  const schemaEntries = useMemo(() => {
    const byTableRows = {
      content: contentSchema.data,
      genres: genresSchema.data,
      profiles: profilesSchema.data,
      subscription_tiers: tiersSchema.data,
      watch_history: historySchema.data,
    }

    return ALLOWED_TABLES.map((tableName) => {
      const firstRow = byTableRows[tableName]?.[0]
      if (firstRow) {
        const inferred = Object.keys(firstRow).map((name) => ({
          name,
          type: typeof firstRow[name],
        }))
        return [tableName, inferred]
      }
      return [tableName, TABLE_SCHEMAS[tableName] || []]
    })
  }, [
    contentSchema.data,
    genresSchema.data,
    profilesSchema.data,
    tiersSchema.data,
    historySchema.data,
  ])

  const schemaLoading =
    contentSchema.loading ||
    genresSchema.loading ||
    profilesSchema.loading ||
    tiersSchema.loading ||
    historySchema.loading

  const schemaError =
    contentSchema.error ||
    genresSchema.error ||
    profilesSchema.error ||
    tiersSchema.error ||
    historySchema.error

  const handleExecute = async () => {
    const trimmed = sql.trim()
    if (!trimmed) {
      return
    }
    setHasExecuted(true)
    await execute(trimmed)
  }

  const renderStatusMessage = () => {
    if (rowsError) {
      return (
        <div className={`${styles.status} ${styles.error}`}>
          <strong>Error:</strong> {rowsError.message}
        </div>
      )
    }

    if (rowsLoading) {
      return <div className={styles.statusHint}>Ejecutando query...</div>
    }

    if (hasExecuted && !rowsError) {
      return (
        <div className={`${styles.status} ${styles.success}`}>
          <strong>Success:</strong>{' '}
          {rows.length > 0
            ? `${rows.length} fila(s) devueltas.`
            : 'Consulta ejecutada (0 filas).'}
        </div>
      )
    }

    return (
      <div className={styles.statusHint}>
        Pulsa Execute para ejecutar el SQL (SELECT o WITH … SELECT; también JOINs y alias).
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>SQL Workbench</h1>
        <p className={styles.subtitle}>
          Ejecuta consultas SQL y usa el esquema como referencia rápida.
        </p>
      </header>

      <section className={styles.layout}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Workbench</h2>
            <button className={styles.executeButton} onClick={handleExecute}>
              Execute
            </button>
          </div>

          <textarea
            className={styles.editor}
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            placeholder="SELECT * FROM content LIMIT 10;"
          />

          {renderStatusMessage()}

          <div className={styles.tableWrap}>
            {rowsLoading ? (
              <div className={styles.emptyState}>Cargando resultados...</div>
            ) : rows.length === 0 ? (
              <div className={styles.emptyState}>
                {hasExecuted && !rowsError
                  ? 'La consulta no devolvió filas.'
                  : 'No hay resultados para mostrar.'}
              </div>
            ) : (
              <table className={styles.resultsTable}>
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={`${row.id ?? 'row'}-${index}`}>
                      {columns.map((column) => (
                        <td key={`${column}-${index}`}>{String(row[column] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </article>

        <aside className={styles.panel}>
          <h2 className={styles.panelTitle}>Schema Explorer</h2>
          <p className={styles.schemaSubtitle}>Tablas y tipos para referencia rápida.</p>

          {schemaError && (
            <div className={`${styles.status} ${styles.error}`}>
              <strong>Error:</strong> {schemaError.message}
            </div>
          )}

          {schemaLoading && <div className={styles.statusHint}>Cargando esquema...</div>}

          <div className={styles.schemaList}>
            {schemaEntries.map(([tableName, tableColumns]) => (
              <section key={tableName} className={styles.schemaCard}>
                <h3 className={styles.schemaTitle}>{tableName}</h3>
                <ul className={styles.schemaColumns}>
                  {tableColumns.length === 0 && <li>Sin columnas visibles.</li>}
                  {tableColumns.map((column) => (
                    <li key={`${tableName}-${column.name}`}>
                      <span className={styles.columnName}>{column.name}</span>
                      <span className={styles.columnType}>{column.type}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </aside>
      </section>
    </div>
  )
}
