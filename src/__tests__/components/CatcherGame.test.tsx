import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CatcherGame } from '../../components/minigames/CatcherGame'
import { getMiniGameByCountryId } from '../../data/minigames'

// Get a catcher-type mini-game for testing
const testMiniGame = getMiniGameByCountryId('france')! // Croissant Catcher

describe('CatcherGame', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('ready state', () => {
    it('renders game title and description', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByText('Croissant Catcher')).toBeInTheDocument()
      expect(screen.getByText('Catch falling croissants!')).toBeInTheDocument()
    })

    it('shows start button in ready state', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('shows skip button', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('skip button calls onSkip', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const skipButton = screen.getByRole('button', { name: /skip/i })
      fireEvent.click(skipButton)

      expect(mockOnSkip).toHaveBeenCalledTimes(1)
    })

    it('shows instructions in ready state', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByText(/arrow keys/i)).toBeInTheDocument()
    })
  })

  describe('playing state', () => {
    it('clicking start begins the game', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Start button should be gone
      expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
    })

    it('shows timer during gameplay', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Should show 15 seconds initially
      expect(screen.getByText(/15/)).toBeInTheDocument()
    })

    it('shows score during gameplay', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Should show score of 0 initially
      expect(screen.getByText(/score/i)).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('timer counts down during gameplay', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Should show 14 seconds
      expect(screen.getByText(/14/)).toBeInTheDocument()
    })

    it('shows the catcher element', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // The catcher should be visible (basket emoji)
      expect(screen.getByTestId('catcher')).toBeInTheDocument()
    })

    it('catcher moves left with left arrow key', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const catcher = screen.getByTestId('catcher')
      const initialLeft = catcher.style.left

      // Press left arrow
      fireEvent.keyDown(window, { key: 'ArrowLeft' })

      // Catcher should have moved left (lower percentage)
      const newLeft = catcher.style.left
      expect(parseFloat(newLeft)).toBeLessThan(parseFloat(initialLeft))
    })

    it('catcher moves right with right arrow key', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const catcher = screen.getByTestId('catcher')
      const initialLeft = catcher.style.left

      // Press right arrow
      fireEvent.keyDown(window, { key: 'ArrowRight' })

      // Catcher should have moved right (higher percentage)
      const newLeft = catcher.style.left
      expect(parseFloat(newLeft)).toBeGreaterThan(parseFloat(initialLeft))
    })
  })

  describe('game completion', () => {
    it('calls onComplete with score when game ends', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 15 seconds (game duration)
      act(() => {
        vi.advanceTimersByTime(15000)
      })

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 15)
    })

    it('shows finished state with final score', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 15 seconds
      act(() => {
        vi.advanceTimersByTime(15000)
      })

      // Should show game over message
      expect(screen.getByText(/game over/i)).toBeInTheDocument()
    })
  })

  describe('items falling', () => {
    it('spawns items during gameplay', () => {
      render(
        <CatcherGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time to allow items to spawn
      act(() => {
        vi.advanceTimersByTime(1500)
      })

      // Should have at least one falling item
      const items = screen.queryAllByTestId('falling-item')
      expect(items.length).toBeGreaterThan(0)
    })
  })
})
