import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TrackRepairGame } from '../../components/minigames/TrackRepairGame'
import { getMiniGameByCountryId } from '../../data/minigames'

const testMiniGame = getMiniGameByCountryId('australia')!

describe('TrackRepairGame', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, description, and start button', () => {
    render(<TrackRepairGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    expect(screen.getByText('Track Repair')).toBeInTheDocument()
    expect(screen.getByText('Repair the cracked rail tiles!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('shows cracked rail tiles after starting', () => {
    render(<TrackRepairGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))

    expect(screen.getAllByRole('button', { name: /repair cracked rail/i })).toHaveLength(5)
    expect(screen.getByText(/repairs: 0\/5/i)).toBeInTheDocument()
  })

  it('repairs cracked tiles and completes when all are fixed', () => {
    render(<TrackRepairGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    screen.getAllByRole('button', { name: /repair cracked rail/i }).forEach((tile) => {
      fireEvent.click(tile)
    })

    expect(mockOnComplete).toHaveBeenCalledWith(5, 5)
  })

  it('ignores intact rail tiles', () => {
    render(<TrackRepairGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    fireEvent.click(screen.getAllByRole('button', { name: /intact rail/i })[0])

    expect(screen.getByText(/repairs: 0\/5/i)).toBeInTheDocument()
  })

  it('calls onSkip', () => {
    render(<TrackRepairGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /skip/i }))

    expect(mockOnSkip).toHaveBeenCalledTimes(1)
  })
})
