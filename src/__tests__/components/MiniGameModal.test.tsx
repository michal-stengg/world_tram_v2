import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MiniGameModal } from '../../components/game/MiniGameModal'
import { getMiniGameByCountryId } from '../../data/minigames'

describe('MiniGameModal', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('with catcher type', () => {
    const catcherGame = getMiniGameByCountryId('france')! // Croissant Catcher

    it('renders CatcherGame for catcher type', () => {
      render(
        <MiniGameModal
          miniGame={catcherGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // CatcherGame shows the game name and description
      expect(screen.getByText('Croissant Catcher')).toBeInTheDocument()
      expect(screen.getByText('Catch falling croissants!')).toBeInTheDocument()
    })
  })

  describe('with timing type', () => {
    const timingGame = getMiniGameByCountryId('germany')! // Beer Stein Balance

    it('renders TimingGame for timing type', () => {
      render(
        <MiniGameModal
          miniGame={timingGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // TimingGame shows the game name and description
      expect(screen.getByText('Beer Stein Balance')).toBeInTheDocument()
      expect(screen.getByText('Balance the stein at the right moment!')).toBeInTheDocument()
    })
  })

  describe('with memory type', () => {
    const memoryGame = getMiniGameByCountryId('russia')! // Matryoshka Match

    it('renders MemoryGame for memory type', () => {
      render(
        <MiniGameModal
          miniGame={memoryGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // MemoryGame shows the game name
      expect(screen.getByText('Matryoshka Match')).toBeInTheDocument()
    })
  })

  describe('results screen', () => {
    const catcherGame = getMiniGameByCountryId('france')! // Croissant Catcher

    it('shows results after game completion', () => {
      render(
        <MiniGameModal
          miniGame={catcherGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // Start the game
      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 15 seconds (game duration for CatcherGame)
      act(() => {
        vi.advanceTimersByTime(15000)
      })

      // Results screen should be visible
      expect(screen.getByText('Game Complete!')).toBeInTheDocument()
    })

    it('displays score and reward', () => {
      render(
        <MiniGameModal
          miniGame={catcherGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // Start the game
      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 15 seconds
      act(() => {
        vi.advanceTimersByTime(15000)
      })

      // Score should be displayed
      expect(screen.getByText(/Score:/)).toBeInTheDocument()
      // Reward should be displayed (food for france)
      expect(screen.getByText(/Reward:/)).toBeInTheDocument()
      expect(screen.getByText(/food/i)).toBeInTheDocument()
    })

    it('clicking Collect Reward calls onComplete', () => {
      render(
        <MiniGameModal
          miniGame={catcherGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // Start the game
      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 15 seconds
      act(() => {
        vi.advanceTimersByTime(15000)
      })

      // Click Collect Reward button
      const collectButton = screen.getByRole('button', { name: /collect reward/i })
      fireEvent.click(collectButton)

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 15) // maxScore is 15 for CatcherGame
    })
  })

  describe('skip functionality', () => {
    const catcherGame = getMiniGameByCountryId('france')! // Croissant Catcher

    it('skip passes through to game component', () => {
      render(
        <MiniGameModal
          miniGame={catcherGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // Find and click skip button (in the child game component)
      const skipButton = screen.getByRole('button', { name: /skip/i })
      fireEvent.click(skipButton)

      expect(mockOnSkip).toHaveBeenCalledTimes(1)
    })
  })

  describe('modal overlay', () => {
    const catcherGame = getMiniGameByCountryId('france')! // Croissant Catcher

    it('renders with modal overlay', () => {
      render(
        <MiniGameModal
          miniGame={catcherGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      // Check for modal overlay
      const overlay = screen.getByTestId('minigame-modal-overlay')
      expect(overlay).toBeInTheDocument()
    })
  })
})
