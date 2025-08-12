import styles from './Hero.module.css'

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Building Digital Experiences
          <span className={styles.accent}> That Matter</span>
        </h1>
        <p className={styles.subtitle}>
          I'm a passionate developer who turns ideas into reality through clean code and creative solutions.
        </p>
        <div className={styles.ctaGroup}>
          <button className={styles.primaryBtn}>View My Work</button>
          <button className={styles.secondaryBtn}>Get In Touch</button>
        </div>
      </div>
    </section>
  )
}

export default Hero
