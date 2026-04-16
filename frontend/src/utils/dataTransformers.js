/**
 * Helper functions for transforming data for charts.
 * Purpose: Reusable data reshaping for Recharts and aggregations.
 * Modify: Add new transforms or adapt to your schema.
 */

/**
 * Groups array of objects by a key and returns aggregated sums for numeric keys.
 * @param {Object[]} data - Array of objects
 * @param {string} key - Key to group by
 * @returns {Object[]} Array of { [key]: value, ...numericSums }
 * @example groupBy([{ cat: 'A', n: 1 }, { cat: 'A', n: 2 }], 'cat') => [{ cat: 'A', n: 3 }]
 */
export function groupBy(data, key) {
  const map = {}
  data.forEach((row) => {
    const k = row[key]
    if (!map[k]) map[k] = { [key]: k }
    Object.keys(row).forEach((col) => {
      if (col !== key && typeof row[col] === 'number') {
        map[k][col] = (map[k][col] || 0) + row[col]
      }
    })
  })
  return Object.values(map)
}

/**
 * Aggregates values by group key.
 * @param {Object[]} data - Array of objects
 * @param {string} groupKey - Key to group by
 * @param {string} valueKey - Key to aggregate
 * @param {'sum'|'avg'|'count'} aggregation - Aggregation type
 * @returns {Object[]} Array of { name: groupValue, value: number }
 */
export function aggregateByKey(data, groupKey, valueKey, aggregation = 'sum') {
  const map = {}
  data.forEach((row) => {
    const k = row[groupKey]
    if (!map[k]) map[k] = { sum: 0, count: 0 }
    const v = row[valueKey]
    if (typeof v === 'number') {
      map[k].sum += v
      map[k].count += 1
    }
  })
  return Object.entries(map).map(([name, o]) => ({
    name,
    value: aggregation === 'avg' ? (o.count ? o.sum / o.count : 0) : aggregation === 'count' ? o.count : o.sum,
  }))
}

/**
 * Formats data for Recharts PieChart.
 * @param {Object[]} data - Array of objects
 * @param {string} nameKey - Key for slice name
 * @param {string} valueKey - Key for slice value
 * @returns {Object[]} Array of { name, value } for PieChart
 */
export function formatForPieChart(data, nameKey, valueKey) {
  return (data || []).map((row) => ({ name: String(row[nameKey]), value: Number(row[valueKey]) || 0 }))
}

/**
 * Normalizes a numeric column to 0-1 range.
 * @param {Object[]} data - Array of objects
 * @param {string} key - Numeric key to normalize
 * @returns {Object[]} Same array with [key] replaced by normalized value
 */
export function normalizeValues(data, key) {
  const vals = data.map((r) => r[key]).filter((v) => typeof v === 'number')
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  return data.map((row) => ({
    ...row,
    [key]: typeof row[key] === 'number' ? (row[key] - min) / range : row[key],
  }))
}
