import styles from './Projects.module.css'

function Projects() {
  return (
    <section className={styles.projects}>
      <div className={styles.container}>
        <h2 className={styles.title}>My Projects</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>E-Commerce Platform</h3>
              <p className={styles.cardDescription}>
                A full-stack e-commerce solution built with React, Node.js, and MongoDB.
              </p>
              <div className={styles.techStack}>
                <span className={styles.tech}>React</span>
                <span className={styles.tech}>Node.js</span>
                <span className={styles.tech}>MongoDB</span>
              </div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Task Management App</h3>
              <p className={styles.cardDescription}>
                A collaborative task management tool with real-time updates and team features.
              </p>
              <div className={styles.techStack}>
                <span className={styles.tech}>Vue.js</span>
                <span className={styles.tech}>Firebase</span>
                <span className={styles.tech}>Tailwind</span>
              </div>
            </div>
          </div>
          
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Weather Dashboard</h3>
              <p className={styles.cardDescription}>
                A beautiful weather app with location-based forecasts and interactive maps.
              </p>
              <div className={styles.techStack}>
                <span className={styles.tech}>JavaScript</span>
                <span className={styles.tech}>API</span>
                <span className={styles.tech}>CSS3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects
