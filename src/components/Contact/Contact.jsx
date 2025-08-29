import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import styles from './Contact.module.css'

function Contact({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null
  const nameInputRef = useRef(null)

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY)
  }, [])

  // Handle Escape key to close modal and focus management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      // Focus on the first input when modal opens
      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 100)
    } else {
      // Reset form when modal is closed
      setFormData({
        name: '',
        email: '',
        message: ''
      })
      setIsSubmitting(false)
      setSubmitStatus(null)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // EmailJS configuration using environment variables
      const templateParams = {
        from_name: formData.name,
        email: import.meta.env.VITE_RECIPIENT_EMAIL,
        reply_to: formData.email,
        message: formData.message
      }

      // Send email using EmailJS
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      if (result.status === 200) {
        setSubmitStatus('success')
        setTimeout(() => {
          onClose()
        }, 2000) // Close modal after 2 seconds
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close contact form">
          ×
        </button>
        
        <div className={styles.content}>
          <h2 className={styles.title}>Let's Talk! 🚀</h2>
          <p className={styles.subtitle}>
            Ready to turn your "foolish" ideas into brilliant reality? 
            Drop me a message and let's create something amazing together!
          </p>
          
          {submitStatus === 'success' ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✅</div>
              <h3>Message Sent Successfully!</h3>
              <p>Thank you for reaching out. I'll get back to you soon!</p>
            </div>
          ) : submitStatus === 'error' ? (
            <div className={styles.errorMessage}>
              <div className={styles.errorIcon}>❌</div>
              <h3>Oops! Something went wrong.</h3>
              <p>Please try again or contact me directly at fufuandco.contact@gmail.com</p>
              <button 
                className={styles.retryButton} 
                onClick={() => setSubmitStatus(null)}
              >
                Try Again
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Name</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Your awesome name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="your.email@example.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Tell me about your project, ideas, or just say hello! 💬"
                  rows="5"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending... ✨' : 'Send Message ✨'}
              </button>
            </form>
          )}
          
          <div className={styles.decorativeLine}></div>
        </div>
      </div>
    </div>
  )
}

export default Contact
