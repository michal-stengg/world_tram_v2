import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignalSwitchGame } from '../../components/minigames/SignalSwitchGame'
import { getMiniGameByCountryId } from '../../data/minigames'

const testMiniGame = getMiniGameByCountryId('germany')!

describe('SignalSwitchGame', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders title, description, and start button', () => {
    render(<SignalSwitchGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    expect(screen.getByText('Signal Switch')).toBeInTheDocument()
    expect(screen.getByText('Switch the railway signals in the right order!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
  })

  it('starts with the first requested signal', () => {
    render(<SignalSwitchGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))

    expect(screen.getByText(/set signal to red/i)).toBeInTheDocument()
    expect(screen.getByText(/step 1\/5/i)).toBeInTheDocument()
  })

  it('scores correct switches and completes after the sequence', () => {
    render(<SignalSwitchGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    ;['Red', 'Green', 'Yellow', 'Green', 'Red'].forEach((signal) => {
      fireEvent.click(screen.getByRole('button', { name: signal }))
    })

    expect(mockOnComplete).toHaveBeenCalledWith(5, 5)
  })

  it('does not score wrong switches', () => {
    render(<SignalSwitchGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /start/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Green' }))

    expect(screen.getByText(/score: 0/i)).toBeInTheDocument()
    expect(screen.getByText(/step 2\/5/i)).toBeInTheDocument()
  })

  it('calls onSkip', () => {
    render(<SignalSwitchGame miniGame={testMiniGame} onComplete={mockOnComplete} onSkip={mockOnSkip} />)

    fireEvent.click(screen.getByRole('button', { name: /skip/i }))

    expect(mockOnSkip).toHaveBeenCalledTimes(1)
  })
})
