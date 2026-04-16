/**
 * PieChartWidget - Reusable pie chart.
 * To use: pass your data array and specify nameKey and valueKey (PieChart uses different keys than X/Y).
 * Props: data, nameKey, valueKey, title, color, height
 */
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import LoadingSpinner from '../ui/LoadingSpinner'

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

export default function PieChartWidget({
  data,
  nameKey,
  valueKey,
  title,
  color = '#6366f1',
  height = 300,
}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    )
  }

  const chartData = data.map((row) => ({ name: String(row[nameKey]), value: Number(row[valueKey]) || 0 }))

  return (
    <div>
      {title && <h3>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={DEFAULT_COLORS[i % DEFAULT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
