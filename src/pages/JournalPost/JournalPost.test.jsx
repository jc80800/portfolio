import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../../data/journal', () => ({
  getPostBySlug: vi.fn(),
  getAdjacentPosts: vi.fn(() => ({ prev: null, next: null })),
}))

import { getPostBySlug, getAdjacentPosts } from '../../data/journal'
import JournalPost from './JournalPost'

function renderAt(slug) {
  return render(
    <MemoryRouter initialEntries={[`/journal/${slug}`]}>
      <Routes>
        <Route path="/journal/:slug" element={<JournalPost />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('JournalPost', () => {
  it('renders the post title, meta, and body', () => {
    getPostBySlug.mockReturnValue({
      slug: 'a',
      title: 'Post A',
      date: '2026-06-05',
      summary: 'Sum',
      tags: ['x'],
      readTime: 4,
      Component: () => <p>Body content here</p>,
    })
    getAdjacentPosts.mockReturnValue({ prev: null, next: { slug: 'b', title: 'Post B' } })
    renderAt('a')
    expect(screen.getByRole('heading', { level: 1, name: 'Post A' })).toBeInTheDocument()
    expect(screen.getByText('Body content here')).toBeInTheDocument()
    expect(screen.getByText(/4 min read/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /post b/i })).toHaveAttribute('href', '/journal/b')
  })

  it('renders a not-found state for an unknown slug', () => {
    getPostBySlug.mockReturnValue(undefined)
    renderAt('missing')
    expect(screen.getByText(/drifted away/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /journal/i })).toHaveAttribute('href', '/journal')
  })
})
