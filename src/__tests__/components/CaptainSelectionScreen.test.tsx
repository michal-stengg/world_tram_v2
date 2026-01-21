import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CaptainSelectionScreen } from '../../components/screens/CaptainSelectionScreen'
import { captains } from '../../data/captains'

// Mock the game store
const mockSetScreen = vi.fn()
const mockGoBack = vi.fn()
const mockSelectCaptain = vi.fn()

vi.mock('../../stores/gameStore', () => ({
  useGameStore: (selector: (state: {
    setScreen: typeof mockSetScreen
    goBack: typeof mockGoBack
    selectCaptain: typeof mockSelectCaptain
  }) => unknown) => {
    const state = {
      setScreen: mockSetScreen,
      goBack: mockGoBack,
      selectCaptain: mockSelectCaptain,
    }
    return selector(state)
  },
}))

describe('CaptainSelectionScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders the header "CHOOSE YOUR CAPTAIN"', () => {
      render(<CaptainSelectionScreen />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('CHOOSE YOUR CAPTAIN')
    })

    it('renders the back button', () => {
      render(<CaptainSelectionScreen />)

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })

    it('renders three captain cards', () => {
      render(<CaptainSelectionScreen />)

      // CaptainCard uses data-testid="captain-card-{id}" format
      const captainCards = captains.map(c => screen.getByTestId(`captain-card-${c.id}`))
      expect(captainCards).toHaveLength(3)
    })

    it('renders captain names from real data', () => {
      render(<CaptainSelectionScreen />)

      captains.forEach((captain) => {
        expect(screen.getByText(captain.name)).toBeInTheDocument()
      })
    })

    it('renders captain origins from real data', () => {
      render(<CaptainSelectionScreen />)

      captains.forEach((captain) => {
        expect(screen.getByText(captain.origin)).toBeInTheDocument()
      })
    })

    it('renders captain descriptions from real data', () => {
      render(<CaptainSelectionScreen />)

      captains.forEach((captain) => {
        expect(screen.getByText(captain.description)).toBeInTheDocument()
      })
    })

    it('renders captain stat bars', () => {
      render(<CaptainSelectionScreen />)

      // Each captain has 3 stat bars (Eng, Food, Sec)
      // With 3 captains, we should see 9 stat bars total
      expect(screen.getAllByText('Eng')).toHaveLength(3)
      expect(screen.getAllByText('Food')).toHaveLength(3)
      expect(screen.getAllByText('Sec')).toHaveLength(3)
    })
  })

  describe('navigation', () => {
    it('calls goBack when back button is clicked', () => {
      render(<CaptainSelectionScreen />)

      fireEvent.click(screen.getByRole('button', { name: /back/i }))

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('calls selectCaptain with captain object when clicking a captain card', () => {
      render(<CaptainSelectionScreen />)

      // Click Renji's card
      const renjiCard = screen.getByLabelText('Select captain Renji')
      fireEvent.click(renjiCard)

      expect(mockSelectCaptain).toHaveBeenCalledTimes(1)
      expect(mockSelectCaptain).toHaveBeenCalledWith(captains[0])
    })

    it('calls selectCaptain with correct captain for each card', () => {
      render(<CaptainSelectionScreen />)

      // Click each captain and verify the correct captain object is passed
      captains.forEach((captain, index) => {
        mockSelectCaptain.mockClear()

        const card = screen.getByLabelText(`Select captain ${captain.name}`)
        fireEvent.click(card)

        expect(mockSelectCaptain).toHaveBeenCalledWith(captains[index])
      })
    })
  })

  describe('accessibility', () => {
    it('captain cards are keyboard accessible with Enter key', () => {
      render(<CaptainSelectionScreen />)

      const card = screen.getByLabelText('Select captain Renji')
      fireEvent.keyDown(card, { key: 'Enter' })

      expect(mockSelectCaptain).toHaveBeenCalledWith(captains[0])
    })

    it('captain cards respond to space key', () => {
      render(<CaptainSelectionScreen />)

      const card = screen.getByLabelText('Select captain Luca')
      fireEvent.keyDown(card, { key: ' ' })

      expect(mockSelectCaptain).toHaveBeenCalledWith(captains[1])
    })

    it('captain cards have appropriate aria labels', () => {
      render(<CaptainSelectionScreen />)

      captains.forEach((captain) => {
        expect(screen.getByLabelText(`Select captain ${captain.name}`)).toBeInTheDocument()
      })
    })

    it('captain cards have button role', () => {
      render(<CaptainSelectionScreen />)

      const cards = screen.getAllByRole('button')
      // 1 back button + 3 captain cards = 4 buttons total
      expect(cards.length).toBe(4)
    })
  })
})
