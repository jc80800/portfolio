import GalleryGrid from '../../components/GalleryGrid/GalleryGrid'
import KoiMascot from '../../components/KoiMascot/KoiMascot'
import { GALLERY_EYEBROW, GALLERY_INTRO } from '../../config/brand'
import { getAllItems } from '../../data/gallery'
import styles from './Gallery.module.css'

function GalleryPage() {
  const items = getAllItems()

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.mascotBlock}>
          <KoiMascot variant="hero" className={styles.heroMascot} />
        </div>
        <div className={styles.heroCopy}>
          <h1 className={styles.title}>{GALLERY_EYEBROW}</h1>
          <p className={styles.subtitle}>{GALLERY_INTRO}</p>
        </div>
      </header>
      <div className={styles.gridWrap}>
        <GalleryGrid items={items} />
      </div>
    </div>
  )
}

export default GalleryPage
