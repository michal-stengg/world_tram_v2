import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { LocationIndicator } from '../../components/game/LocationIndicator'
import { useGameStore } from '../../stores/gameStore'

describe('LocationIndicator', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        currentCountryIndex: 0,
      })
    })
  })

  describe('rendering', () => {
    it('renders the location indicator container', () => {
      render(<LocationIndicator />)
      expect(screen.getByTestId('location-indicator')).toBeInTheDocument()
    })

    it('displays current country name', () => {
      render(<LocationIndicator />)
      expect(screen.getByText(/France/)).toBeInTheDocument()
    })

    it('displays current country icon', () => {
      render(<LocationIndicator />)
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🗼')
    })
  })

  describe('when not at final destination', () => {
    it('shows arrow and next country at index 0 (France)', () => {
      render(<LocationIndicator />)
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('→')
      expect(screen.getByText(/Germany/)).toBeInTheDocument()
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🏰')
    })

    it('shows arrow and next country at index 8 (Canada)', () => {
      act(() => {
        useGameStore.setState({ currentCountryIndex: 8 })
      })

      render(<LocationIndicator />)
      expect(screen.getByText(/Canada/)).toBeInTheDocument()
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🍁')
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('→')
      expect(screen.getByText(/USA/)).toBeInTheDocument()
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🗽')
    })

    it('does not show Final Destination when not at USA', () => {
      render(<LocationIndicator />)
      expect(screen.queryByText(/Final Destination/)).not.toBeInTheDocument()
    })
  })

  describe('when at final destination (USA, index 9)', () => {
    beforeEach(() => {
      act(() => {
        useGameStore.setState({ currentCountryIndex: 9 })
      })
    })

    it('displays USA as current country', () => {
      render(<LocationIndicator />)
      expect(screen.getByText(/USA/)).toBeInTheDocument()
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🗽')
    })

    it('shows Final Destination indicator with flag emoji', () => {
      render(<LocationIndicator />)
      expect(screen.getByText(/Final Destination/)).toBeInTheDocument()
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🏁')
    })

    it('does not show arrow when at USA', () => {
      render(<LocationIndicator />)
      expect(screen.getByTestId('location-indicator')).not.toHaveTextContent('→')
    })
  })

  describe('updates with state changes', () => {
    it('updates display when currentCountryIndex changes', () => {
      render(<LocationIndicator />)

      // Initially at France
      expect(screen.getByText(/France/)).toBeInTheDocument()

      // Move to Germany
      act(() => {
        useGameStore.setState({ currentCountryIndex: 1 })
      })

      expect(screen.getByText(/Germany/)).toBeInTheDocument()
      expect(screen.getByTestId('location-indicator')).toHaveTextContent('🏰')
      expect(screen.getByText(/Russia/)).toBeInTheDocument()
    })
  })
})
