/**
 * BarChartWidget - Reusable bar chart.
 * To use: pass your data array and specify which keys map to the X and Y axes.
 * Props:
 * - data: array of objects
 * - xKey: string (category key)
 * - yKey: string (single metric key)
 * - title: string
 * - color: string (fallback color)
 * - height: number (px)
 * - layout: 'horizontal' | 'vertical' (default 'horizontal')
 * - series: optional array for grouped bars: [{ dataKey, color, name }]
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function BarChartWidget({
  data,
  xKey,
  yKey,
  title,
  color = '#6366f1',
  height = 300,
  layout = 'horizontal',
  series,
}) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </div>
    )
  }

  const isVertical = layout === 'vertical'
  const hasSeries = Array.isArray(series) && series.length > 0

  return (
    <div>
      {title && <h3>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={isVertical ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          {isVertical ? (
            <>
              <XAxis type="number" />
              <YAxis type="category" dataKey={xKey} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} />
              <YAxis />
            </>
          )}
          <Tooltip />
          {hasSeries ? (
            <>
              {series.map((s) => (
                <Bar
                  key={s.dataKey}
                  dataKey={s.dataKey}
                  fill={s.color || color}
                  radius={[4, 4, 0, 0]}
                  name={s.name}
                />
              ))}
              <Legend />
            </>
          ) : (
            <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
