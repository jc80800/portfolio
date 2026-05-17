import styles from './KoiMascot.module.css'

const SRC = {
  logo: '/mascot/koi-logo.png',
  hero: '/mascot/koi-hero.png',
}

const DEFAULT_ALT = {
  logo: 'Gatewood Lab koi logo',
  hero: 'Illustration of a koi for Gatewood Lab',
}

/**
 * @param {{
 *   variant?: 'logo' | 'hero'
 *   alt?: string
 *   className?: string
 *   animated?: boolean
 * }} props
 */
function KoiMascot({ variant = 'logo', alt, className = '', animated = false }) {
  const resolvedAlt = alt ?? DEFAULT_ALT[variant]
  const wrapClass = [
    styles.wrap,
    styles[variant],
    animated ? styles.animated : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const imgClass = styles.img

  if (variant === 'hero') {
    return (
      <div className={wrapClass}>
        <img
          src={SRC.hero}
          alt={resolvedAlt}
          className={imgClass}
          fetchPriority="high"
          draggable={false}
        />
        <span className={styles.ripple} aria-hidden="true" />
        <span className={styles.ripple} aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className={wrapClass}>
      <img src={SRC.logo} alt={resolvedAlt} className={imgClass} draggable={false} />
    </div>
  )
}

export default KoiMascot
