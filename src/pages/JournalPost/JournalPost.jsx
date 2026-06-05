import { useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import PostNav from '../../components/PostNav/PostNav'
import ReadingProgress from '../../components/ReadingProgress/ReadingProgress'
import ShareLink from '../../components/ShareLink/ShareLink'
import TableOfContents from '../../components/TableOfContents/TableOfContents'
import { mdxComponents } from '../../components/MdxContent/mdxComponents'
import { JOURNAL_NOT_FOUND } from '../../config/brand'
import { getAdjacentPosts, getPostBySlug } from '../../data/journal'
import styles from './JournalPost.module.css'

function formatDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function JournalPost() {
  const { slug } = useParams()
  const articleRef = useRef(null)
  const post = getPostBySlug(slug)

  if (!post) {
    return (
      <div className={styles.notFound}>
        <p>{JOURNAL_NOT_FOUND}</p>
        <Link to="/journal" className={styles.back}>
          ← Back to the Journal
        </Link>
      </div>
    )
  }

  const { prev, next } = getAdjacentPosts(slug)
  const Body = post.Component

  return (
    <>
      <ReadingProgress />
      <div className={styles.layout}>
        <div className={styles.main}>
          <Link to="/journal" className={styles.back}>
            ← Back to Journal
          </Link>
          <article ref={articleRef} className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>{post.title}</h1>
              <p className={styles.meta}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true"> · </span>
                <span>{post.readTime} min read</span>
              </p>
              {post.tags.length > 0 && (
                <ul className={styles.tags}>
                  {post.tags.map((tag) => (
                    <li key={tag} className={styles.tag}>
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </header>
            <div>
              <MDXProvider components={mdxComponents}>
                <Body />
              </MDXProvider>
            </div>
          </article>
          <footer className={styles.footer}>
            <ShareLink />
            <PostNav prev={prev} next={next} />
          </footer>
        </div>
        <aside className={styles.aside}>
          <TableOfContents key={slug} articleRef={articleRef} />
        </aside>
      </div>
    </>
  )
}

export default JournalPost
