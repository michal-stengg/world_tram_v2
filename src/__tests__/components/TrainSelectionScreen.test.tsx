import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrainSelectionScreen } from '../../components/screens/TrainSelectionScreen'
import { useGameStore } from '../../stores/gameStore'
import { trains } from '../../data/trains'

// Mock the game store
vi.mock('../../stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

describe('TrainSelectionScreen', () => {
  const mockGoBack = vi.fn()
  const mockSelectTrain = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGameStore).mockImplementation((selector) => {
      const state = {
        currentScreen: 'trainSelect' as const,
        goBack: mockGoBack,
        selectTrain: mockSelectTrain,
      }
      return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
    })
  })

  describe('rendering', () => {
    it('renders the header "CHOOSE YOUR TRAIN"', () => {
      render(<TrainSelectionScreen />)

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'CHOOSE YOUR TRAIN'
      )
    })

    it('renders the back button', () => {
      render(<TrainSelectionScreen />)

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
    })

    it('renders three train cards', () => {
      render(<TrainSelectionScreen />)

      // Check for all three train names
      expect(screen.getByText('Blitzzug')).toBeInTheDocument()
      expect(screen.getByText('Kitsune')).toBeInTheDocument()
      expect(screen.getByText('Ironhorse')).toBeInTheDocument()
    })

    it('renders train origins', () => {
      render(<TrainSelectionScreen />)

      expect(screen.getByText('Germany')).toBeInTheDocument()
      expect(screen.getByText('Japan')).toBeInTheDocument()
      expect(screen.getByText('USA')).toBeInTheDocument()
    })

    it('renders train stats', () => {
      render(<TrainSelectionScreen />)

      // Each train should have Speed, Reliability, and Power stat bars
      expect(screen.getAllByText('Speed')).toHaveLength(3)
      expect(screen.getAllByText('Reliability')).toHaveLength(3)
      expect(screen.getAllByText('Power')).toHaveLength(3)
    })

    it('renders TrainCard components with data-testid', () => {
      render(<TrainSelectionScreen />)

      const trainCards = screen.getAllByTestId('train-card')
      expect(trainCards).toHaveLength(3)
    })

    it('renders train emojis', () => {
      render(<TrainSelectionScreen />)

      expect(screen.getByText('🚄')).toBeInTheDocument()
      expect(screen.getByText('🦊')).toBeInTheDocument()
      expect(screen.getByText('🚂')).toBeInTheDocument()
    })
  })

  describe('navigation', () => {
    it('calls goBack when back button is clicked', () => {
      render(<TrainSelectionScreen />)

      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)

      expect(mockGoBack).toHaveBeenCalledTimes(1)
    })

    it('calls selectTrain with the train object when a train card is clicked', () => {
      render(<TrainSelectionScreen />)

      // Click on Blitzzug card
      const blitzzugCard = screen.getByText('Blitzzug').closest('[role="button"]')
      expect(blitzzugCard).not.toBeNull()
      fireEvent.click(blitzzugCard!)

      // selectTrain should be called with the Blitzzug train object
      const blitzzug = trains.find((t) => t.id === 'blitzzug')
      expect(mockSelectTrain).toHaveBeenCalledWith(blitzzug)
    })

    it('calls selectTrain with correct train for each card', () => {
      render(<TrainSelectionScreen />)

      // Click on Kitsune card
      const kitsuneCard = screen.getByText('Kitsune').closest('[role="button"]')
      fireEvent.click(kitsuneCard!)

      const kitsune = trains.find((t) => t.id === 'kitsune')
      expect(mockSelectTrain).toHaveBeenCalledWith(kitsune)

      vi.clearAllMocks()

      // Click on Ironhorse card
      const ironhorseCard = screen
        .getByText('Ironhorse')
        .closest('[role="button"]')
      fireEvent.click(ironhorseCard!)

      const ironhorse = trains.find((t) => t.id === 'ironhorse')
      expect(mockSelectTrain).toHaveBeenCalledWith(ironhorse)
    })
  })

  describe('accessibility', () => {
    it('train cards are keyboard accessible', () => {
      render(<TrainSelectionScreen />)

      const blitzzugCard = screen.getByText('Blitzzug').closest('[role="button"]')
      expect(blitzzugCard).toHaveAttribute('tabIndex', '0')
    })

    it('train cards have aria-label for screen readers', () => {
      render(<TrainSelectionScreen />)

      expect(
        screen.getByRole('button', { name: /select blitzzug train from germany/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /select kitsune train from japan/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /select ironhorse train from usa/i })
      ).toBeInTheDocument()
    })

    it('calls selectTrain when Enter key is pressed on a card', () => {
      render(<TrainSelectionScreen />)

      const blitzzugCard = screen.getByText('Blitzzug').closest('[role="button"]')
      fireEvent.keyDown(blitzzugCard!, { key: 'Enter' })

      const blitzzug = trains.find((t) => t.id === 'blitzzug')
      expect(mockSelectTrain).toHaveBeenCalledWith(blitzzug)
    })

    it('calls selectTrain when Space key is pressed on a card', () => {
      render(<TrainSelectionScreen />)

      const blitzzugCard = screen.getByText('Blitzzug').closest('[role="button"]')
      fireEvent.keyDown(blitzzugCard!, { key: ' ' })

      const blitzzug = trains.find((t) => t.id === 'blitzzug')
      expect(mockSelectTrain).toHaveBeenCalledWith(blitzzug)
    })
  })
})
