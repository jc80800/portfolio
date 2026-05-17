import StackTags from '../StackTags/StackTags'
import styles from './GalleryCard.module.css'

function GalleryCard({ item, displayIndex, className = '', style }) {
  const { title, tagline, stack, proves, githubUrl, status } = item
  const isWip = status === 'wip'
  const showGithub = Boolean(githubUrl)

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
      <p className={styles.proves}>
        <span className={styles.provesLabel}>Proves:</span> {proves}
      </p>
      <div className={styles.actions}>
        {showGithub ? (
          <a
            className={styles.link}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${title} on GitHub`}
          >
            View on GitHub
          </a>
        ) : (
          <span className={styles.soon}>Coming soon</span>
        )}
      </div>
    </article>
  )
}

export default GalleryCard
