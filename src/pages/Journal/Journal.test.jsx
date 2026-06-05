import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../data/journal', () => ({
  getAllPosts: vi.fn(),
  getConceptTree: vi.fn(),
}))

import { getAllPosts, getConceptTree } from '../../data/journal'
import Journal from './Journal'

const mockPosts = [
  {
    slug: 'a',
    title: 'Post A',
    date: '2026-06-12',
    summary: 'Sum A',
    concept: 'On-Call',
    conceptSlug: 'on-call',
    tags: ['x'],
    readTime: 3,
    published: true,
  },
  {
    slug: 'b',
    title: 'Post B',
    date: '2026-06-05',
    summary: 'Sum B',
    concept: 'Testing',
    conceptSlug: 'testing',
    tags: [],
    readTime: 1,
    published: true,
  },
]

const mockConcepts = [
  { name: 'On-Call', slug: 'on-call', posts: [mockPosts[0]] },
  { name: 'Testing', slug: 'testing', posts: [mockPosts[1]] },
]

function renderJournal(initialEntries = ['/journal']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Journal />
    </MemoryRouter>
  )
}

describe('Journal index', () => {
  beforeEach(() => {
    getAllPosts.mockReturnValue(mockPosts)
    getConceptTree.mockReturnValue(mockConcepts)
  })

  it('renders a concept tree with post links', () => {
    renderJournal()
    const nav = screen.getByRole('navigation', { name: /journal concepts/i })
    expect(nav).toBeInTheDocument()
    expect(nav.querySelector('a[href="/journal/a"]')).toBeInTheDocument()
    expect(nav.querySelector('a[href="/journal/b"]')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /on-call/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /testing/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /post a/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('filters entries when a concept is selected', async () => {
    const user = userEvent.setup()
    renderJournal()
    await user.click(screen.getByRole('button', { name: /testing/i }))
    expect(screen.getByText('Sum B')).toBeInTheDocument()
    expect(screen.queryByText('Sum A')).not.toBeInTheDocument()
  })

  it('renders an empty state when there are no posts', () => {
    getAllPosts.mockReturnValue([])
    getConceptTree.mockReturnValue([])
    renderJournal()
    expect(screen.getByText(/still taking shape/i)).toBeInTheDocument()
    const postLinks = screen
      .queryAllByRole('link')
      .filter((el) => el.getAttribute('href')?.startsWith('/journal/'))
    expect(postLinks).toHaveLength(0)
  })

  it('marks unpublished entries with a Draft pill', () => {
    getAllPosts.mockReturnValue([
      {
        slug: 'd',
        title: 'Draft Post',
        date: '2026-06-01',
        summary: 'S',
        concept: 'General',
        conceptSlug: 'general',
        tags: [],
        readTime: 1,
        published: false,
      },
    ])
    getConceptTree.mockReturnValue([
      { name: 'General', slug: 'general', posts: getAllPosts() },
    ])
    renderJournal()
    expect(screen.getByText(/^draft$/i)).toBeInTheDocument()
  })
})
