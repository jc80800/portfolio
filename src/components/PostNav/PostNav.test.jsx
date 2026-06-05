import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import PostNav from './PostNav'

function renderNav(props) {
  return render(
    <MemoryRouter>
      <PostNav {...props} />
    </MemoryRouter>
  )
}

describe('PostNav', () => {
  it('renders prev and next links to the right slugs', () => {
    renderNav({
      prev: { slug: 'newer', title: 'Newer Post' },
      next: { slug: 'older', title: 'Older Post' },
    })
    expect(screen.getByRole('link', { name: /newer post/i })).toHaveAttribute('href', '/journal/newer')
    expect(screen.getByRole('link', { name: /older post/i })).toHaveAttribute('href', '/journal/older')
  })

  it('omits the prev side when prev is null', () => {
    renderNav({ prev: null, next: { slug: 'older', title: 'Older Post' } })
    expect(screen.queryByText(/newer/i)).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /older post/i })).toBeInTheDocument()
  })

  it('renders nothing when both are null', () => {
    const { container } = renderNav({ prev: null, next: null })
    expect(container).toBeEmptyDOMElement()
  })
})
