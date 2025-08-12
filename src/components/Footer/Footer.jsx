import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>DevPortfolio.</h3>
            <p className={styles.tagline}>
              Building digital experiences that make a difference.
            </p>
          </div>
          
          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Navigation</h4>
              <a href="#home" className={styles.link}>Home</a>
              <a href="#about" className={styles.link}>About</a>
              <a href="#projects" className={styles.link}>Work</a>
              <a href="#contact" className={styles.link}>Contact</a>
            </div>
            
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Connect</h4>
              <a href="#" className={styles.link}>LinkedIn</a>
              <a href="#" className={styles.link}>GitHub</a>
              <a href="#" className={styles.link}>Twitter</a>
              <a href="#" className={styles.link}>Email</a>
            </div>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 DevPortfolio. All rights reserved.</p>
          <div className={styles.legal}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <a href="#" className={styles.legalLink}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
