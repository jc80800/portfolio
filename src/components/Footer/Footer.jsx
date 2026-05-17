import { Link } from 'react-router-dom'
import { STUDIO_NAME, TAGLINE } from '../../config/brand'
import { SOCIAL } from '../../config/social'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>{STUDIO_NAME}</h2>
            <p className={styles.tagline}>{TAGLINE}</p>
          </div>

          <div className={styles.social}>
            <h3 className={styles.socialTitle}>Elsewhere</h3>
            <ul className={styles.socialList}>
              <li>
                <a
                  href={SOCIAL.github}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={SOCIAL.linkedin}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SOCIAL.email} className={styles.link}>
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {STUDIO_NAME}
          </p>
          <nav className={styles.meta} aria-label="Footer">
            <Link to="/" className={styles.metaLink}>
              Home
            </Link>
            <Link to="/gallery" className={styles.metaLink}>
              Gallery
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer
