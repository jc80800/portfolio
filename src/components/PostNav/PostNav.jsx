import { Link } from 'react-router-dom'
import styles from './PostNav.module.css'

function PostNav({ prev, next }) {
  if (!prev && !next) return null

  return (
    <nav className={styles.nav} aria-label="Journal entries">
      {prev ? (
        <Link to={`/journal/${prev.slug}`} className={`${styles.link} ${styles.prev}`}>
          <span className={styles.dir}>← Newer</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link to={`/journal/${next.slug}`} className={`${styles.link} ${styles.next}`}>
          <span className={styles.dir}>Older →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

export default PostNav
