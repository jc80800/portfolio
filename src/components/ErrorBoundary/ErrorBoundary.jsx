import { Component } from 'react'
import { STUDIO_NAME } from '../../config/brand'
import styles from './ErrorBoundary.module.css'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h1 className={styles.errorTitle}>The koi hit a rock</h1>
            <p className={styles.errorMessage}>
              {STUDIO_NAME} ran into something unexpected. The page is taking a breath—try a
              refresh and we will swim on.
            </p>
            <button
              type="button"
              className={styles.errorButton}
              onClick={() => window.location.reload()}
            >
              Refresh page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
