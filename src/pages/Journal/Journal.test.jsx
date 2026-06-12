import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../data/journal', () => ({
  getAllPosts: vi.fn(),
  slugifyConcept: (name) =>
    String(name)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-'),
}))

import { getAllPosts } from '../../data/journal'
import Journal from './Journal'

const mockPosts = [
  {
    slug: 'incident-one',
    title: 'My First Incident',
    date: '2026-06-12',
    summary: 'Sum A',
    concept: 'Production Failures',
    conceptSlug: 'production-failures',
    tags: [],
    readTime: 3,
    published: true,
  },
  {
    slug: 'agents-everywhere',
    title: 'Agents Everywhere',
    date: '2025-12-15',
    summary: 'Sum B',
    concept: 'General',
    conceptSlug: 'general',
    tags: ['AI Usage'],
    readTime: 1,
    published: true,
  },
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
  })

  it('renders entries grouped by publish year by default', () => {
    renderJournal()
    expect(screen.getByRole('heading', { name: '2026' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '2025' })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /my first incident/i })
    ).toHaveAttribute('href', '/journal/incident-one')
    expect(
      screen.getByRole('link', { name: /agents everywhere/i })
    ).toHaveAttribute('href', '/journal/agents-everywhere')
  })

  it('shows the reading-order note linking to the roadmap view', () => {
    renderJournal()
    expect(screen.getByText(/read in any order/i)).toBeInTheDocument()
    expect(screen.getByText(/none of these are ai-generated/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /roadmap/i })).toHaveAttribute(
      'href',
      '/journal?view=roadmap'
    )
  })

  it('links each concept label to its roadmap topic', () => {
    renderJournal()
    expect(
      screen.getByRole('link', { name: 'Production Failures' })
    ).toHaveAttribute('href', '/journal?view=roadmap&topic=production-failures')
  })

  it('switches to the roadmap view from the sidebar', async () => {
    const user = userEvent.setup()
    renderJournal()
    await user.click(screen.getByRole('button', { name: /^roadmap$/i }))
    expect(
      screen.getByRole('button', { name: /build core applications/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /scaling/i })
    ).toBeInTheDocument()
    expect(screen.queryByText('Sum A')).not.toBeInTheDocument()
  })

  it('expands a roadmap topic to show its tagged posts', async () => {
    const user = userEvent.setup()
    renderJournal(['/journal?view=roadmap'])
    await user.click(
      screen.getByRole('button', { name: /production failures/i })
    )
    expect(
      screen.getByRole('link', { name: /my first incident/i })
    ).toHaveAttribute('href', '/journal/incident-one')
  })

  it('matches roadmap side-trail posts by tag', async () => {
    const user = userEvent.setup()
    renderJournal(['/journal?view=roadmap'])
    await user.click(screen.getByRole('button', { name: /ai usage/i }))
    expect(
      screen.getByRole('link', { name: /agents everywhere/i })
    ).toHaveAttribute('href', '/journal/agents-everywhere')
  })

  it('shows an empty message for roadmap topics with no notes', async () => {
    const user = userEvent.setup()
    renderJournal(['/journal?view=roadmap'])
    await user.click(
      screen.getByRole('button', { name: /build core applications/i })
    )
    expect(screen.getByText(/still being charted/i)).toBeInTheDocument()
  })

  it('auto-expands the roadmap topic from the URL', () => {
    renderJournal(['/journal?view=roadmap&topic=production-failures'])
    expect(
      screen.getByRole('link', { name: /my first incident/i })
    ).toBeInTheDocument()
  })

  it('renders an empty state when there are no posts', () => {
    getAllPosts.mockReturnValue([])
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
    renderJournal()
    expect(screen.getByText(/^draft$/i)).toBeInTheDocument()
  })
})
