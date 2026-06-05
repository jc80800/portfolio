import { useEffect, useState } from 'react'
import styles from './TableOfContents.module.css'

const MIN_HEADINGS = 3

function TableOfContents({ articleRef }) {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const root = articleRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll('h2[id], h3[id]'))
    setHeadings(
      nodes.map((node) => ({
        id: node.id,
        text: node.textContent,
        level: Number(node.tagName.substring(1)),
      }))
    )
  }, [articleRef])

  if (headings.length < MIN_HEADINGS) return null

  return (
    <nav className={styles.toc} aria-label="On this page">
      <p className={styles.heading}>On this page</p>
      <ul className={styles.list}>
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? styles.sub : undefined}>
            <a href={`#${h.id}`} className={styles.link}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
