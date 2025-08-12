import styles from './About.module.css'

function About() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Me</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            <p className={styles.description}>
              I'm a passionate developer with a love for creating meaningful digital experiences. 
              With expertise in modern web technologies, I focus on building applications that 
              not only look great but also solve real problems.
            </p>
            <p className={styles.description}>
              When I'm not coding, you'll find me exploring new technologies, contributing to 
              open source projects, or sharing knowledge with the developer community.
            </p>
          </div>
          <div className={styles.skills}>
            <h3 className={styles.skillsTitle}>Technologies I Work With</h3>
            <div className={styles.skillsGrid}>
              <span className={styles.skill}>React</span>
              <span className={styles.skill}>JavaScript</span>
              <span className={styles.skill}>TypeScript</span>
              <span className={styles.skill}>Node.js</span>
              <span className={styles.skill}>Python</span>
              <span className={styles.skill}>CSS/Sass</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
