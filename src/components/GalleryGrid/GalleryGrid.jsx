import GalleryCard from '../GalleryCard/GalleryCard'
import { useInView } from '../../hooks/useInView'
import styles from './GalleryGrid.module.css'

function GalleryGrid({ items }) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={`${styles.grid} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      {items.map((item, index) => (
        <GalleryCard
          key={item.id}
          item={item}
          displayIndex={index + 1}
          className={styles.card}
          style={{ transitionDelay: `${index * 80}ms` }}
        />
      ))}
    </div>
  )
}

export default GalleryGrid
