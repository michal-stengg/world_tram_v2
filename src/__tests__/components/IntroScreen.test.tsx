import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { IntroScreen } from '../../components/screens/IntroScreen'

// Mock the gameStore
const mockSetScreen = vi.fn()

vi.mock('../../stores/gameStore', () => ({
  useGameStore: vi.fn((selector) => {
    const state = {
      setScreen: mockSetScreen,
    }
    return selector(state)
  }),
}))

describe('IntroScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the title "WORLD TRAM"', () => {
      render(<IntroScreen />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('WORLD TRAM')
    })

    it('renders the subtitle "A Turn-Based Railway Adventure"', () => {
      render(<IntroScreen />)

      expect(screen.getByText('A Turn-Based Railway Adventure')).toBeInTheDocument()
    })

    it('renders a START GAME button', () => {
      render(<IntroScreen />)

      expect(screen.getByRole('button', { name: /start game/i })).toBeInTheDocument()
    })

    it('renders a train emoji for visual flair', () => {
      render(<IntroScreen />)

      // The train emoji should be present somewhere in the component
      expect(screen.getByText(/🚂/)).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls setScreen with "captainSelect" when START GAME is clicked', () => {
      render(<IntroScreen />)

      const startButton = screen.getByRole('button', { name: /start game/i })
      fireEvent.click(startButton)

      expect(mockSetScreen).toHaveBeenCalledTimes(1)
      expect(mockSetScreen).toHaveBeenCalledWith('captainSelect')
    })
  })

  describe('styling', () => {
    it('renders the START GAME button with glow effect', () => {
      render(<IntroScreen />)

      const startButton = screen.getByRole('button', { name: /start game/i })
      expect(startButton).toHaveAttribute('data-glow', 'true')
    })
  })
})
