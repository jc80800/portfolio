import { Link } from 'react-router-dom'
import {
  JOURNAL_DRAGON_GLYPH,
  JOURNAL_EYEBROW,
  JOURNAL_INVITE_BODY,
  JOURNAL_INVITE_CTA,
  JOURNAL_SERIES_TITLE,
} from '../../config/brand'
import { useInView } from '../../hooks/useInView'
import styles from './JournalInvite.module.css'

function JournalInvite() {
  const { ref, inView } = useInView()

  return (
    <section className={styles.section} aria-labelledby="journal-invite-heading">
      <div
        ref={ref}
        className={`${styles.inner} reveal ${inView ? 'reveal--visible' : ''}`}
      >
        <span className={styles.glyph} aria-hidden="true">
          {JOURNAL_DRAGON_GLYPH}
        </span>
        <p className={styles.eyebrow}>{JOURNAL_EYEBROW}</p>
        <h2 id="journal-invite-heading" className={styles.title}>
          {JOURNAL_SERIES_TITLE}
        </h2>
        <p className={styles.body}>{JOURNAL_INVITE_BODY}</p>
        <Link to="/journal" className={styles.cta}>
          {JOURNAL_INVITE_CTA} →
        </Link>
      </div>
    </section>
  )
}

export default JournalInvite
