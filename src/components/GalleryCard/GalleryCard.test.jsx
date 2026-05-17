import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GalleryCard from './GalleryCard'

const baseItem = {
  id: 'test-app',
  title: 'Test App',
  tagline: 'A test tagline',
  stack: ['Go', 'React'],
  proves: 'Testing things',
  githubUrl: 'https://github.com/example/test-app',
  status: 'shipped',
}

describe('GalleryCard', () => {
  it('renders title, tagline, stack, and proves', () => {
    render(<GalleryCard item={baseItem} />)
    expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    expect(screen.getByText('A test tagline')).toBeInTheDocument()
    expect(screen.getByText('Go')).toBeInTheDocument()
    expect(screen.getByText('Testing things')).toBeInTheDocument()
  })

  it('shows GitHub link when githubUrl is set', () => {
    render(<GalleryCard item={baseItem} />)
    const link = screen.getByRole('link', { name: /view test app on github/i })
    expect(link).toHaveAttribute('href', baseItem.githubUrl)
  })

  it('shows Coming soon for wip without githubUrl', () => {
    render(
      <GalleryCard
        item={{ ...baseItem, githubUrl: null, status: 'wip' }}
      />
    )
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument()
  })
})
