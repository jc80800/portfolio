import { useEffect, useState } from 'react'
import styles from './ReadingProgress.module.css'

function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className={styles.track} aria-hidden="true">
      <div
        className={styles.fill}
        data-testid="progress-fill"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
