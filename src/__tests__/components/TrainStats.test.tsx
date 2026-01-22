import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrainStats } from '../../components/game/TrainStats'

describe('TrainStats', () => {
  const mockStats = {
    speed: 5,
    reliability: 3,
    power: 4,
  }

  it('renders all three stat bars', () => {
    render(<TrainStats stats={mockStats} />)

    const statBars = screen.getAllByTestId('stat-bar')
    expect(statBars).toHaveLength(3)
  })

  it('renders with correct labels in normal mode', () => {
    render(<TrainStats stats={mockStats} />)

    expect(screen.getByText('Speed')).toBeInTheDocument()
    expect(screen.getByText('Reliability')).toBeInTheDocument()
    expect(screen.getByText('Power')).toBeInTheDocument()
  })

  it('renders with abbreviated labels in compact mode', () => {
    render(<TrainStats stats={mockStats} compact />)

    expect(screen.getByText('SPD')).toBeInTheDocument()
    expect(screen.getByText('REL')).toBeInTheDocument()
    expect(screen.getByText('PWR')).toBeInTheDocument()
  })

  it('passes correct values to stat bars', () => {
    render(<TrainStats stats={mockStats} />)

    // Check by aria-label which includes the value
    expect(screen.getByLabelText('Speed: 5 out of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Reliability: 3 out of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Power: 4 out of 6')).toBeInTheDocument()
  })

  it('has data-testid for container', () => {
    render(<TrainStats stats={mockStats} />)

    expect(screen.getByTestId('train-stats')).toBeInTheDocument()
  })
})
