import { Link } from 'react-router-dom'
import KoiMascot from '../../components/KoiMascot/KoiMascot'
import {
  JOURNAL_EMPTY,
  JOURNAL_EYEBROW_PAGE,
  JOURNAL_SERIES_TITLE,
} from '../../config/brand'
import { getAllPosts } from '../../data/journal'
import { useInView } from '../../hooks/useInView'
import { formatDate } from '../../lib/formatDate'
import styles from './Journal.module.css'

function TimelineEntry({ post }) {
  const { ref, inView } = useInView()
  return (
    <li
      ref={ref}
      className={`${styles.entry} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <span className={styles.node} aria-hidden="true" />
      <article className={styles.card}>
        <p className={styles.meta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          <span>{post.readTime} min read</span>
        </p>
        <h2 className={styles.entryTitle}>
          <Link to={`/journal/${post.slug}`} className={styles.entryLink}>
            {post.title}
          </Link>
          {post.published === false && (
            <span className={styles.draft}>Draft</span>
          )}
        </h2>
        <p className={styles.summary}>{post.summary}</p>
        {post.tags.length > 0 && (
          <ul className={styles.tags}>
            {post.tags.map((tag) => (
              <li key={tag} className={styles.tag}>
                {tag}
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  )
}

function Journal() {
  const posts = getAllPosts()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.mascotBlock}>
          <KoiMascot variant="hero" className={styles.heroMascot} />
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{JOURNAL_EYEBROW_PAGE}</p>
          <h1 className={styles.title}>{JOURNAL_SERIES_TITLE}</h1>
        </div>
      </header>

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <KoiMascot variant="hero" className={styles.emptyMascot} />
          <p className={styles.emptyText}>{JOURNAL_EMPTY}</p>
        </div>
      ) : (
        <ol className={styles.timeline}>
          {posts.map((post) => (
            <TimelineEntry key={post.slug} post={post} />
          ))}
        </ol>
      )}
    </div>
  )
}

export default Journal
