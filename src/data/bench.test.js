import { describe, it, expect } from 'vitest'
import {
  deriveProjectSlug,
  buildEntry,
  getProjectPhaseLine,
  getPhaseLabel,
  groupEntriesByPhase,
  getAdjacentEntries,
  getProjectBySlug,
  getEntriesForProject,
  getEntryBySlug,
} from './bench'

describe('bench data helpers', () => {
  it('derives project slug from nested content path', () => {
    expect(
      deriveProjectSlug('../content/bench/throttle-arena/2026-06-12-problem-statement.mdx')
    ).toBe('throttle-arena')
  })

  it('builds an entry object from a module', () => {
    const mod = {
      frontmatter: {
        title: 'T',
        date: '2026-06-12',
        summary: 'S',
        project: 'throttle-arena',
        phase: 'phase-0',
        tags: ['a'],
      },
      default: () => null,
    }
    const entry = buildEntry(
      '../content/bench/throttle-arena/2026-06-12-t.mdx',
      mod
    )
    expect(entry).toMatchObject({
      slug: 't',
      projectSlug: 'throttle-arena',
      title: 'T',
      phase: 'phase-0',
      published: true,
    })
    expect(entry).not.toHaveProperty('entryType')
  })

  it('throws when frontmatter project does not match folder', () => {
    const mod = {
      frontmatter: {
        title: 'T',
        date: '2026-06-12',
        summary: 'S',
        project: 'other',
      },
      default: () => null,
    }
    expect(() =>
      buildEntry('../content/bench/throttle-arena/2026-06-12-t.mdx', mod)
    ).toThrow(/does not match folder/)
  })

  it('describes current phase without a total count', () => {
    const project = getProjectBySlug('throttle-arena')
    expect(getProjectPhaseLine(project)).toMatch(/Phase 2.*in progress/)
    expect(getProjectPhaseLine(project)).not.toMatch(/\d+ of \d+/)
  })

  it('returns phase label for a known phase id', () => {
    const project = getProjectBySlug('throttle-arena')
    expect(getPhaseLabel(project, 'phase-0')).toBe('Phase 0: Problem Statement')
    expect(getPhaseLabel(project, 'missing')).toBeNull()
  })

  it('groups entries by phase with ungrouped fallback', () => {
    const project = getProjectBySlug('throttle-arena')
    const entries = [
      { slug: 'a', phase: 'phase-0', date: '2026-06-12' },
      { slug: 'b', phase: null, date: '2026-06-11' },
    ]
    const groups = groupEntriesByPhase(project, entries)
    expect(groups.some((g) => g.phase?.id === 'phase-0' && g.entries.length === 1)).toBe(true)
    expect(groups.some((g) => g.phase === null && g.entries.length === 1)).toBe(true)
  })

  it('loads throttle-arena seed entry from disk', () => {
    const entries = getEntriesForProject('throttle-arena')
    expect(entries.length).toBeGreaterThanOrEqual(1)
    expect(entries[0].slug).toBe('problem-statement')
  })

  it('getEntryBySlug returns a matching entry', () => {
    const entry = getEntryBySlug('throttle-arena', 'problem-statement')
    expect(entry?.title).toMatch(/Problem Statement/)
  })

  it('getAdjacentEntries returns null prev/next for single entry', () => {
    const entries = getEntriesForProject('throttle-arena')
    if (entries.length === 1) {
      const adj = getAdjacentEntries('throttle-arena', entries[0].slug)
      expect(adj.prev).toBeNull()
      expect(adj.next).toBeNull()
    }
  })
})
