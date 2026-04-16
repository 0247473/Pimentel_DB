/**
 * KpiCard - Reusable KPI metric card with optional trend.
 * Purpose: Display a single metric with optional icon and trend indicator.
 * Modify: Add more variants or custom styling.
 */
import styles from './KpiCard.module.css'

export default function KpiCard({ title, value, subtitle, icon, trend, color = 'primary' }) {
  const trendUp = trend != null && trend >= 0
  const trendColor = trendUp ? styles.trendUp : styles.trendDown

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.value} style={color ? { color: `var(--color-${color})` } : undefined}>
        {value}
      </div>
      {(subtitle || trend != null) && (
        <div className={styles.footer}>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
          {trend != null && (
            <span className={`${styles.trend} ${trendColor}`}>
              {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}
