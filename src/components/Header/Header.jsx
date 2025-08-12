import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoText}>DevPortfolio</span>
          <span className={styles.logoDot}>.</span>
        </div>
        
        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li><a href="#home" className={styles.navLink}>Home</a></li>
            <li><a href="#about" className={styles.navLink}>About</a></li>
            <li><a href="#projects" className={styles.navLink}>Work</a></li>
            <li><a href="#contact" className={styles.navLink}>Contact</a></li>
          </ul>
        </nav>
        
        <button className={styles.ctaButton}>Let's Talk</button>
      </div>
    </header>
  )
}

export default Header
