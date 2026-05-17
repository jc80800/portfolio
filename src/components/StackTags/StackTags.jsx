import styles from './StackTags.module.css'

function StackTags({ stack = [] }) {
  if (!stack.length) return null
  return (
    <ul className={styles.list} aria-label="Tech stack">
      {stack.map((tech) => (
        <li key={tech} className={styles.tag}>
          {tech}
        </li>
      ))}
    </ul>
  )
}

export default StackTags
