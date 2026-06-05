const modules = import.meta.glob('../content/journal/*.mdx', { eager: true })

export function deriveSlug(path) {
  const file = path.split('/').pop().replace(/\.mdx$/, '')
  return file.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

export function stripFrontmatter(raw) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function computeReadTime(raw) {
  const text = typeof raw === 'string' ? stripFrontmatter(raw) : ''
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function buildPost(path, mod) {
  const fm = mod.frontmatter ?? {}
  if (!fm.title || !fm.date || !fm.summary) {
    throw new Error(
      `Journal post ${path} is missing required frontmatter (title, date, summary)`
    )
  }
  return {
    slug: deriveSlug(path),
    title: fm.title,
    date: fm.date,
    summary: fm.summary,
    tags: fm.tags ?? [],
    published: fm.published ?? true,
    readTime: fm.readingTime ?? 1,
    Component: mod.default,
  }
}

export function sortByDateDesc(posts) {
  return [...posts].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.slug < b.slug ? -1 : 1
  })
}

export function selectPosts(posts, { includeDrafts }) {
  const filtered = includeDrafts ? posts : posts.filter((p) => p.published)
  return sortByDateDesc(filtered)
}

export function getAdjacent(orderedPosts, slug) {
  const i = orderedPosts.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? orderedPosts[i - 1] : null,
    next: i < orderedPosts.length - 1 ? orderedPosts[i + 1] : null,
  }
}

const allPosts = Object.entries(modules).map(([path, mod]) =>
  buildPost(path, mod)
)

export function getAllPosts({ includeDrafts = import.meta.env.DEV } = {}) {
  return selectPosts(allPosts, { includeDrafts })
}

export function getPostBySlug(slug) {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAdjacentPosts(slug) {
  return getAdjacent(getAllPosts(), slug)
}
