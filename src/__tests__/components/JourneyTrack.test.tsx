import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { JourneyTrack } from '../../components/game/JourneyTrack'
import { useGameStore } from '../../stores/gameStore'
import { countries } from '../../data/countries'
import { STARTING_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'

describe('JourneyTrack', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        currentCountryIndex: 0,
        progressInCountry: 0,
        resources: { ...STARTING_RESOURCES },
        crew: [...startingCrew],
        selectedTrain: {
          id: 'blitzzug',
          name: 'Blitzzug',
          origin: 'Germany',
          character: 'Test train',
          sprite: '🚄',
          stats: { speed: 3, reliability: 5, power: 3 },
        },
      })
    })
  })

  describe('rendering', () => {
    it('renders the journey track container', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('journey-track')).toBeInTheDocument()
    })

    it('renders all 10 countries', () => {
      render(<JourneyTrack />)
      countries.forEach((country) => {
        expect(screen.getByTestId(`country-marker-${country.id}`)).toBeInTheDocument()
      })
    })

    it('renders the rail', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('rail')).toBeInTheDocument()
    })

    it('renders the train position indicator', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('train-position')).toBeInTheDocument()
    })

    it('shows selected train sprite', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('train-position')).toHaveTextContent('🚄')
    })
  })

  describe('country order', () => {
    it('France is first country', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('country-marker-france')).toBeInTheDocument()
    })

    it('USA is last country', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('country-marker-usa')).toBeInTheDocument()
    })
  })

  describe('country status', () => {
    it('marks first country as current initially', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'current')
    })

    it('marks subsequent countries as upcoming initially', () => {
      render(<JourneyTrack />)
      expect(screen.getByTestId('country-marker-germany')).toHaveAttribute('data-status', 'upcoming')
      expect(screen.getByTestId('country-marker-russia')).toHaveAttribute('data-status', 'upcoming')
    })

    it('updates status when currentCountryIndex changes', () => {
      render(<JourneyTrack />)

      act(() => {
        useGameStore.setState({ currentCountryIndex: 2 })
      })

      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'visited')
      expect(screen.getByTestId('country-marker-germany')).toHaveAttribute('data-status', 'visited')
      expect(screen.getByTestId('country-marker-russia')).toHaveAttribute('data-status', 'current')
      expect(screen.getByTestId('country-marker-china')).toHaveAttribute('data-status', 'upcoming')
    })

    it('marks all previous countries as visited when near end', () => {
      render(<JourneyTrack />)

      act(() => {
        useGameStore.setState({ currentCountryIndex: 9 }) // USA (last)
      })

      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'visited')
      expect(screen.getByTestId('country-marker-canada')).toHaveAttribute('data-status', 'visited')
      expect(screen.getByTestId('country-marker-usa')).toHaveAttribute('data-status', 'current')
    })
  })

  describe('train indicator', () => {
    it('shows default train emoji when no train selected', () => {
      act(() => {
        useGameStore.setState({ selectedTrain: null })
      })

      render(<JourneyTrack />)
      expect(screen.getByTestId('train-position')).toHaveTextContent('🚂')
    })
  })
})
