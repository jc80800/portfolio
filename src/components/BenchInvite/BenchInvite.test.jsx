import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import BenchInvite from './BenchInvite'
import { BENCH_SERIES_TITLE, BENCH_INVITE_CTA } from '../../config/brand'

function renderInvite() {
  return render(
    <MemoryRouter>
      <BenchInvite />
    </MemoryRouter>
  )
}

describe('BenchInvite', () => {
  it('renders the series title', () => {
    renderInvite()
    expect(screen.getByText(BENCH_SERIES_TITLE)).toBeInTheDocument()
  })

  it('links to the bench via the CTA', () => {
    renderInvite()
    const cta = screen.getByRole('link', { name: new RegExp(BENCH_INVITE_CTA, 'i') })
    expect(cta).toHaveAttribute('href', '/bench')
  })
})
