import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import GalleryCard from './GalleryCard'

const baseItem = {
  id: 'test-app',
  title: 'Test App',
  tagline: 'A test tagline',
  stack: ['Go', 'React'],
  githubUrl: 'https://github.com/example/test-app',
  liveUrl: null,
  status: 'shipped',
}

const liveItem = {
  ...baseItem,
  id: 'pomodoro-roulette',
  title: 'Pomodoro Roulette',
  liveUrl: 'https://pomodororoulette-production.up.railway.app/',
  status: 'shipped',
}

describe('GalleryCard', () => {
  it('renders title, tagline, and stack', () => {
    render(<GalleryCard item={baseItem} />)
    expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    expect(screen.getByText('A test tagline')).toBeInTheDocument()
    expect(screen.getByText('Go')).toBeInTheDocument()
  })

  it('shows GitHub link when githubUrl is set', () => {
    render(<GalleryCard item={baseItem} />)
    const link = screen.getByRole('link', { name: /view test app on github/i })
    expect(link).toHaveAttribute('href', baseItem.githubUrl)
  })

  it('shows Open app and GitHub links when both URLs are set', () => {
    render(<GalleryCard item={liveItem} />)
    const open = screen.getByRole('link', { name: /open pomodoro roulette/i })
    const github = screen.getByRole('link', { name: /view pomodoro roulette on github/i })
    expect(open).toHaveAttribute('href', liveItem.liveUrl)
    expect(github).toHaveAttribute('href', liveItem.githubUrl)
    expect(open.compareDocumentPosition(github) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows GitHub only when liveUrl is null', () => {
    render(<GalleryCard item={baseItem} />)
    expect(screen.getByRole('link', { name: /view test app on github/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /open test app/i })).not.toBeInTheDocument()
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

  it('renders zero-padded display index when displayIndex is provided', () => {
    const { container } = render(<GalleryCard item={baseItem} displayIndex={1} />)
    expect(container.querySelector('[class*="index"]')).toHaveTextContent('01')
  })

  it('does not render display index when displayIndex is omitted', () => {
    const { container } = render(<GalleryCard item={baseItem} />)
    expect(container.querySelector('[class*="index"]')).not.toBeInTheDocument()
  })

  it('does not prepend index to accessible card title', () => {
    render(<GalleryCard item={baseItem} displayIndex={1} />)
    expect(screen.getByRole('heading', { name: 'Test App' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /01/i })).not.toBeInTheDocument()
  })
})
