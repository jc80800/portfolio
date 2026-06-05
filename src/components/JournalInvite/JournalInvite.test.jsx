import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import JournalInvite from './JournalInvite'
import { JOURNAL_SERIES_TITLE, JOURNAL_INVITE_CTA } from '../../config/brand'

function renderInvite() {
  return render(
    <MemoryRouter>
      <JournalInvite />
    </MemoryRouter>
  )
}

describe('JournalInvite', () => {
  it('renders the series title', () => {
    renderInvite()
    expect(screen.getByText(JOURNAL_SERIES_TITLE)).toBeInTheDocument()
  })

  it('links to the journal via the CTA', () => {
    renderInvite()
    const cta = screen.getByRole('link', { name: new RegExp(JOURNAL_INVITE_CTA, 'i') })
    expect(cta).toHaveAttribute('href', '/journal')
  })

  it('does not render any post previews', () => {
    const { container } = renderInvite()
    expect(container.querySelectorAll('article')).toHaveLength(0)
  })
})
