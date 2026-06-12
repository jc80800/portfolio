import { Link } from 'react-router-dom'
import {
  ROADMAP_BRANCHES_INTRO,
  ROADMAP_BRANCHES_TITLE,
  ROADMAP_INTRO,
  ROADMAP_NOTE_COUNT_PLURAL,
  ROADMAP_NOTE_COUNT_SINGULAR,
  ROADMAP_PATH_TITLE,
  ROADMAP_TOPIC_EMPTY,
} from '../../config/brand'
import { getPostsForTopic, ROADMAP_BRANCHES, ROADMAP_STAGES } from '../../data/roadmap'
import { useInView } from '../../hooks/useInView'
import { formatDate } from '../../lib/formatDate'
import styles from './RoadmapView.module.css'

export function RoadmapView({ posts, activeTopic, onToggleTopic }) {
  return (
    <div className={styles.roadmap}>
      <p className={styles.intro}>{ROADMAP_INTRO}</p>

      <section aria-labelledby="roadmap-path-heading">
        <h3 id="roadmap-path-heading" className={styles.sectionTitle}>
          {ROADMAP_PATH_TITLE}
        </h3>
        <ol className={styles.path}>
          {ROADMAP_STAGES.map((stage, index) => (
            <StageStop
              key={stage.id}
              stage={stage}
              index={index}
              posts={getPostsForTopic(stage.id, posts)}
              expanded={activeTopic === stage.id}
              onToggle={() => onToggleTopic(stage.id)}
            />
          ))}
        </ol>
      </section>

      <section aria-labelledby="roadmap-branches-heading">
        <h3 id="roadmap-branches-heading" className={styles.sectionTitle}>
          {ROADMAP_BRANCHES_TITLE}
        </h3>
        <p className={styles.branchIntro}>{ROADMAP_BRANCHES_INTRO}</p>
        <ul className={styles.branches}>
          {ROADMAP_BRANCHES.map((branch) => (
            <BranchStop
              key={branch.id}
              branch={branch}
              posts={getPostsForTopic(branch.id, posts)}
              expanded={activeTopic === branch.id}
              onToggle={() => onToggleTopic(branch.id)}
            />
          ))}
        </ul>
      </section>
    </div>
  )
}

function StageStop({ stage, index, posts, expanded, onToggle }) {
  const { ref, inView } = useInView()
  return (
    <li
      ref={ref}
      className={`${styles.stage} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <span
        className={`${styles.marker} ${expanded ? styles.markerActive : ''}`}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <TopicCard
        topic={stage}
        posts={posts}
        expanded={expanded}
        onToggle={onToggle}
      />
    </li>
  )
}

function BranchStop({ branch, posts, expanded, onToggle }) {
  const { ref, inView } = useInView()
  return (
    <li
      ref={ref}
      className={`${styles.branch} reveal ${inView ? 'reveal--visible' : ''}`}
    >
      <TopicCard
        topic={branch}
        posts={posts}
        expanded={expanded}
        onToggle={onToggle}
        variant="branch"
      />
    </li>
  )
}

function TopicCard({ topic, posts, expanded, onToggle, variant }) {
  const panelId = `roadmap-topic-${topic.id}`
  return (
    <article
      className={`${styles.card} ${variant === 'branch' ? styles.cardBranch : ''} ${expanded ? styles.cardExpanded : ''}`}
    >
      <button
        type="button"
        className={styles.cardButton}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className={styles.cardHeading}>
          <span className={styles.cardTitle}>{topic.title}</span>
          <span className={styles.cardBlurb}>{topic.blurb}</span>
        </span>
        <span className={styles.cardAside}>
          <span className={styles.count}>
            {posts.length}{' '}
            {posts.length === 1 ? ROADMAP_NOTE_COUNT_SINGULAR : ROADMAP_NOTE_COUNT_PLURAL}
          </span>
          <span
            className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>
      <div id={panelId} className={styles.panel} hidden={!expanded}>
        {expanded && <TopicPostList posts={posts} />}
      </div>
    </article>
  )
}

function TopicPostList({ posts }) {
  if (posts.length === 0) {
    return <p className={styles.topicEmpty}>{ROADMAP_TOPIC_EMPTY}</p>
  }
  return (
    <ul className={styles.topicPosts}>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link to={`/journal/${post.slug}`} className={styles.topicPostLink}>
            <span className={styles.topicPostTitle}>{post.title}</span>
            <span className={styles.topicPostMeta}>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true"> · </span>
              <span>{post.readTime} min read</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
