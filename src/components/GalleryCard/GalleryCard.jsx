import StackTags from '../StackTags/StackTags'
import styles from './GalleryCard.module.css'

function GalleryCard({ item, displayIndex, className = '', style }) {
  const { title, tagline, stack, githubUrl, liveUrl, status } = item
  const isWip = status === 'wip'
  const showLive = Boolean(liveUrl)
  const showGithub = Boolean(githubUrl)
  const showSoon = !showLive && !showGithub && isWip

  return (
    <article className={`${styles.card} ${className}`.trim()} style={style}>
      {displayIndex != null && (
        <span className={styles.index} aria-hidden="true">
          {String(displayIndex).padStart(2, '0')}
        </span>
      )}
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {isWip && <span className={styles.badge}>WIP</span>}
      </div>
      <p className={styles.tagline}>{tagline}</p>
      <StackTags stack={stack} />
      <div className={styles.actions}>
        {showLive && (
          <a
            className={styles.link}
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${title}`}
          >
            Open app
          </a>
        )}
        {showGithub && (
          <a
            className={styles.link}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on GitHub`}
          >
            View on GitHub
          </a>
        )}
        {showSoon && <span className={styles.soon}>Coming soon</span>}
      </div>
    </article>
  )
}

export default GalleryCard
