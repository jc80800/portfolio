import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ShareLink from './ShareLink'

describe('ShareLink', () => {
  it('renders a copy-link button', () => {
    render(<ShareLink />)
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument()
  })

  it('copies the current URL and confirms', async () => {
    render(<ShareLink />)
    const user = userEvent.setup()
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue(undefined)

    await user.click(screen.getByRole('button', { name: /copy link/i }))
    expect(writeTextSpy).toHaveBeenCalledWith(window.location.href)
    expect(await screen.findByText(/copied/i)).toBeInTheDocument()
  })
})
