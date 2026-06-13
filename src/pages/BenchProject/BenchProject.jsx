import { Link, useParams } from 'react-router-dom'
import {
  BENCH_BACK_TO_BENCH,
  BENCH_EDITORIAL_NOTE,
  BENCH_ENTRIES_EMPTY,
  BENCH_ENTRIES_TITLE,
  BENCH_OPEN_EXPERIMENT,
  BENCH_PHASES_TITLE,
  BENCH_PROJECT_NOT_FOUND,
  BENCH_UNGROUPED_ENTRIES,
} from '../../config/brand'
import {
  getEntriesForProject,
  getPhaseLabel,
  getProjectBySlug,
  groupEntriesByPhase,
} from '../../data/bench'
import { useInView } from '../../hooks/useInView'
import { formatDate } from '../../lib/formatDate'
import StackTags from '../../components/StackTags/StackTags'
import styles from './BenchProject.module.css'

function BenchProject() {
  const { projectSlug } = useParams()
  const project = getProjectBySlug(projectSlug)

  if (!project) {
    return (
      <div className={styles.notFound}>
        <p>{BENCH_PROJECT_NOT_FOUND}</p>
        <Link to="/bench" className={styles.back}>
          {BENCH_BACK_TO_BENCH}
        </Link>
      </div>
    )
  }

  const entries = getEntriesForProject(project.id)
  const phaseGroups = groupEntriesByPhase(project, entries)

  return (
    <div className={styles.page}>
      <Link to="/bench" className={styles.back}>
        {BENCH_BACK_TO_BENCH}
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroMain}>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.tagline}>{project.tagline}</p>
          <StackTags stack={project.stack} />
          {project.liveUrl && (
            <a
              className={styles.liveLink}
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {BENCH_OPEN_EXPERIMENT} ↗
            </a>
          )}
        </div>
        <p className={styles.abstract}>{project.abstract}</p>
        <p className={styles.editorialNote}>{BENCH_EDITORIAL_NOTE}</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>{BENCH_PHASES_TITLE}</h2>
          <ol className={styles.phaseList}>
            {project.phases.map((phase) => (
              <li
                key={phase.id}
                className={`${styles.phaseItem} ${styles[`phase--${phase.status}`]}`}
              >
                <span className={styles.phaseMarker} aria-hidden="true" />
                <div className={styles.phaseContent}>
                  <span className={styles.phaseLabel}>{phase.label}</span>
                  <span className={styles.phaseTitle}>{phase.title}</span>
                  {phase.date && (
                    <time className={styles.phaseDate} dateTime={phase.date}>
                      {formatDate(phase.date)}
                    </time>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <section className={styles.main} aria-label={BENCH_ENTRIES_TITLE}>
          {entries.length === 0 ? (
            <p className={styles.empty}>{BENCH_ENTRIES_EMPTY}</p>
          ) : (
            <div className={styles.groups}>
              {phaseGroups.map(({ phase, entries: groupEntries }) => (
                <div key={phase?.id ?? 'ungrouped'} className={styles.group}>
                  <h3 className={styles.groupTitle}>
                    {phase
                      ? `${phase.label}: ${phase.title}`
                      : BENCH_UNGROUPED_ENTRIES}
                  </h3>
                  <div className={styles.entries}>
                    {groupEntries.map((entry) => (
                      <EntryCard
                        key={entry.slug}
                        entry={entry}
                        project={project}
                      />
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

function EntryCard({ entry, project }) {
  const { ref, inView } = useInView()
  const phaseLabel = getPhaseLabel(project, entry.phase)

  return (
    <article
      ref={ref}
      className={`${styles.entry} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <p className={styles.meta}>
        <time dateTime={entry.date}>{formatDate(entry.date)}</time>
        <span aria-hidden="true"> · </span>
        <span>{entry.readTime} min read</span>
      </p>
      <h4 className={styles.entryTitle}>
        <Link to={`/bench/${entry.projectSlug}/${entry.slug}`} className={styles.entryLink}>
          {entry.title}
        </Link>
        {entry.published === false && (
          <span className={styles.draft}>Draft</span>
        )}
      </h4>
      {phaseLabel && <p className={styles.phaseRef}>{phaseLabel}</p>}
      <p className={styles.summary}>{entry.summary}</p>
    </article>
  )
}

export default BenchProject
