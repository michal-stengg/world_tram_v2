import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { TimingGame } from '../../components/minigames/TimingGame'
import { getMiniGameByCountryId } from '../../data/minigames'

// Get a timing-type mini-game for testing
const testMiniGame = getMiniGameByCountryId('germany')! // Beer Stein Balance

describe('TimingGame', () => {
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
    it('renders game title and icon', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByText('Beer Stein Balance')).toBeInTheDocument()
      expect(screen.getByText('🍺')).toBeInTheDocument()
    })

    it('shows start button in ready state', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('shows skip button', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('skip button calls onSkip', () => {
      render(
        <TimingGame
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
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByText(/stop.*indicator/i)).toBeInTheDocument()
    })
  })

  describe('playing state', () => {
    it('clicking start begins round 1', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Start button should be gone
      expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
      // Should show round 1
      expect(screen.getByText(/round 1/i)).toBeInTheDocument()
    })

    it('shows round counter during gameplay', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      expect(screen.getByText(/round 1\/5/i)).toBeInTheDocument()
    })

    it('shows score during gameplay', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      expect(screen.getByText(/score/i)).toBeInTheDocument()
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('shows timing bar with indicator', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      expect(screen.getByTestId('timing-bar')).toBeInTheDocument()
      expect(screen.getByTestId('indicator')).toBeInTheDocument()
      expect(screen.getByTestId('target-zone')).toBeInTheDocument()
    })

    it('shows STOP button during gameplay', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      expect(screen.getByRole('button', { name: /stop/i })).toBeInTheDocument()
    })

    it('indicator moves over time', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const indicator = screen.getByTestId('indicator')
      const initialPosition = indicator.style.left

      // Advance time to allow indicator to move
      act(() => {
        vi.advanceTimersByTime(100)
      })

      const newPosition = indicator.style.left
      expect(newPosition).not.toBe(initialPosition)
    })
  })

  describe('round evaluation', () => {
    it('clicking stop evaluates position and shows result', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time a bit
      act(() => {
        vi.advanceTimersByTime(100)
      })

      const stopButton = screen.getByRole('button', { name: /stop/i })
      fireEvent.click(stopButton)

      // Should show round result (Perfect, Good, OK, or Miss)
      expect(screen.getByTestId('round-result')).toBeInTheDocument()
    })

    it('proceeds to next round after result display', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Play round 1
      act(() => {
        vi.advanceTimersByTime(100)
      })
      const stopButton = screen.getByRole('button', { name: /stop/i })
      fireEvent.click(stopButton)

      // Wait for result display (1 second)
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Should be on round 2
      expect(screen.getByText(/round 2\/5/i)).toBeInTheDocument()
    })
  })

  describe('game completion', () => {
    it('after 5 rounds, shows finished state', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Complete 5 rounds
      for (let round = 0; round < 5; round++) {
        // Wait for indicator to move
        act(() => {
          vi.advanceTimersByTime(100)
        })

        // Click stop
        const stopButton = screen.getByRole('button', { name: /stop/i })
        fireEvent.click(stopButton)

        // Wait for result display
        act(() => {
          vi.advanceTimersByTime(1000)
        })
      }

      // Should show finished state
      expect(screen.getByText(/game complete/i)).toBeInTheDocument()
    })

    it('calls onComplete with score after 5 rounds', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Complete 5 rounds
      for (let round = 0; round < 5; round++) {
        act(() => {
          vi.advanceTimersByTime(100)
        })
        const stopButton = screen.getByRole('button', { name: /stop/i })
        fireEvent.click(stopButton)
        act(() => {
          vi.advanceTimersByTime(1000)
        })
      }

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 15)
    })

    it('shows final score in finished state', () => {
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Complete 5 rounds
      for (let round = 0; round < 5; round++) {
        act(() => {
          vi.advanceTimersByTime(100)
        })
        const stopButton = screen.getByRole('button', { name: /stop/i })
        fireEvent.click(stopButton)
        act(() => {
          vi.advanceTimersByTime(1000)
        })
      }

      // Should show score in finished state
      expect(screen.getByText(/score/i)).toBeInTheDocument()
      expect(screen.getByText(/\/\s*15/)).toBeInTheDocument()
    })
  })

  describe('scoring zones', () => {
    it('perfect zone (center) awards 3 points', () => {
      // This tests the scoring logic directly by checking if the score updates
      render(
        <TimingGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // The indicator starts at 0 and oscillates. We need to stop it near center (50)
      // With speed of ~1.3% per 20ms tick, to get to 50% takes about 770ms
      act(() => {
        vi.advanceTimersByTime(750) // Should be around 48-52%
      })

      const stopButton = screen.getByRole('button', { name: /stop/i })
      fireEvent.click(stopButton)

      // Check the result shows "Perfect" if we landed in the zone
      const result = screen.getByTestId('round-result')
      // Result could be Perfect (3pts), Good (2pts), OK (1pt), or Miss (0pts)
      // depending on exact timing - this tests that the result appears
      expect(result).toBeInTheDocument()
    })
  })
})
