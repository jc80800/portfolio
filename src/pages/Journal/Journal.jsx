import { Link, useSearchParams } from 'react-router-dom'
import {
  JOURNAL_EMPTY,
  JOURNAL_EYEBROW_PAGE,
  JOURNAL_EDITORIAL_NOTE,
  JOURNAL_INTRO,
  JOURNAL_SERIES_NOTE_AFTER,
  JOURNAL_SERIES_NOTE_BEFORE,
  JOURNAL_SERIES_NOTE_LINK,
  JOURNAL_SERIES_TITLE,
  JOURNAL_VIEW_ALL,
  JOURNAL_VIEW_ROADMAP,
  JOURNAL_VIEWS_TITLE,
} from '../../config/brand'
import { getAllPosts } from '../../data/journal'
import { useInView } from '../../hooks/useInView'
import { formatDate } from '../../lib/formatDate'
import { RoadmapView } from './RoadmapView'
import styles from './Journal.module.css'

function Journal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const posts = getAllPosts()
  const isRoadmap = searchParams.get('view') === 'roadmap'
  const activeTopic = searchParams.get('topic')
  const yearGroups = groupPostsByYear(posts)

  function handleSelectView(view) {
    setSearchParams(view === 'roadmap' ? { view: 'roadmap' } : {})
  }

  function handleToggleTopic(id) {
    if (activeTopic === id) {
      setSearchParams({ view: 'roadmap' })
    } else {
      setSearchParams({ view: 'roadmap', topic: id })
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroLead}>
          <p className={styles.eyebrow}>{JOURNAL_EYEBROW_PAGE}</p>
          <h1 className={styles.title}>{JOURNAL_SERIES_TITLE}</h1>
        </div>
        <div className={styles.heroAside}>
          <p className={styles.intro}>{JOURNAL_INTRO}</p>
          <p className={styles.editorialNote}>{JOURNAL_EDITORIAL_NOTE}</p>
        </div>
        <p className={styles.note}>
          {JOURNAL_SERIES_NOTE_BEFORE}
          <Link to="/journal?view=roadmap" className={styles.noteLink}>
            {JOURNAL_SERIES_NOTE_LINK}
          </Link>
          {JOURNAL_SERIES_NOTE_AFTER}
        </p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>{JOURNAL_VIEWS_TITLE}</h2>
          <nav className={styles.views} aria-label="Journal views">
            <button
              type="button"
              className={`${styles.viewButton} ${!isRoadmap ? styles.viewActive : ''}`}
              aria-pressed={!isRoadmap}
              onClick={() => handleSelectView('feed')}
            >
              {JOURNAL_VIEW_ALL}
              <span className={styles.viewCount}>{posts.length}</span>
            </button>
            <button
              type="button"
              className={`${styles.viewButton} ${isRoadmap ? styles.viewActive : ''}`}
              aria-pressed={isRoadmap}
              onClick={() => handleSelectView('roadmap')}
            >
              {JOURNAL_VIEW_ROADMAP}
            </button>
          </nav>
        </aside>

        <section className={styles.main} aria-label={isRoadmap ? JOURNAL_VIEW_ROADMAP : JOURNAL_VIEW_ALL}>
          {isRoadmap ? (
            <RoadmapView
              posts={posts}
              activeTopic={activeTopic}
              onToggleTopic={handleToggleTopic}
            />
          ) : posts.length === 0 ? (
            <p className={styles.empty}>{JOURNAL_EMPTY}</p>
          ) : (
            <div className={styles.feed}>
              {yearGroups.map(([year, yearPosts]) => (
                <div key={year} className={styles.yearGroup}>
                  <h2 className={styles.yearLabel}>{year}</h2>
                  <div className={styles.entries}>
                    {yearPosts.map((post) => (
                      <EntryCard key={post.slug} post={post} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function EntryCard({ post }) {
  const { ref, inView } = useInView()
  return (
    <article
      ref={ref}
      className={`${styles.entry} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <p className={styles.meta}>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{post.readTime} min read</span>
        <span aria-hidden="true"> · </span>
        <Link
          to={`/journal?view=roadmap&topic=${post.conceptSlug}`}
          className={styles.conceptLabel}
        >
          {post.concept}
        </Link>
      </p>
      <h3 className={styles.entryTitle}>
        <Link to={`/journal/${post.slug}`} className={styles.entryLink}>
          {post.title}
        </Link>
        {post.published === false && (
          <span className={styles.draft}>Draft</span>
        )}
      </h3>
      <p className={styles.summary}>{post.summary}</p>
    </article>
  )
}

function groupPostsByYear(posts) {
  const map = new Map()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year).push(post)
  }
  return [...map.entries()]
}

export default Journal
