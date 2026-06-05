import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../data/journal', () => ({
  getAllPosts: vi.fn(),
}))

import { getAllPosts } from '../../data/journal'
import Journal from './Journal'

function renderJournal() {
  return render(
    <MemoryRouter>
      <Journal />
    </MemoryRouter>
  )
}

describe('Journal index', () => {
  it('renders an entry per post linking to its slug', () => {
    getAllPosts.mockReturnValue([
      { slug: 'a', title: 'Post A', date: '2026-06-12', summary: 'Sum A', tags: ['x'], readTime: 3 },
      { slug: 'b', title: 'Post B', date: '2026-06-05', summary: 'Sum B', tags: [], readTime: 1 },
    ])
    renderJournal()
    expect(screen.getByRole('link', { name: /post a/i })).toHaveAttribute('href', '/journal/a')
    expect(screen.getByRole('link', { name: /post b/i })).toHaveAttribute('href', '/journal/b')
    expect(screen.getByText('Sum A')).toBeInTheDocument()
  })

  it('renders an empty state when there are no posts', () => {
    getAllPosts.mockReturnValue([])
    renderJournal()
    expect(screen.getByText(/still swimming upstream/i)).toBeInTheDocument()
    const postLinks = screen
      .queryAllByRole('link')
      .filter((el) => el.getAttribute('href')?.startsWith('/journal/'))
    expect(postLinks).toHaveLength(0)
  })
})
