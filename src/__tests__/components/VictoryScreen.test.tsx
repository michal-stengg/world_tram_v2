import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VictoryScreen } from '../../components/screens/VictoryScreen'
import { useGameStore } from '../../stores/gameStore'

// Mock the game store
vi.mock('../../stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

describe('VictoryScreen', () => {
  const mockSetScreen = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGameStore).mockImplementation((selector) => {
      const state = {
        currentScreen: 'victory' as const,
        setScreen: mockSetScreen,
        goBack: vi.fn(),
        turnCount: 25,
      }
      return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
    })
  })

  describe('rendering', () => {
    it('renders "VICTORY!" text', () => {
      render(<VictoryScreen />)

      expect(screen.getByText('VICTORY!')).toBeInTheDocument()
    })

    it('renders trophy emoji', () => {
      render(<VictoryScreen />)

      // Trophy is part of the celebration emojis
      expect(screen.getByText(/🏆/)).toBeInTheDocument()
    })

    it('renders turn count message', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/You completed the journey/)).toBeInTheDocument()
      expect(screen.getByText(/turns!/)).toBeInTheDocument()
    })

    it('displays actual turn count from store', () => {
      render(<VictoryScreen />)

      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText(/25/)).toBeInTheDocument()
    })

    it('updates when turn count changes', () => {
      const { rerender } = render(<VictoryScreen />)
      expect(screen.getByText('25')).toBeInTheDocument()

      // Update mock to return different turn count
      vi.mocked(useGameStore).mockImplementation((selector) => {
        const state = {
          currentScreen: 'victory' as const,
          setScreen: mockSetScreen,
          goBack: vi.fn(),
          turnCount: 30,
        }
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })

      rerender(<VictoryScreen />)
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('renders NEW GAME button', () => {
      render(<VictoryScreen />)

      expect(screen.getByRole('button', { name: 'NEW GAME' })).toBeInTheDocument()
    })

    it('renders celebration emojis', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/🎉/)).toBeInTheDocument()
      expect(screen.getByText(/🎊/)).toBeInTheDocument()
    })

    it('renders congratulations message', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/Congratulations, Captain!/)).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('renders VICTORY text with gold color', () => {
      render(<VictoryScreen />)

      const victoryText = screen.getByText('VICTORY!')
      expect(victoryText).toHaveStyle({ color: '#F7B538' })
    })

    it('renders NEW GAME button with gold variant', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      expect(button).toHaveAttribute('data-variant', 'gold')
    })

    it('renders NEW GAME button with glow effect', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      expect(button).toHaveAttribute('data-glow', 'true')
    })

    it('renders NEW GAME button with large size', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      expect(button).toHaveAttribute('data-size', 'large')
    })
  })

  describe('navigation', () => {
    it('navigates to captainSelect when NEW GAME is clicked', () => {
      render(<VictoryScreen />)

      const newGameButton = screen.getByRole('button', { name: 'NEW GAME' })
      fireEvent.click(newGameButton)

      expect(mockSetScreen).toHaveBeenCalledTimes(1)
      expect(mockSetScreen).toHaveBeenCalledWith('captainSelect')
    })
  })

  describe('accessibility', () => {
    it('has celebration emojis marked as decorative', () => {
      render(<VictoryScreen />)

      // The emoji containers should have aria-hidden
      const emojiContainers = document.querySelectorAll('[aria-hidden="true"]')
      expect(emojiContainers.length).toBeGreaterThan(0)
    })

    it('has a focusable NEW GAME button', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })
})
