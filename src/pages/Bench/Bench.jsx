import { Link } from 'react-router-dom'
import {
  BENCH_LOG_ENTRY_PLURAL,
  BENCH_LOG_ENTRY_SINGULAR,
  BENCH_EYEBROW,
  BENCH_EMPTY,
  BENCH_EXPERIMENT_GLYPH,
  BENCH_INTRO,
  BENCH_OPEN_EXPERIMENT,
  BENCH_READ_LOG,
  BENCH_SERIES_TITLE,
} from '../../config/brand'
import {
  getAllProjects,
  getEntriesForProject,
  getProjectPhaseLine,
} from '../../data/bench'
import { useInView } from '../../hooks/useInView'
import StackTags from '../../components/StackTags/StackTags'
import styles from './Bench.module.css'

function Bench() {
  const projects = getAllProjects()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.glyph} aria-hidden="true">
          {BENCH_EXPERIMENT_GLYPH}
        </span>
        <div className={styles.heroLead}>
          <p className={styles.eyebrow}>{BENCH_EYEBROW}</p>
          <h1 className={styles.title}>{BENCH_SERIES_TITLE}</h1>
        </div>
        <p className={styles.intro}>{BENCH_INTRO}</p>
      </header>

      {projects.length === 0 ? (
        <p className={styles.empty}>{BENCH_EMPTY}</p>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ExperimentCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

function ExperimentCard({ project }) {
  const { ref, inView } = useInView()
  const entries = getEntriesForProject(project.id)
  const phaseLine = getProjectPhaseLine(project)
  const entryLabel =
    entries.length === 1 ? BENCH_LOG_ENTRY_SINGULAR : BENCH_LOG_ENTRY_PLURAL
  const statusLabel =
    project.status === 'active'
      ? 'Active'
      : project.status === 'complete'
        ? 'Complete'
        : 'Paused'

  return (
    <article
      ref={ref}
      className={`${styles.card} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <span className={`${styles.status} ${styles[`status--${project.status}`]}`}>
          {statusLabel}
        </span>
      </div>
      <p className={styles.tagline}>{project.tagline}</p>
      <StackTags stack={project.stack} />
      <p className={styles.phaseProgress}>
        {phaseLine}
        {entries.length > 0 && (
          <>
            {phaseLine && <span aria-hidden="true"> · </span>}
            {entries.length} {entryLabel}
          </>
        )}
      </p>
      <div className={styles.actions}>
        {project.liveUrl && (
          <a
            className={styles.actionPrimary}
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {BENCH_OPEN_EXPERIMENT}
          </a>
        )}
        <Link to={`/bench/${project.id}`} className={styles.actionSecondary}>
          {BENCH_READ_LOG}
        </Link>
      </div>
    </article>
  )
}

export default Bench
