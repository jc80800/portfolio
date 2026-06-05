import { describe, it, expect } from 'vitest'
import {
  deriveSlug,
  stripFrontmatter,
  computeReadTime,
  buildPost,
  sortByDateDesc,
  selectPosts,
  getAdjacent,
  groupPostsByConcept,
} from './journal'
import * as TemplatePost from '../content/journal/_templates/post.mdx'

const rawWithFm = `---
title: "X"
date: "2026-06-05"
---
one two three four five`

describe('journal data helpers', () => {
  it('derives slug from filename, stripping date prefix and extension', () => {
    expect(deriveSlug('../content/journal/2026-06-01-my-post.mdx')).toBe('my-post')
  })

  it('strips a leading frontmatter block', () => {
    expect(stripFrontmatter(rawWithFm).trim()).toBe('one two three four five')
  })

  it('strips a CRLF frontmatter block', () => {
    const crlf = '---\r\ntitle: "X"\r\n---\r\none two'
    expect(stripFrontmatter(crlf).trim()).toBe('one two')
  })

  it('computes read time as at least 1 minute', () => {
    expect(computeReadTime(rawWithFm)).toBe(1)
    const long = '---\na: b\n---\n' + 'word '.repeat(450)
    expect(computeReadTime(long)).toBe(2)
  })

  it('builds a post object from a module + raw source', () => {
    const mod = {
      frontmatter: {
        title: 'T',
        date: '2026-06-05',
        summary: 'S',
        concept: 'On-Call',
        tags: ['a'],
      },
      default: () => null,
    }
    const post = buildPost('../content/journal/2026-06-05-t.mdx', mod)
    expect(post).toMatchObject({
      slug: 't',
      title: 'T',
      summary: 'S',
      concept: 'On-Call',
      conceptSlug: 'on-call',
      tags: ['a'],
      published: true,
    })
    expect(post.readTime).toBeGreaterThanOrEqual(1)
    expect(typeof post.Component).toBe('function')
  })

  it('defaults concept to General when omitted', () => {
    const mod = { frontmatter: { title: 'T', date: '2026-06-05', summary: 'S' }, default: () => null }
    const post = buildPost('../content/journal/2026-06-05-t.mdx', mod)
    expect(post.concept).toBe('General')
    expect(post.conceptSlug).toBe('general')
  })

  it('groups posts by concept', () => {
    const posts = [
      { concept: 'B', conceptSlug: 'b', date: '2026-06-12', slug: 'x' },
      { concept: 'A', conceptSlug: 'a', date: '2026-06-05', slug: 'y' },
      { concept: 'A', conceptSlug: 'a', date: '2026-06-01', slug: 'z' },
    ]
    const tree = groupPostsByConcept(posts)
    expect(tree.map((g) => g.name)).toEqual(['A', 'B'])
    expect(tree[0].posts.map((p) => p.slug)).toEqual(['y', 'z'])
  })

  it('throws when required frontmatter is missing', () => {
    const mod = { frontmatter: { title: 'T' }, default: () => null }
    expect(() => buildPost('../content/journal/2026-06-05-t.mdx', mod)).toThrow(/missing required frontmatter/)
  })

  it('defaults published to true and tags to empty array', () => {
    const mod = { frontmatter: { title: 'T', date: '2026-06-05', summary: 'S' }, default: () => null }
    const post = buildPost('../content/journal/2026-06-05-t.mdx', mod)
    expect(post.published).toBe(true)
    expect(post.tags).toEqual([])
  })

  it('sorts posts newest date first, ties broken by slug ascending', () => {
    const posts = [
      { slug: 'b', date: '2026-06-05' },
      { slug: 'a', date: '2026-06-05' },
      { slug: 'c', date: '2026-06-12' },
    ]
    expect(sortByDateDesc(posts).map((p) => p.slug)).toEqual(['c', 'a', 'b'])
  })

  it('does not mutate the input array', () => {
    const input = [
      { slug: 'b', date: '2026-06-05' },
      { slug: 'a', date: '2026-06-05' },
    ]
    sortByDateDesc(input)
    expect(input.map((p) => p.slug)).toEqual(['b', 'a'])
  })

  it('selectPosts excludes drafts unless includeDrafts is true', () => {
    const posts = [
      { slug: 'pub', date: '2026-06-12', published: true },
      { slug: 'draft', date: '2026-06-05', published: false },
    ]
    expect(selectPosts(posts, { includeDrafts: false }).map((p) => p.slug)).toEqual(['pub'])
    expect(selectPosts(posts, { includeDrafts: true }).map((p) => p.slug)).toEqual(['pub', 'draft'])
  })

  it('getAdjacent returns prev (newer) and next (older) within ordered list', () => {
    const ordered = [{ slug: 'c' }, { slug: 'b' }, { slug: 'a' }]
    expect(getAdjacent(ordered, 'b')).toEqual({ prev: { slug: 'c' }, next: { slug: 'a' } })
    expect(getAdjacent(ordered, 'c')).toEqual({ prev: null, next: { slug: 'b' } })
    expect(getAdjacent(ordered, 'a')).toEqual({ prev: { slug: 'b' }, next: null })
    expect(getAdjacent(ordered, 'missing')).toEqual({ prev: null, next: null })
  })

  it('injects numeric readingTime into post frontmatter via the remark plugin', () => {
    expect(typeof TemplatePost.frontmatter.readingTime).toBe('number')
    expect(TemplatePost.frontmatter.readingTime).toBeGreaterThan(0)
  })
})
