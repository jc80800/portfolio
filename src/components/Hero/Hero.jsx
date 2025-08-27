import styles from './Hero.module.css'

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Building Digital Dreams
          <span className={styles.accent}> & Chasing Fortune</span>
        </h1>
        <p className={styles.subtitle}>
          Welcome to Fufu & Co. - where I turn "foolish" ideas into brilliant reality through <del>clean</del> code and <del>creative</del> solutions. From wealth to health, I code for happiness - because life's too short for mid code! 💰
        </p>
        
        <p className={styles.brandQuote}>
          "Foo-foo: a silly or foolish person, or something pretentious and overly elaborate in style."
        </p>
        
        <div className={styles.ctaGroup}>
          <button className={styles.primaryBtn}>View My Work</button>
          <button className={styles.secondaryBtn}>Let's Create Something</button>
        </div>
      </div>
    </section>
  )
}

export default Hero
