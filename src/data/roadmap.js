import { getAllPosts, slugifyConcept } from './journal'

/**
 * Topic ids must match the slugified `concept` frontmatter (or a tag) of
 * journal posts — see slugifyConcept(). e.g. concept: "Shipping Safely"
 * lands on the "shipping-safely" stop.
 *
 * The main sequence, in reading order. Tweak freely as the series evolves.
 */
export const ROADMAP_STAGES = [
  {
    id: 'build-core-applications',
    title: 'Build Core Applications',
    blurb:
      'CRUD that holds up — data modeling, APIs, auth, and the habits that keep a codebase livable.',
  },
  {
    id: 'productionizing',
    title: 'Productionizing',
    blurb:
      'From "works on my machine" to a real environment — config, CI/CD, containers, and infra basics.',
  },
  {
    id: 'shipping-safely',
    title: 'Shipping Safely',
    blurb:
      'Releasing without fear — testing strategy, feature flags, migrations, rollbacks, and review culture.',
  },
  {
    id: 'production-failures',
    title: 'Production Failures',
    blurb:
      'When it breaks anyway — incidents, on-call, observability, debugging under pressure, postmortems.',
  },
  {
    id: 'scaling',
    title: 'Scaling',
    blurb:
      'When success becomes the problem — performance, caching, queues, and distributed-systems tradeoffs.',
  },
]

/** Topics that live off the main sequence. */
export const ROADMAP_BRANCHES = [
  {
    id: 'general-good-practices',
    title: 'General Good Practices',
    blurb: 'Evergreen habits that apply at every stage of the road.',
  },
  {
    id: 'ai-usage',
    title: 'AI Usage',
    blurb: 'Agents, LLMs, and vibe-coding — where they help and where they bite.',
  },
  {
    id: 'field-notes',
    title: 'Field Notes',
    blurb: 'Tangents, tools, and one-off lessons that refused to fit anywhere else.',
  },
]

export function getPostsForTopic(topicId, posts = getAllPosts()) {
  return posts.filter(
    (post) =>
      post.conceptSlug === topicId ||
      post.tags.some((tag) => slugifyConcept(tag) === topicId)
  )
}
