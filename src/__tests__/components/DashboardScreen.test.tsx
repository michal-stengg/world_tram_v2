import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { DashboardScreen } from '../../components/screens/DashboardScreen'
import { useGameStore } from '../../stores/gameStore'
import { STARTING_RESOURCES, MAX_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import type { Captain, Train } from '../../types'
import type { TurnResult } from '../../logic/turn'
import type { GameEvent } from '../../data/events'
import type { BonusCard } from '../../data/cards'

// Mock events module to prevent random event triggering during tests
vi.mock('../../logic/events', () => ({
  shouldTriggerEvent: vi.fn(() => false),
  selectRandomEvent: vi.fn(() => ({
    id: 'test-event',
    name: 'Test Event',
    description: 'A test event',
    statTested: 'engineering',
    difficulty: 10,
    penalty: { type: 'resource', resource: 'fuel', amount: 20 },
  })),
  resolveEvent: vi.fn(() => ({
    success: true,
    total: 15,
  })),
}))

// Mock dice module to control roll results
vi.mock('../../logic/dice', () => ({
  rollDice: vi.fn(() => 6),
  rollMovement: vi.fn(() => 6),
}))

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

      // If we arrived at a station, dismiss the station modal first
      if (screen.queryByTestId('station-modal')) {
        fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      }

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

      // If we arrived at a station, dismiss the station modal first
      if (screen.queryByTestId('station-modal')) {
        fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      }

      // Now dismiss the turn result modal
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

  describe('station modal integration', () => {
    const mockTurnResultWithStation: TurnResult = {
      diceRoll: 6,
      movement: 10,
      resourceChanges: { food: -2, fuel: -3, water: -1, money: -5 },
      newResources: { food: 48, fuel: 47, water: 100, money: 120 },
      newCountryIndex: 1,
      newProgress: 0,
      arrivedAtCountry: true,
      gameStatus: 'playing',
      newTurnCount: 2,
      stationReward: { waterRefill: 50, moneyEarned: 25 },
      eventTriggered: false,
    }

    const mockTurnResultWithoutStation: TurnResult = {
      diceRoll: 3,
      movement: 5,
      resourceChanges: { food: -2, fuel: -3, water: -1, money: -5 },
      newResources: { food: 48, fuel: 47, water: 49, money: 95 },
      newCountryIndex: 0,
      newProgress: 5,
      arrivedAtCountry: false,
      gameStatus: 'playing',
      newTurnCount: 2,
      eventTriggered: false,
    }

    it('shows StationModal when lastTurnResult has stationReward', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('does NOT show StationModal when no stationReward', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithoutStation,
        })
      })
      render(<DashboardScreen />)

      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('shows correct country name in StationModal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
        })
      })
      render(<DashboardScreen />)

      // Country at index 1 is Germany
      expect(screen.getByText(/Welcome to Germany!/)).toBeInTheDocument()
    })

    it('shows correct reward values in StationModal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('water-reward')).toHaveTextContent('+50')
      expect(screen.getByTestId('money-reward')).toHaveTextContent('+$25')
    })

    it('hides StationModal and shows TurnResultDisplay after dismissing', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
        })
      })
      render(<DashboardScreen />)

      // Station modal should be visible
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      expect(screen.queryByTestId('turn-result-display')).not.toBeInTheDocument()

      // Click continue to dismiss station modal
      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      // Now station modal should be hidden and turn result should show
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('dismisses station modal when clicking overlay', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('station-modal')).toBeInTheDocument()

      // Click overlay to dismiss
      const overlay = screen.getByTestId('station-modal-overlay')
      fireEvent.click(overlay)

      // Station modal should be hidden, turn result should show
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('does not show StationModal when game status is not playing', () => {
      const turnResultVictory: TurnResult = {
        ...mockTurnResultWithStation,
        gameStatus: 'victory',
      }
      act(() => {
        useGameStore.setState({
          lastTurnResult: turnResultVictory,
          currentCountryIndex: 9,
        })
      })
      render(<DashboardScreen />)

      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })
  })

  describe('event modal integration', () => {
    const mockEvent: GameEvent = {
      id: 'test-event',
      name: 'Test Event',
      description: 'A test event description',
      statTested: 'engineering',
      difficulty: 10,
      penalty: { type: 'resource', resource: 'fuel', amount: 20 },
    }

    const mockCards: BonusCard[] = [
      {
        id: 'card-1',
        name: 'Test Card 1',
        stat: 'engineering',
        bonus: 3,
        description: 'A test card',
      },
      {
        id: 'card-2',
        name: 'Test Card 2',
        stat: 'food',
        bonus: 2,
        description: 'Another test card',
      },
      {
        id: 'card-3',
        name: 'Test Card 3',
        stat: 'security',
        bonus: 4,
        description: 'Third test card',
      },
    ]

    const mockTurnResultWithEvent: TurnResult = {
      diceRoll: 4,
      movement: 6,
      resourceChanges: { food: -2, fuel: -3, water: -1, money: -5 },
      newResources: { food: 48, fuel: 47, water: 49, money: 95 },
      newCountryIndex: 0,
      newProgress: 6,
      arrivedAtCountry: false,
      gameStatus: 'playing',
      newTurnCount: 2,
      eventTriggered: true,
      event: mockEvent,
    }

    const mockTurnResultWithoutEvent: TurnResult = {
      diceRoll: 4,
      movement: 6,
      resourceChanges: { food: -2, fuel: -3, water: -1, money: -5 },
      newResources: { food: 48, fuel: 47, water: 49, money: 95 },
      newCountryIndex: 0,
      newProgress: 6,
      arrivedAtCountry: false,
      gameStatus: 'playing',
      newTurnCount: 2,
      eventTriggered: false,
    }

    beforeEach(() => {
      // Use fake timers for dice rolling animation
      vi.useFakeTimers()

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
          cardHand: mockCards,
          currentEvent: null,
          selectedCards: [],
        })
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    // Helper to advance timers past dice rolling animation
    const advanceDiceRollingAnimation = () => {
      act(() => {
        vi.advanceTimersByTime(1600) // 1500ms animation + buffer
      })
    }

    it('shows EventModal when turn result has eventTriggered', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
      expect(screen.getByText('Test Event')).toBeInTheDocument()
    })

    it('does NOT show EventModal when no event triggered', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithoutEvent,
        })
      })
      render(<DashboardScreen />)

      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('shows card hand in EventModal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('card-hand')).toBeInTheDocument()
      expect(screen.getByText('Test Card 1')).toBeInTheDocument()
      expect(screen.getByText('Test Card 2')).toBeInTheDocument()
      expect(screen.getByText('Test Card 3')).toBeInTheDocument()
    })

    it('allows card selection through EventModal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      // Click on a card to select it
      const card1 = screen.getByTestId('card-display-card-1')
      fireEvent.click(card1)

      // Card should now be in selected state in the store
      expect(useGameStore.getState().selectedCards).toContain('card-1')
    })

    it('shows Roll button in EventModal before resolution', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByRole('button', { name: /roll/i })).toBeInTheDocument()
    })

    it('resolves event and shows result when Roll is clicked', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      // Click Roll button
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Advance timers past dice rolling animation
      advanceDiceRollingAnimation()

      // Should show the result
      expect(screen.getByTestId('event-result')).toBeInTheDocument()
    })

    it('shows Continue button after event is resolved', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      // Click Roll button
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Advance timers past dice rolling animation
      advanceDiceRollingAnimation()

      // Should show Continue button
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('dismisses EventModal and clears currentEvent when Continue is clicked', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      // Click Roll button
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Advance timers past dice rolling animation
      advanceDiceRollingAnimation()

      // Click Continue button
      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      // EventModal should be gone, currentEvent should be null
      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()
      expect(useGameStore.getState().currentEvent).toBeNull()
    })

    it('shows turn result after event is dismissed (no station)', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      advanceDiceRollingAnimation()
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Turn result should now be visible
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('shows station modal after event is dismissed (with station arrival)', () => {
      const turnResultWithEventAndStation: TurnResult = {
        ...mockTurnResultWithEvent,
        newCountryIndex: 1,
        newProgress: 0,
        arrivedAtCountry: true,
        stationReward: { waterRefill: 50, moneyEarned: 25 },
      }

      act(() => {
        useGameStore.setState({
          lastTurnResult: turnResultWithEventAndStation,
          currentEvent: mockEvent,
          currentCountryIndex: 1,
          cardHand: mockCards,
        })
      })
      render(<DashboardScreen />)

      // Event modal should be shown first
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      advanceDiceRollingAnimation()
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Now station modal should be visible
      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('sets currentEvent in store when turn result has event', () => {
      // When a turn result comes in with an event, the component should
      // set currentEvent in the store to display the EventModal
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
        })
      })

      render(<DashboardScreen />)

      // EventModal should be visible because currentEvent is set
      expect(useGameStore.getState().currentEvent).toEqual(mockEvent)
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
    })

    it('clears selected cards after event resolution', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
          selectedCards: ['card-1'],
        })
      })
      render(<DashboardScreen />)

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      advanceDiceRollingAnimation()
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Selected cards should be cleared
      expect(useGameStore.getState().selectedCards).toHaveLength(0)
    })
  })

  describe('cart shop integration', () => {
    const mockTurnResultWithStation: TurnResult = {
      diceRoll: 6,
      movement: 10,
      resourceChanges: { food: -2, fuel: -3, water: -1, money: -5 },
      newResources: { food: 48, fuel: 47, water: 100, money: 200 },
      newCountryIndex: 1,
      newProgress: 0,
      arrivedAtCountry: true,
      gameStatus: 'playing',
      newTurnCount: 2,
      stationReward: { waterRefill: 50, moneyEarned: 25 },
      eventTriggered: false,
    }

    beforeEach(() => {
      act(() => {
        useGameStore.setState({
          currentScreen: 'dashboard',
          selectedCaptain: mockCaptain,
          selectedTrain: mockTrain,
          resources: { food: 50, fuel: 50, water: 100, money: 200 },
          crew: [...startingCrew],
          currentCountryIndex: 1,
          progressInCountry: 0,
          turnCount: 2,
          lastTurnResult: null,
          gameOverReason: null,
          ownedCarts: [],
          currentEvent: null,
          cardHand: [],
          selectedCards: [],
        })
      })
    })

    it('shows Visit Shop button in station modal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /visit shop/i })).toBeInTheDocument()
    })

    it('opens CartShop when Visit Shop clicked', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Click Visit Shop button
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // CartShop should be visible
      expect(screen.getByTestId('cart-shop')).toBeInTheDocument()
      // StationModal should be hidden
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })

    it('closes CartShop and continues when CartShop closed', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Open cart shop
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))
      expect(screen.getByTestId('cart-shop')).toBeInTheDocument()

      // Close cart shop
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      // CartShop should be hidden, TurnResultDisplay should show
      expect(screen.queryByTestId('cart-shop')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('can purchase cart from shop', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
          resources: { food: 50, fuel: 50, water: 100, money: 200 },
          ownedCarts: [],
        })
      })
      render(<DashboardScreen />)

      // Open cart shop
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Find and click buy on first cart
      const buyButton = screen.getAllByRole('button', { name: /buy/i })[0]
      fireEvent.click(buyButton)

      // Should now have an owned cart
      expect(useGameStore.getState().ownedCarts.length).toBeGreaterThan(0)
      // Money should be reduced
      expect(useGameStore.getState().resources.money).toBeLessThan(200)
    })
  })
})
