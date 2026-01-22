import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaptainStats } from '../../components/game/CaptainStats'

describe('CaptainStats', () => {
  const mockStats = {
    engineering: 5,
    food: 2,
    security: 3,
  }

  it('renders all three stat bars', () => {
    render(<CaptainStats stats={mockStats} />)

    const statBars = screen.getAllByTestId('stat-bar')
    expect(statBars).toHaveLength(3)
  })

  it('renders with correct labels in normal mode', () => {
    render(<CaptainStats stats={mockStats} />)

    expect(screen.getByText('Engineering')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
  })

  it('renders with abbreviated labels in compact mode', () => {
    render(<CaptainStats stats={mockStats} compact />)

    expect(screen.getByText('ENG')).toBeInTheDocument()
    expect(screen.getByText('FOOD')).toBeInTheDocument()
    expect(screen.getByText('SEC')).toBeInTheDocument()
  })

  it('passes correct values to stat bars', () => {
    render(<CaptainStats stats={mockStats} />)

    // Check by aria-label which includes the value
    expect(screen.getByLabelText('Engineering: 5 out of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Food: 2 out of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Security: 3 out of 6')).toBeInTheDocument()
  })

  it('has data-testid for container', () => {
    render(<CaptainStats stats={mockStats} />)

    expect(screen.getByTestId('captain-stats')).toBeInTheDocument()
  })
})
