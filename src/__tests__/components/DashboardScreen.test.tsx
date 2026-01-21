import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { DashboardScreen } from '../../components/screens/DashboardScreen'
import { useGameStore } from '../../stores/gameStore'
import { STARTING_RESOURCES, MAX_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import type { Captain, Train } from '../../types'

const mockCaptain: Captain = {
  id: 'renji',
  name: 'Renji',
  origin: 'Japan',
  description: 'A skilled captain',
  portrait: '🧑‍✈️',
  stats: { engineering: 5, food: 2, security: 3 },
}

const mockTrain: Train = {
  id: 'blitzzug',
  name: 'Blitzzug',
  origin: 'Germany',
  character: 'Fast and reliable',
  sprite: '🚄',
  stats: { speed: 3, reliability: 5, power: 3 },
}

describe('DashboardScreen', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        currentScreen: 'dashboard',
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
        resources: { ...STARTING_RESOURCES },
        crew: [...startingCrew],
        currentCountryIndex: 0,
        progressInCountry: 0,
        turnCount: 1,
        lastTurnResult: null,
        gameOverReason: null,
      })
    })
  })

  describe('rendering', () => {
    it('renders the dashboard screen container', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument()
    })

    it('renders all three zones', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('resource-zone')).toBeInTheDocument()
      expect(screen.getByTestId('journey-zone')).toBeInTheDocument()
      expect(screen.getByTestId('crew-zone')).toBeInTheDocument()
    })
  })

  describe('resource zone (top)', () => {
    it('renders the resource bar', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('resource-bar')).toBeInTheDocument()
    })

    it('displays all 4 resource meters', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('resource-meter-food')).toBeInTheDocument()
      expect(screen.getByTestId('resource-meter-fuel')).toBeInTheDocument()
      expect(screen.getByTestId('resource-meter-water')).toBeInTheDocument()
      expect(screen.getByTestId('resource-meter-money')).toBeInTheDocument()
    })

    it('displays food resource with starting value', () => {
      render(<DashboardScreen />)
      const foodMeter = screen.getByTestId('resource-meter-food')
      expect(foodMeter).toHaveTextContent(`${STARTING_RESOURCES.food}/${MAX_RESOURCES.food}`)
    })

    it('displays fuel resource with starting value', () => {
      render(<DashboardScreen />)
      const fuelMeter = screen.getByTestId('resource-meter-fuel')
      expect(fuelMeter).toHaveTextContent(`${STARTING_RESOURCES.fuel}/${MAX_RESOURCES.fuel}`)
    })

    it('displays turn counter', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('turn-counter')).toBeInTheDocument()
      expect(screen.getByTestId('turn-number')).toHaveTextContent('1')
    })

    it('renders food emoji', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('img', { name: 'Food' })).toBeInTheDocument()
    })

    it('renders fuel emoji', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('img', { name: 'Fuel' })).toBeInTheDocument()
    })

    it('renders water emoji', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('img', { name: 'Water' })).toBeInTheDocument()
    })

    it('renders money emoji', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('img', { name: 'Money' })).toBeInTheDocument()
    })
  })

  describe('journey zone (center)', () => {
    it('displays Journey Progress header', () => {
      render(<DashboardScreen />)
      expect(screen.getByText(/Journey Progress/i)).toBeInTheDocument()
    })

    it('renders the journey track', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('journey-track')).toBeInTheDocument()
    })

    it('renders all 10 countries', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('country-marker-france')).toBeInTheDocument()
      expect(screen.getByTestId('country-marker-usa')).toBeInTheDocument()
    })

    it('marks first country as current', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('country-marker-france')).toHaveAttribute('data-status', 'current')
    })

    it('shows train position', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('train-position')).toBeInTheDocument()
      expect(screen.getByTestId('train-position')).toHaveTextContent('🚄')
    })
  })

  describe('crew zone (bottom)', () => {
    it('renders crew panel', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('crew-panel')).toBeInTheDocument()
    })

    it('renders all 4 crew members', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('crew-member-tom')).toBeInTheDocument()
      expect(screen.getByTestId('crew-member-maria')).toBeInTheDocument()
      expect(screen.getByTestId('crew-member-jack')).toBeInTheDocument()
      expect(screen.getByTestId('crew-member-sam')).toBeInTheDocument()
    })

    it('renders GO button', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('button', { name: /GO/i })).toBeInTheDocument()
    })

    it('renders GO button with glow effect', () => {
      render(<DashboardScreen />)
      const button = screen.getByRole('button', { name: /GO/i })
      expect(button).toHaveAttribute('data-glow', 'true')
    })

    it('renders GO button with large size', () => {
      render(<DashboardScreen />)
      const button = screen.getByRole('button', { name: /GO/i })
      expect(button).toHaveAttribute('data-size', 'large')
    })

    it('renders dice emoji in GO button', () => {
      render(<DashboardScreen />)
      const diceEmojis = screen.getAllByRole('img', { name: 'Dice' })
      expect(diceEmojis.length).toBeGreaterThan(0)
    })
  })

  describe('turn execution', () => {
    it('renders GoButton component', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('go-button')).toBeInTheDocument()
    })

    it('executes turn when GO button is clicked', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)

      // Turn should be executed, incrementing turn count
      expect(useGameStore.getState().turnCount).toBe(2)
    })

    it('shows turn result after clicking GO', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)

      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('dismisses turn result when continue is clicked', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()

      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      expect(screen.queryByTestId('turn-result-display')).not.toBeInTheDocument()
    })

    it('updates resources after turn', () => {
      render(<DashboardScreen />)

      const initialResources = { ...useGameStore.getState().resources }
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)

      const newResources = useGameStore.getState().resources
      // Resources should change after a turn (fuel at minimum is consumed)
      const resourcesChanged =
        newResources.food !== initialResources.food ||
        newResources.fuel !== initialResources.fuel ||
        newResources.water !== initialResources.water ||
        newResources.money !== initialResources.money

      expect(resourcesChanged).toBe(true)
    })

    it('clears lastTurnResult when dismissed', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)
      expect(useGameStore.getState().lastTurnResult).not.toBeNull()

      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      expect(useGameStore.getState().lastTurnResult).toBeNull()
    })
  })

  describe('accessibility', () => {
    it('has a focusable GO button', () => {
      render(<DashboardScreen />)
      const button = screen.getByRole('button', { name: /GO/i })
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })

  describe('selection display', () => {
    it('displays selected captain name', () => {
      render(<DashboardScreen />)
      expect(screen.getByText(/Captain:.*Renji/)).toBeInTheDocument()
    })

    it('displays selected train name', () => {
      render(<DashboardScreen />)
      expect(screen.getByText(/Train:.*Blitzzug/)).toBeInTheDocument()
    })

    it('displays captain portrait emoji', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('img', { name: 'Captain portrait' })).toHaveTextContent('🧑‍✈️')
    })

    it('displays train sprite emoji', () => {
      render(<DashboardScreen />)
      expect(screen.getByRole('img', { name: 'Train sprite' })).toHaveTextContent('🚄')
    })

    it('displays fallback text when no captain is selected', () => {
      act(() => {
        useGameStore.setState({ selectedCaptain: null })
      })
      render(<DashboardScreen />)
      expect(screen.getByText(/Captain:.*None/)).toBeInTheDocument()
    })

    it('displays fallback text when no train is selected', () => {
      act(() => {
        useGameStore.setState({ selectedTrain: null })
      })
      render(<DashboardScreen />)
      expect(screen.getByText(/Train:.*None/)).toBeInTheDocument()
    })

    it('renders selection info section', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('selection-info')).toBeInTheDocument()
    })
  })
})
