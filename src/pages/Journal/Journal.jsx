import { Link, useSearchParams } from 'react-router-dom'
import {
  JOURNAL_ALL_CONCEPTS,
  JOURNAL_EMPTY,
  JOURNAL_EYEBROW_PAGE,
  JOURNAL_INTRO,
  JOURNAL_SERIES_TITLE,
  JOURNAL_SIDEBAR_TITLE,
} from '../../config/brand'
import { getAllPosts, getConceptTree } from '../../data/journal'
import { useInView } from '../../hooks/useInView'
import { formatDate } from '../../lib/formatDate'
import styles from './Journal.module.css'

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
        <span className={styles.conceptLabel}>{post.concept}</span>
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
    </article>
  )
}

function ConceptTree({ concepts, activeConcept, onSelectConcept }) {
  return (
    <nav className={styles.tree} aria-label="Journal concepts">
      <button
        type="button"
        className={`${styles.treeConcept} ${activeConcept === null ? styles.treeActive : ''}`}
        onClick={() => onSelectConcept(null)}
      >
        {JOURNAL_ALL_CONCEPTS}
      </button>
      <ul className={styles.treeList}>
        {concepts.map((group) => (
          <li key={group.slug} className={styles.treeGroup}>
            <button
              type="button"
              className={`${styles.treeConcept} ${activeConcept === group.slug ? styles.treeActive : ''}`}
              onClick={() => onSelectConcept(group.slug)}
            >
              {group.name}
              <span className={styles.treeCount}>{group.posts.length}</span>
            </button>
            <ul className={styles.treePosts}>
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link to={`/journal/${post.slug}`} className={styles.treePostLink}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Journal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const concepts = getConceptTree()
  const posts = getAllPosts()
  const activeConcept = searchParams.get('concept')

  const visiblePosts = activeConcept
    ? posts.filter((post) => post.conceptSlug === activeConcept)
    : posts

  const activeGroup = activeConcept
    ? concepts.find((group) => group.slug === activeConcept)
    : null

  function handleSelectConcept(slug) {
    if (slug === null) {
      setSearchParams({})
    } else {
      setSearchParams({ concept: slug })
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>{JOURNAL_EYEBROW_PAGE}</p>
        <h1 className={styles.title}>{JOURNAL_SERIES_TITLE}</h1>
        <p className={styles.intro}>{JOURNAL_INTRO}</p>
      </header>

      {posts.length === 0 ? (
        <p className={styles.empty}>{JOURNAL_EMPTY}</p>
      ) : (
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <h2 className={styles.sidebarTitle}>{JOURNAL_SIDEBAR_TITLE}</h2>
            <ConceptTree
              concepts={concepts}
              activeConcept={activeConcept}
              onSelectConcept={handleSelectConcept}
            />
          </aside>

          <section className={styles.main} aria-labelledby="journal-entries-heading">
            <h2 id="journal-entries-heading" className={styles.mainTitle}>
              {activeGroup ? activeGroup.name : JOURNAL_ALL_CONCEPTS}
            </h2>
            <div className={styles.entries}>
              {visiblePosts.map((post) => (
                <EntryCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Journal
