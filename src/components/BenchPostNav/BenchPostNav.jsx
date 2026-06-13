import { Link } from 'react-router-dom'
import styles from './BenchPostNav.module.css'

function BenchPostNav({ projectSlug, prev, next }) {
  if (!prev && !next) return null

  return (
    <nav className={styles.nav} aria-label="Bench log entries">
      {prev ? (
        <Link
          to={`/bench/${projectSlug}/${prev.slug}`}
          className={`${styles.link} ${styles.prev}`}
        >
          <span className={styles.dir}>← Newer</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={`/bench/${projectSlug}/${next.slug}`}
          className={`${styles.link} ${styles.next}`}
        >
          <span className={styles.dir}>Older →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default BenchPostNav
