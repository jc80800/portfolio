import { deriveSlug, selectPosts, getAdjacent } from './journal'

const modules = import.meta.glob('../content/bench/*/*.mdx', { eager: true })

export const benchProjects = [
  {
    id: 'throttle-arena',
    title: 'Throttle Arena',
    tagline: 'A proving ground for rate limits, backpressure, and controlled chaos.',
    abstract:
      'An interactive lab environment for exploring throttling strategies — from token buckets to adaptive load shedding — with phased releases that document what worked, what broke, and why.',
    status: 'active',
    liveUrl: 'https://throttle-arena.lab.gatewoodlab.com/',
    githubUrl: null,
    stack: ['Go', 'WebSockets', 'Redis'],
    phases: [
      {
        id: 'phase-0',
        label: 'Phase 0',
        title: 'Problem Statement',
        status: 'shipped',
        date: '2026-06-12',
      },
      {
        id: 'phase-1',
        label: 'Phase 1',
        title: 'Core Arena Loop',
        status: 'shipped',
        date: '2026-06-13',
      },
      {
        id: 'phase-2',
        label: 'Phase 2',
        title: 'Persistence and Consistency',
        status: 'in-progress',
      },
      {
        id: 'phase-3',
        label: 'Phase 3',
        title: 'TBD',
        status: 'planned',
      },
    ],
  },
]

export function deriveProjectSlug(path) {
  const parts = path.split('/')
  const benchIdx = parts.indexOf('bench')
  if (benchIdx === -1 || benchIdx + 1 >= parts.length) {
    throw new Error(`Bench entry ${path} is missing a project folder`)
  }
  return parts[benchIdx + 1]
}

export function buildEntry(path, mod) {
  const fm = mod.frontmatter ?? {}
  const projectSlug = deriveProjectSlug(path)

  if (!fm.title || !fm.date || !fm.summary) {
    throw new Error(
      `Bench entry ${path} is missing required frontmatter (title, date, summary)`
    )
  }

  if (fm.project && fm.project !== projectSlug) {
    throw new Error(
      `Bench entry ${path} frontmatter project "${fm.project}" does not match folder "${projectSlug}"`
    )
  }

  return {
    slug: deriveSlug(path),
    projectSlug,
    title: fm.title,
    date: fm.date,
    summary: fm.summary,
    phase: fm.phase ?? null,
    tags: fm.tags ?? [],
    published: fm.published ?? true,
    readTime: fm.readingTime ?? 1,
    Component: mod.default,
  }
}

const allEntries = Object.entries(modules).map(([path, mod]) => buildEntry(path, mod))

export function getAllProjects() {
  return benchProjects
}

export function getProjectBySlug(slug) {
  return benchProjects.find((p) => p.id === slug)
}

export function getEntriesForProject(
  projectSlug,
  { includeDrafts = import.meta.env.DEV } = {}
) {
  const entries = allEntries.filter((e) => e.projectSlug === projectSlug)
  return selectPosts(entries, { includeDrafts })
}

export function getEntryBySlug(projectSlug, entrySlug) {
  return getEntriesForProject(projectSlug).find((e) => e.slug === entrySlug)
}

export function getAdjacentEntries(projectSlug, entrySlug) {
  return getAdjacent(getEntriesForProject(projectSlug), entrySlug)
}

export function getProjectPhaseLine(project) {
  const inProgress = project.phases.find((p) => p.status === 'in-progress')
  if (inProgress) {
    return `${inProgress.label}: ${inProgress.title} — in progress`
  }

  const shipped = [...project.phases].filter((p) => p.status === 'shipped').pop()
  if (shipped) {
    return `Latest — ${shipped.label}: ${shipped.title}`
  }

  const upcoming = project.phases.find((p) => p.status === 'planned')
  if (upcoming) {
    return `${upcoming.label}: ${upcoming.title} — upcoming`
  }

  const last = project.phases.at(-1)
  return last ? `${last.label}: ${last.title}` : null
}

export function getPhaseLabel(project, phaseId) {
  if (!phaseId) return null
  const phase = project.phases.find((p) => p.id === phaseId)
  return phase ? `${phase.label}: ${phase.title}` : null
}

export function groupEntriesByPhase(project, entries) {
  const groups = new Map()
  for (const phase of project.phases) {
    groups.set(phase.id, { phase, entries: [] })
  }
  groups.set('_ungrouped', { phase: null, entries: [] })

  for (const entry of entries) {
    const key = entry.phase && groups.has(entry.phase) ? entry.phase : '_ungrouped'
    groups.get(key).entries.push(entry)
  }

  const ordered = []
  for (const phase of project.phases) {
    const group = groups.get(phase.id)
    if (group.entries.length > 0) ordered.push(group)
  }
  const ungrouped = groups.get('_ungrouped')
  if (ungrouped.entries.length > 0) ordered.push(ungrouped)
  return ordered
}
