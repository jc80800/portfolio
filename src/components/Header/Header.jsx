import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import Contact from '../Contact/Contact'

function Header() {
  const [isContactOpen, setIsContactOpen] = useState(false)

  const openContact = () => setIsContactOpen(true)
  const closeContact = () => setIsContactOpen(false)

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <img 
              src="/logo_200x200.png" 
              alt="Fufu & Co. Bear Mascot" 
              className={styles.logoImage}
            />
            <span className={styles.logoText}>Fufu & Co.</span>
          </div>
          
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li><Link to="/" className={styles.navLink}>Home</Link></li>
              <li><a href="#about" className={styles.navLink}>About</a></li>
              <li><a href="#work" className={styles.navLink}>Work</a></li>
              <li><Link to="/handbook" className={styles.navLink}>Handbook</Link></li>
            </ul>
          </nav>
          
          <button className={styles.ctaButton} onClick={openContact}>Let's Talk</button>
        </div>
      </header>
      
      <Contact isOpen={isContactOpen} onClose={closeContact} />
    </>
  )
}

export default Header
