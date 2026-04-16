/**
 * Sidebar - Optional sidebar for secondary navigation.
 * Purpose: Layout component for dashboards with side navigation.
 * Modify: Add collapsible behavior, icons, or nested items.
 */
import { Link, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css'

const ITEMS = [
  { path: '/', label: 'Dashboard' },
  { path: '/data', label: 'Data Explorer' },
  { path: '/predict', label: 'Predictor' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {ITEMS.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`${styles.item} ${location.pathname === path ? styles.active : ''}`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
