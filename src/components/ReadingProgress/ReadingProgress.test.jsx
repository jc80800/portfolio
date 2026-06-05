import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ReadingProgress from './ReadingProgress'

describe('ReadingProgress', () => {
  it('renders a decorative progress bar', () => {
    const { container } = render(<ReadingProgress />)
    const bar = container.querySelector('[aria-hidden="true"]')
    expect(bar).toBeInTheDocument()
  })

  it('initializes progress width at 0%', () => {
    const { container } = render(<ReadingProgress />)
    const fill = container.querySelector('[data-testid="progress-fill"]')
    expect(fill).toHaveStyle({ width: '0%' })
  })
})
