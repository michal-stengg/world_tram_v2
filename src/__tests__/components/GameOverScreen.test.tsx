import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameOverScreen } from '../../components/screens/GameOverScreen'
import { useGameStore } from '../../stores/gameStore'

// Mock the gameStore
vi.mock('../../stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

describe('GameOverScreen', () => {
  const mockSetScreen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGameStore).mockImplementation((selector) => {
      const state = {
        currentScreen: 'gameOver' as const,
        setScreen: mockSetScreen,
        goBack: vi.fn(),
        gameOverReason: 'starvation' as const,
      }
      return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
    })
  })

  describe('rendering', () => {
    it('displays GAME OVER header', () => {
      render(<GameOverScreen />)

      expect(screen.getByText(/game over/i)).toBeInTheDocument()
    })

    it('displays TRY AGAIN button', () => {
      render(<GameOverScreen />)

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })
  })

  describe('game over reason messages', () => {
    it('displays starvation message', () => {
      vi.mocked(useGameStore).mockImplementation((selector) => {
        const state = {
          currentScreen: 'gameOver' as const,
          setScreen: mockSetScreen,
          goBack: vi.fn(),
          gameOverReason: 'starvation' as const,
        }
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })
      render(<GameOverScreen />)

      expect(screen.getByText(/ran out of food/i)).toBeInTheDocument()
    })

    it('displays out of fuel message', () => {
      vi.mocked(useGameStore).mockImplementation((selector) => {
        const state = {
          currentScreen: 'gameOver' as const,
          setScreen: mockSetScreen,
          goBack: vi.fn(),
          gameOverReason: 'out_of_fuel' as const,
        }
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })
      render(<GameOverScreen />)

      expect(screen.getByText(/ran out of fuel/i)).toBeInTheDocument()
    })

    it('displays dehydration message', () => {
      vi.mocked(useGameStore).mockImplementation((selector) => {
        const state = {
          currentScreen: 'gameOver' as const,
          setScreen: mockSetScreen,
          goBack: vi.fn(),
          gameOverReason: 'dehydration' as const,
        }
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })
      render(<GameOverScreen />)

      expect(screen.getByText(/ran out of water/i)).toBeInTheDocument()
    })

    it('displays broke message', () => {
      vi.mocked(useGameStore).mockImplementation((selector) => {
        const state = {
          currentScreen: 'gameOver' as const,
          setScreen: mockSetScreen,
          goBack: vi.fn(),
          gameOverReason: 'broke' as const,
        }
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })
      render(<GameOverScreen />)

      expect(screen.getByText(/ran out of money/i)).toBeInTheDocument()
    })

    it('displays generic message when no reason', () => {
      vi.mocked(useGameStore).mockImplementation((selector) => {
        const state = {
          currentScreen: 'gameOver' as const,
          setScreen: mockSetScreen,
          goBack: vi.fn(),
          gameOverReason: null,
        }
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })
      render(<GameOverScreen />)

      expect(screen.getByTestId('game-over-reason')).toHaveTextContent('Game Over!')
    })
  })

  describe('styling', () => {
    it('renders GAME OVER text with danger color', () => {
      render(<GameOverScreen />)

      const gameOverHeading = screen.getByRole('heading', { level: 1 })
      expect(gameOverHeading).toHaveStyle({ color: 'var(--color-danger, #e74c3c)' })
    })

    it('renders TRY AGAIN button with danger variant', () => {
      render(<GameOverScreen />)

      const button = screen.getByRole('button', { name: /try again/i })
      expect(button).toHaveAttribute('data-variant', 'danger')
    })

    it('renders TRY AGAIN button with large size', () => {
      render(<GameOverScreen />)

      const button = screen.getByRole('button', { name: /try again/i })
      expect(button).toHaveAttribute('data-size', 'large')
    })
  })

  describe('navigation', () => {
    it('navigates to captainSelect when TRY AGAIN is clicked', () => {
      render(<GameOverScreen />)

      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      expect(mockSetScreen).toHaveBeenCalledTimes(1)
      expect(mockSetScreen).toHaveBeenCalledWith('captainSelect')
    })
  })

  describe('accessibility', () => {
    it('has skull emojis marked as decorative', () => {
      render(<GameOverScreen />)

      // The emoji spans should have aria-hidden
      const emojiContainers = document.querySelectorAll('[aria-hidden="true"]')
      expect(emojiContainers.length).toBeGreaterThan(0)
    })

    it('has a focusable TRY AGAIN button', () => {
      render(<GameOverScreen />)

      const button = screen.getByRole('button', { name: /try again/i })
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })
})
