/**
 * DataTable - Paginated, sortable data table with search.
 * Purpose: Display tabular data with filtering and pagination.
 * Columns may optionally define:
 * - sortable?: boolean
 * - render?: (value, row) => ReactNode
 */
import { useState, useMemo } from 'react'
import styles from './DataTable.module.css'

export default function DataTable({ data = [], columns = [], pageSize = 10 }) {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [pageSizeState, setPageSizeState] = useState(pageSize)

  const filteredData = useMemo(() => {
    if (!search) return data
    const s = search.toLowerCase()
    return data.filter((row) =>
      columns.some((c) => {
        const v = row[c.key]
        return v != null && String(v).toLowerCase().includes(s)
      })
    )
  }, [data, search, columns])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortAsc ? cmp : -cmp
    })
  }, [filteredData, sortKey, sortAsc])

  const totalPages = Math.ceil(sortedData.length / pageSizeState) || 1
  const start = page * pageSizeState
  const rows = sortedData.slice(start, start + pageSizeState)

  const handleSort = (key) => {
    const col = columns.find((c) => c.key === key)
    if (col?.sortable === false) return
    setSortKey(key)
    setSortAsc(sortKey === key ? !sortAsc : true)
  }

  const handlePageSizeChange = (e) => {
    const next = Number(e.target.value)
    setPageSizeState(next)
    setPage(0)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className={styles.search}
        />
        <span className={styles.count}>
          {sortedData.length} fila{sortedData.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={col.sortable !== false ? styles.sortable : ''}
                >
                  {col.label}
                  {sortKey === col.key && (sortAsc ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => {
                  const rawValue = row[col.key]
                  const content = col.render ? col.render(rawValue, row) : rawValue ?? '—'
                  return <td key={col.key}>{content}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <div>
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            ← Anterior
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{ marginLeft: '0.5rem' }}
          >
            Siguiente →
          </button>
        </div>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <div>
          <label style={{ marginRight: '0.5rem', fontSize: '0.8rem' }}>Filas por página:</label>
          <select value={pageSizeState} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>
    </div>
  )
}
