import { Link } from 'react-router-dom'
import {
  BENCH_EYEBROW,
  BENCH_EXPERIMENT_GLYPH,
  BENCH_INVITE_BODY,
  BENCH_INVITE_CTA,
  BENCH_SERIES_TITLE,
} from '../../config/brand'
import { useInView } from '../../hooks/useInView'
import styles from './BenchInvite.module.css'

function BenchInvite() {
  const { ref, inView } = useInView()

  return (
    <section className={styles.section} aria-labelledby="bench-invite-heading">
      <div
        ref={ref}
        className={`${styles.inner} reveal ${inView ? 'reveal--visible' : ''}`}
      >
        <span className={styles.glyph} aria-hidden="true">
          {BENCH_EXPERIMENT_GLYPH}
        </span>
        <p className={styles.eyebrow}>{BENCH_EYEBROW}</p>
        <h2 id="bench-invite-heading" className={styles.title}>
          {BENCH_SERIES_TITLE}
        </h2>
        <p className={styles.body}>{BENCH_INVITE_BODY}</p>
        <Link to="/bench" className={styles.cta}>
          {BENCH_INVITE_CTA} →
        </Link>
      </div>
    </section>
  )
}

export default BenchInvite
