import { Link } from 'react-router-dom'
import {
  GALLERY_TEASER_CTA,
  GALLERY_TEASER_INTRO,
  GALLERY_TEASER_TITLE,
} from '../../config/brand'
import { getFeaturedItems } from '../../data/gallery'
import { useInView } from '../../hooks/useInView'
import GalleryGrid from '../GalleryGrid/GalleryGrid'
import styles from './GalleryTeaser.module.css'

function GalleryTeaser() {
  const { ref, inView } = useInView()
  const items = getFeaturedItems()

  return (
    <section id="work" className={styles.section} aria-labelledby="gallery-teaser-heading">
      <div
        ref={ref}
        className={`${styles.inner} reveal ${inView ? 'reveal--visible' : ''}`}
      >
        <div className={styles.intro}>
          <h2 id="gallery-teaser-heading" className={styles.title}>
            {GALLERY_TEASER_TITLE}
          </h2>
          <p className={styles.lead}>{GALLERY_TEASER_INTRO}</p>
          <Link to="/gallery" className={styles.link}>
            {GALLERY_TEASER_CTA} →
          </Link>
        </div>
        <GalleryGrid items={items} />
      </div>
    </section>
  )
}

export default GalleryTeaser
