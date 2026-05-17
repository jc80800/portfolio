import { Link } from 'react-router-dom'
import {
  HERO_CALLIGRAPHY_ACCENT,
  HERO_CALLIGRAPHY_MAIN,
  HERO_CTA,
  HERO_TAGLINE,
  STUDIO_NAME,
} from '../../config/brand'
import KoiMascot from '../KoiMascot/KoiMascot'
import styles from './Hero.module.css'

function Hero() {
  return (
    <section id="home" className={styles.hero}>
      <div className={styles.scene}>
        <div className={styles.calligraphyColumn} aria-hidden="true">
          <span className={styles.calligraphyMain}>{HERO_CALLIGRAPHY_MAIN}</span>
          <span className={styles.calligraphyAccent}>{HERO_CALLIGRAPHY_ACCENT}</span>
        </div>

        <div className={styles.threshold}>
          <div className={styles.gateFrame}>
            <div className={styles.copy}>
              <h1 className={styles.title}>{STUDIO_NAME}</h1>
              <p className={styles.tagline}>{HERO_TAGLINE}</p>
              <Link to="/gallery" className={styles.cta}>
                {HERO_CTA}
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.waterline} aria-hidden="true" />
        <div className={styles.koiWrap} aria-hidden="true">
          <KoiMascot variant="hero" animated />
        </div>
      </div>
    </section>
  )
}

export default Hero
