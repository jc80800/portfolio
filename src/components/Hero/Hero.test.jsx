import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import Hero from './Hero'

function renderHero() {
  return render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>
  )
}

describe('Hero', () => {
  it('renders studio name as h1 and garden tagline', () => {
    renderHero()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Gatewood Lab' })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'A quiet digital garden for small software experiments.'
      )
    ).toBeInTheDocument()
  })

  it('links Enter the gallery to /gallery', () => {
    renderHero()
    const cta = screen.getByRole('link', { name: 'Enter the gallery' })
    expect(cta).toHaveAttribute('href', '/gallery')
  })

  it('keeps calligraphy in a gate-post column hidden from accessibility tree', () => {
    const { container } = renderHero()
    const column = container.querySelector('[class*="calligraphyColumn"]')
    expect(column).toBeInTheDocument()
    expect(column).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders waterline and koi inside the scene', () => {
    const { container } = renderHero()
    const scene = container.querySelector('[class*="scene"]')
    expect(scene.querySelector('[class*="waterline"]')).toBeInTheDocument()
    expect(scene.querySelector('[class*="koiWrap"]')).toBeInTheDocument()
    expect(scene.querySelector('[class*="sceneLower"]')).not.toBeInTheDocument()
  })
})
