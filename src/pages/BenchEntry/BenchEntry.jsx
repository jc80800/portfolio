import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import BenchPostNav from '../../components/BenchPostNav/BenchPostNav'
import ReadingProgress from '../../components/ReadingProgress/ReadingProgress'
import ShareLink from '../../components/ShareLink/ShareLink'
import TableOfContents from '../../components/TableOfContents/TableOfContents'
import { mdxComponents } from '../../components/MdxContent/mdxComponents'
import {
  BENCH_BACK_TO_BENCH,
  BENCH_ENTRY_NOT_FOUND,
} from '../../config/brand'
import {
  getAdjacentEntries,
  getEntryBySlug,
  getPhaseLabel,
  getProjectBySlug,
} from '../../data/bench'
import { formatDate } from '../../lib/formatDate'
import styles from './BenchEntry.module.css'

function BenchEntry() {
  const { projectSlug, entrySlug } = useParams()
  const articleRef = useRef(null)
  const project = getProjectBySlug(projectSlug)
  const entry = project ? getEntryBySlug(projectSlug, entrySlug) : undefined

  if (!project || !entry) {
    return (
      <div className={styles.notFound}>
        <p>{BENCH_ENTRY_NOT_FOUND}</p>
        <Link to="/bench" className={styles.back}>
          {BENCH_BACK_TO_BENCH}
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentEntries(projectSlug, entrySlug)
  const phaseLabel = getPhaseLabel(project, entry.phase)
  const Body = entry.Component

  return (
    <>
      <ReadingProgress />
      <div className={styles.layout}>
        <div className={styles.main}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/bench" className={styles.crumb}>
              Bench
            </Link>
            <span aria-hidden="true" className={styles.crumbSep}>
              /
            </span>
            <Link to={`/bench/${project.id}`} className={styles.crumb}>
              {project.title}
            </Link>
          </nav>

          <article ref={articleRef} className={styles.article}>
            <header className={styles.header}>
              {phaseLabel && (
                <div className={styles.badges}>
                  <span className={styles.phaseBadge}>{phaseLabel}</span>
                </div>
              )}
              <h1 className={styles.title}>{entry.title}</h1>
              <p className={styles.meta}>
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                <span aria-hidden="true"> · </span>
                <span>{entry.readTime} min read</span>
              </p>
              {entry.tags.length > 0 && (
                <ul className={styles.tags}>
                  {entry.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </header>
            <div>
              <MDXProvider components={mdxComponents}>
                <Body />
              </MDXProvider>
            </div>
          </article>

          <footer className={styles.footer}>
            <ShareLink />
            <BenchPostNav projectSlug={projectSlug} prev={prev} next={next} />
          </footer>
        </div>
        <aside className={styles.aside}>
          <TableOfContents key={entrySlug} articleRef={articleRef} />
        </aside>
      </div>
    </>
  )
}

export default BenchEntry
