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
          Workbench
        </Link>
        <Link to="/explorer" className={styles.link}>
          Schema Explorer
        </Link>
      </div>
    </nav>
  )
}
