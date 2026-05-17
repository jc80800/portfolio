import { ABOUT_BODY, ABOUT_TITLE } from '../../config/brand'
import styles from './About.module.css'

function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>{ABOUT_TITLE}</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            {ABOUT_BODY.map((paragraph) => (
              <p key={paragraph} className={styles.description}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
