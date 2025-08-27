import styles from './About.module.css'

function About() {
  return (
    <section className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.title}>About Fufu & Co.</h2>
        <div className={styles.content}>
          <div className={styles.text}>
            <p className={styles.description}>
              At Fufu & Co., I believe the best ideas often start as "foolish" ones. 
              I'm a <del>passionate</del> developer who loves creating <del>meaningful</del> digital experiences 
              that not only look great but solve real problems with a touch of creativity.
            </p>
            <p className={styles.description}>
              When I'm not coding, you'll find me scrolling through r/ProgrammerHumor, 
              stuck in tutorial hell, or building the next "AI-powered" portfolio. 
              Because sometimes the most "foolish" thing is not trying something new.
            </p>
          </div>
        </div>
        
        <div className={styles.journeySection}>
          <h3 className={styles.journeyTitle}>Technologies I've Worked With</h3>
          <p className={styles.journeySubtitle}>A journey through the tech stack I'm learning and exploring</p>
          
          <div className={styles.journeyFlow}>
            <div className={styles.journeyStep}>
              <div className={styles.stepIcon}>🌐</div>
              <h4 className={styles.stepTitle}>Entry Point</h4>
              <p className={styles.stepDescription}>Every request starts with the code I write.</p>
              <div className={styles.stepTech}>
                <span className={styles.techTag}>Golang (Echo)</span>
                <span className={styles.techTag}>Java (Spring Boot)</span>
              </div>
            </div>

            <div className={styles.flowArrow}>→</div>

            <div className={styles.journeyStep}>
              <div className={styles.stepIcon}>🧩</div>
              <h4 className={styles.stepTitle}>Application Design</h4>
              <p className={styles.stepDescription}>I structure services for resilience and scale.</p>
              <div className={styles.stepTech}>
                <span className={styles.techTag}>REST</span>
                <span className={styles.techTag}>Microservices</span>
              </div>
            </div>

            <div className={styles.flowArrow}>→</div>

            <div className={styles.journeyStep}>
              <div className={styles.stepIcon}>☁️</div>
              <h4 className={styles.stepTitle}>Infrastructure</h4>
              <p className={styles.stepDescription}>Requests run on scalable cloud-native infrastructure.</p>
              <div className={styles.stepTech}>
                <span className={styles.techTag}>GCP</span>
                <span className={styles.techTag}>Docker</span>
                <span className={styles.techTag}>Kubernetes</span>
                <span className={styles.techTag}>Terraform</span>
              </div>
            </div>

            <div className={styles.flowArrow}>→</div>

            <div className={styles.journeyStep}>
              <div className={styles.stepIcon}>🔀</div>
              <h4 className={styles.stepTitle}>Service Mesh</h4>
              <p className={styles.stepDescription}>Traffic is routed and secured through modern service mesh.</p>
              <div className={styles.stepTech}>
                <span className={styles.techTag}>Istio</span>
                <span className={styles.techTag}>Envoy</span>
              </div>
            </div>

            <div className={styles.flowArrow}>→</div>

            <div className={styles.journeyStep}>
              <div className={styles.stepIcon}>🗄️</div>
              <h4 className={styles.stepTitle}>Data & Messaging</h4>
              <p className={styles.stepDescription}>Data is stored and cached for speed and reliability.</p>
              <div className={styles.stepTech}>
                <span className={styles.techTag}>PostgreSQL</span>
                <span className={styles.techTag}>Redis</span>
                <span className={styles.techTag}>Kafka</span>
              </div>
            </div>

            <div className={styles.flowArrow}>→</div>

            <div className={styles.journeyStep}>
              <div className={styles.stepIcon}>📊</div>
              <h4 className={styles.stepTitle}>Monitoring</h4>
              <p className={styles.stepDescription}>Everything is tracked, visualized, and monitored.</p>
              <div className={styles.stepTech}>
                <span className={styles.techTag}>Datadog</span>
                <span className={styles.techTag}>Grafana</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
