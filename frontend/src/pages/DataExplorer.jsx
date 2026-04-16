import styles from './Dashboard.module.css'
import { useSupabase } from '../hooks/useSupabase'

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

export default function DataExplorer() {
  const contentSchema = useSupabase('content', {}, null, 1)
  const genresSchema = useSupabase('genres', {}, null, 1)
  const profilesSchema = useSupabase('profiles', {}, null, 1)
  const tiersSchema = useSupabase('subscription_tiers', {}, null, 1)
  const historySchema = useSupabase('watch_history', {}, null, 1)

  const groupedSchemas = {
    content: contentSchema.data?.[0]
      ? Object.keys(contentSchema.data[0]).map((name) => ({ name, type: typeof contentSchema.data[0][name] }))
      : TABLE_SCHEMAS.content,
    genres: genresSchema.data?.[0]
      ? Object.keys(genresSchema.data[0]).map((name) => ({ name, type: typeof genresSchema.data[0][name] }))
      : TABLE_SCHEMAS.genres,
    profiles: profilesSchema.data?.[0]
      ? Object.keys(profilesSchema.data[0]).map((name) => ({ name, type: typeof profilesSchema.data[0][name] }))
      : TABLE_SCHEMAS.profiles,
    subscription_tiers: tiersSchema.data?.[0]
      ? Object.keys(tiersSchema.data[0]).map((name) => ({ name, type: typeof tiersSchema.data[0][name] }))
      : TABLE_SCHEMAS.subscription_tiers,
    watch_history: historySchema.data?.[0]
      ? Object.keys(historySchema.data[0]).map((name) => ({ name, type: typeof historySchema.data[0][name] }))
      : TABLE_SCHEMAS.watch_history,
  }

  const loading =
    contentSchema.loading ||
    genresSchema.loading ||
    profilesSchema.loading ||
    tiersSchema.loading ||
    historySchema.loading

  const error =
    contentSchema.error ||
    genresSchema.error ||
    profilesSchema.error ||
    tiersSchema.error ||
    historySchema.error

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Schema Explorer</h1>
        <p className={styles.subtitle}>Referencia rápida de tablas, columnas y tipos.</p>
      </header>

      <section className={styles.panel}>
        {error && (
          <div className={`${styles.status} ${styles.error}`}>
            <strong>Error:</strong> {error.message}
          </div>
        )}
        {loading && <div className={styles.statusHint}>Cargando esquema...</div>}
        <div className={styles.schemaList}>
          {Object.entries(groupedSchemas).map(([tableName, tableColumns]) => (
            <section key={tableName} className={styles.schemaCard}>
              <h2 className={styles.schemaTitle}>{tableName}</h2>
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
      </section>
    </div>
  )
}
