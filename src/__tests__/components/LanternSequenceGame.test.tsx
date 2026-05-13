import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LanternSequenceGame } from '../../components/minigames/LanternSequenceGame'
import { getMiniGameByCountryId } from '../../data/minigames'

const testMiniGame = getMiniGameByCountryId('china')!

describe('LanternSequenceGame', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, description, and start button', () => {
    render(<LanternSequenceGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    expect(screen.getByText('Lantern Sequence')).toBeInTheDocument()
    expect(screen.getByText('Repeat the lantern pattern!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('shows the pattern after starting', () => {
    render(<LanternSequenceGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))

    expect(screen.getByTestId('lantern-pattern')).toHaveTextContent('RedBlueGoldGreen')
    expect(screen.getByText(/input 1\/4/i)).toBeInTheDocument()
  })

  it('scores each correct lantern in order and completes', () => {
    render(<LanternSequenceGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    ;['Red Lantern', 'Blue Lantern', 'Gold Lantern', 'Green Lantern'].forEach((name) => {
      fireEvent.click(screen.getByRole('button', { name }))
    })

    expect(mockOnComplete).toHaveBeenCalledWith(4, 4)
  })

  it('resets progress after a wrong lantern', () => {
    render(<LanternSequenceGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Blue Lantern' }))

    expect(screen.getByText(/score: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/input 1\/4/i)).toBeInTheDocument()
  })

  it('calls onSkip', () => {
    render(<LanternSequenceGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /skip/i }))

    expect(mockOnSkip).toHaveBeenCalledTimes(1)
  })
})
