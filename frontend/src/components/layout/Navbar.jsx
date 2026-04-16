/**
 * Navbar - Top navigation bar with links.
 * Purpose: Global navigation and branding.
 * Modify: Add auth, user menu, or more links.
 */
import { Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const APP_TITLE = import.meta.env.VITE_APP_TITLE || 'Data App'

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        {APP_TITLE}
      </Link>
      <div className={styles.links}>
        <Link to="/" className={styles.link}>
          Dashboard
        </Link>
        <Link to="/explorer" className={styles.link}>
          Explorador de Datos
        </Link>
        <Link to="/predictor" className={styles.link}>
          Predictor ML
        </Link>
      </div>
    </nav>
  )
}
