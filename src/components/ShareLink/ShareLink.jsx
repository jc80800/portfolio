import { useState } from 'react'
import styles from './ShareLink.module.css'

function ShareLink() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.button} onClick={handleCopy}>
        Copy link
      </button>
      <span className={styles.status} role="status" aria-live="polite">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  )
}

export default ShareLink
