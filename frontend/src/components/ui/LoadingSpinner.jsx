/**
 * LoadingSpinner - Simple loading indicator.
 * Purpose: Reusable loader for async operations.
 * Modify: Change size, color, or animation in CSS module.
 */
import styles from './LoadingSpinner.module.css'

export default function LoadingSpinner() {
  return <div className={styles.spinner} role="status" aria-label="Loading" />
}
