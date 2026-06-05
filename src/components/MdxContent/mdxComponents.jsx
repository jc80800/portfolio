import styles from './MdxContent.module.css'

export function slugifyHeading(children) {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function H2({ children, ...props }) {
  return (
    <h2 id={slugifyHeading(children)} className={styles.h2} {...props}>
      {children}
    </h2>
  )
}

function H3({ children, ...props }) {
  return (
    <h3 id={slugifyHeading(children)} className={styles.h3} {...props}>
      {children}
    </h3>
  )
}

function A({ href = '', children, ...props }) {
  const external = /^https?:\/\//.test(href)
  const extra = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
  return (
    <a href={href} className={styles.link} {...extra} {...props}>
      {children}
    </a>
  )
}

function Img({ alt = '', ...props }) {
  return <img alt={alt} className={styles.img} loading="lazy" {...props} />
}

export const mdxComponents = {
  h2: H2,
  h3: H3,
  a: A,
  img: Img,
  p: (props) => <p className={styles.p} {...props} />,
  ul: (props) => <ul className={styles.ul} {...props} />,
  ol: (props) => <ol className={styles.ol} {...props} />,
  blockquote: (props) => <blockquote className={styles.blockquote} {...props} />,
  pre: (props) => <pre className={styles.pre} {...props} />,
  code: (props) => <code className={styles.code} {...props} />,
}
