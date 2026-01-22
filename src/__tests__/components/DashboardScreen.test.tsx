import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { act } from 'react'
import { DashboardScreen } from '../../components/screens/DashboardScreen'
import { useGameStore } from '../../stores/gameStore'
import { STARTING_RESOURCES, MAX_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import { captains } from '../../data/captains'
import { trains } from '../../data/trains'
import type { Captain, Train, CargoItem, CargoDiscovery } from '../../types'
import type { TurnResult } from '../../logic/turn'
import type { GameEvent } from '../../data/events'
import type { BonusCard } from '../../data/cards'

// Mock events module to prevent random event triggering during tests
import * as eventsModule from '../../logic/events'

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

// Mock mini-game components to enable controlled testing
// Each mock renders buttons for complete and skip actions
vi.mock('../../components/minigames/CatcherGame', () => ({
  CatcherGame: ({ onComplete, onSkip }: { onComplete: (score: number, maxScore: number) => void; onSkip: () => void }) => (
    <div>
      <button data-testid="mock-catcher-complete" onClick={() => onComplete(10, 10)}>
        Complete Catcher Game
      </button>
      <button onClick={onSkip}>Skip</button>
    </div>
  ),
}))

vi.mock('../../components/minigames/TimingGame', () => ({
  TimingGame: ({ onComplete, onSkip }: { onComplete: (score: number, maxScore: number) => void; onSkip: () => void }) => (
    <div>
      <button data-testid="mock-timing-complete" onClick={() => onComplete(10, 10)}>
        Complete Timing Game
      </button>
      <button onClick={onSkip}>Skip</button>
    </div>
  ),
}))

vi.mock('../../components/minigames/MemoryGame', () => ({
  MemoryGame: ({ onComplete, onSkip }: { onComplete: (score: number, maxScore: number) => void; onSkip: () => void }) => (
    <div>
      <button data-testid="mock-memory-complete" onClick={() => onComplete(10, 10)}>
        Complete Memory Game
      </button>
      <button onClick={onSkip}>Skip</button>
    </div>
  ),
}))

// Mock QuizModal component to enable controlled testing
vi.mock('../../components/game/QuizModal', () => ({
  QuizModal: ({ onComplete, onSkip }: { onComplete: (correctCount: number) => void; onSkip: () => void }) => (
    <div data-testid="quiz-modal">
      <button data-testid="mock-quiz-complete" onClick={() => onComplete(3)}>
        Complete Quiz
      </button>
      <button data-testid="mock-quiz-skip" onClick={onSkip}>Skip Quiz</button>
    </div>
  ),
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
        currentEvent: null,
        cardHand: [],
        selectedCards: [],
        ownedCarts: [],
        carriedCargo: [],
        pendingCargoOpen: null,
        currentMiniGame: null,
        lastMiniGameResult: null,
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
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('renders GoButton component', () => {
      render(<DashboardScreen />)
      expect(screen.getByTestId('go-button')).toBeInTheDocument()
    })

    it('shows dice rolling animation when GO is clicked', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)

      // Dice overlay should be visible during animation
      expect(screen.getByTestId('turn-dice-overlay')).toBeInTheDocument()
      expect(screen.getByTestId('turn-dice-box')).toBeInTheDocument()
      expect(screen.getByText('Rolling...')).toBeInTheDocument()
    })

    it('executes turn when GO button is clicked', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)

      // Wait for dice animation to complete
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      // Turn should be executed, incrementing turn count
      expect(useGameStore.getState().turnCount).toBe(2)
    })

    it('shows turn result after clicking GO', () => {
      render(<DashboardScreen />)
      const goButton = screen.getByRole('button', { name: /GO/i })

      fireEvent.click(goButton)

      // Wait for dice animation to complete
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      // If cargo discovery modal shows, dismiss it first
      if (screen.queryByTestId('cargo-discovery-modal')) {
        fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      }

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

      // Wait for dice animation to complete
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      // If cargo discovery modal shows, dismiss it first
      if (screen.queryByTestId('cargo-discovery-modal')) {
        fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      }

      // If we arrived at a station, dismiss the station modal first
      if (screen.queryByTestId('station-modal')) {
        fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      }

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

      // Wait for dice animation to complete
      act(() => {
        vi.advanceTimersByTime(1100)
      })

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

      // Wait for dice animation to complete
      act(() => {
        vi.advanceTimersByTime(1100)
      })

      expect(useGameStore.getState().lastTurnResult).not.toBeNull()

      // If cargo discovery modal shows, dismiss it first
      if (screen.queryByTestId('cargo-discovery-modal')) {
        fireEvent.click(screen.getByRole('button', { name: /continue/i }))
      }

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

  describe('stats display in header', () => {
    it('displays captain stats in header when captain is selected', () => {
      // Select a captain with known stats
      const renji = captains[0] // Renji has engineering: 5, food: 2, security: 3
      act(() => {
        useGameStore.setState({ selectedCaptain: renji })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('captain-stats')).toBeInTheDocument()
    })

    it('displays train stats in header when train is selected', () => {
      // Select a train with known stats
      const blitzzug = trains[0] // Blitzzug has speed: 3, reliability: 5, power: 3
      act(() => {
        useGameStore.setState({ selectedTrain: blitzzug })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('train-stats')).toBeInTheDocument()
    })

    it('does not display captain stats when no captain is selected', () => {
      act(() => {
        useGameStore.setState({ selectedCaptain: null })
      })
      render(<DashboardScreen />)

      expect(screen.queryByTestId('captain-stats')).not.toBeInTheDocument()
    })

    it('does not display train stats when no train is selected', () => {
      act(() => {
        useGameStore.setState({ selectedTrain: null })
      })
      render(<DashboardScreen />)

      expect(screen.queryByTestId('train-stats')).not.toBeInTheDocument()
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
          currentMiniGame: null,
          lastMiniGameResult: null,
        })
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    // Helper to advance timers past dice rolling animation
    const advanceDiceRollingAnimation = () => {
      act(() => {
        vi.advanceTimersByTime(1100) // 1000ms animation + buffer
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

    it('applies penalty to resources when event fails', () => {
      // Mock resolveEvent to return a failure with penalty
      vi.mocked(eventsModule.resolveEvent).mockReturnValue({
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      })

      // Set up a crew with NO security to get full penalty
      const crewWithNoSecurity = [
        { id: 'crew-1', name: 'Crew 1', role: 'engineer' as const, avatar: '👷' },
        { id: 'crew-2', name: 'Crew 2', role: 'cook' as const, avatar: '👨‍🍳' },
        { id: 'crew-3', name: 'Crew 3', role: 'engineer' as const, avatar: '🔧' },
        { id: 'crew-4', name: 'Crew 4', role: 'free' as const, avatar: '😊' },
      ]

      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
          selectedCards: [],
          resources: { food: 50, fuel: 100, water: 50, money: 200 },
          crew: crewWithNoSecurity,
        })
      })
      render(<DashboardScreen />)

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      advanceDiceRollingAnimation()
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Fuel should be reduced by penalty amount (20)
      const state = useGameStore.getState()
      expect(state.resources.fuel).toBe(80)
    })

    it('does not apply penalty when event succeeds', () => {
      // Mock resolveEvent to return success (no penalty)
      vi.mocked(eventsModule.resolveEvent).mockReturnValue({
        success: true,
        total: 15,
      })

      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithEvent,
          currentEvent: mockEvent,
          cardHand: mockCards,
          selectedCards: [],
          resources: { food: 50, fuel: 100, water: 50, money: 200 },
        })
      })
      render(<DashboardScreen />)

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      advanceDiceRollingAnimation()
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Resources should not be changed
      const state = useGameStore.getState()
      expect(state.resources.fuel).toBe(100)
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
          currentMiniGame: null,
          lastMiniGameResult: null,
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

  describe('cargo discovery integration', () => {
    const mockCargoItem: CargoItem = {
      id: 'test-cargo',
      name: 'Test Cargo',
      icon: '📦',
      rarity: 'common',
      rewardType: 'money',
      rewardAmount: 50,
      description: 'A test cargo item',
    }

    const mockTurnResultWithCargo: TurnResult = {
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
      cargoDiscovered: mockCargoItem,
    }

    const mockTurnResultNoCargo: TurnResult = {
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
          currentEvent: null,
          cardHand: [],
          selectedCards: [],
          carriedCargo: [],
          pendingCargoOpen: null,
          currentMiniGame: null,
          lastMiniGameResult: null,
        })
      })
    })

    it('shows CargoDiscoveryModal when turn result has cargoDiscovered', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithCargo,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('cargo-discovery-modal')).toBeInTheDocument()
      expect(screen.getByText('Test Cargo')).toBeInTheDocument()
    })

    it('does NOT show CargoDiscoveryModal when no cargo discovered', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultNoCargo,
        })
      })
      render(<DashboardScreen />)

      expect(screen.queryByTestId('cargo-discovery-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('adds cargo to inventory when discovery modal is dismissed', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithCargo,
        })
      })
      render(<DashboardScreen />)

      // Verify modal is shown
      expect(screen.getByTestId('cargo-discovery-modal')).toBeInTheDocument()

      // Click Continue to dismiss
      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      // Cargo should be added to inventory
      const carriedCargo = useGameStore.getState().carriedCargo
      expect(carriedCargo).toHaveLength(1)
      expect(carriedCargo[0].item.id).toBe('test-cargo')
    })

    it('shows turn result after cargo discovery modal is dismissed', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithCargo,
        })
      })
      render(<DashboardScreen />)

      // Dismiss cargo discovery modal
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Turn result should now be visible
      expect(screen.queryByTestId('cargo-discovery-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('does not show cargo discovery modal if event is active', () => {
      const mockEvent: GameEvent = {
        id: 'test-event',
        name: 'Test Event',
        description: 'A test event',
        statTested: 'engineering',
        difficulty: 10,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const turnResultWithCargoAndEvent: TurnResult = {
        ...mockTurnResultWithCargo,
        eventTriggered: true,
        event: mockEvent,
      }

      act(() => {
        useGameStore.setState({
          lastTurnResult: turnResultWithCargoAndEvent,
          currentEvent: mockEvent,
        })
      })
      render(<DashboardScreen />)

      // Event modal should be shown, not cargo discovery
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
      expect(screen.queryByTestId('cargo-discovery-modal')).not.toBeInTheDocument()
    })
  })

  describe('cargo opening at station', () => {
    const mockCargoItem: CargoItem = {
      id: 'test-cargo',
      name: 'Test Cargo',
      icon: '📦',
      rarity: 'common',
      rewardType: 'money',
      rewardAmount: 50,
      description: 'A test cargo item',
    }

    const mockCargoDiscovery: CargoDiscovery = {
      item: mockCargoItem,
      foundAtCountry: 'france',
      turnFound: 1,
    }

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
          currentEvent: null,
          cardHand: [],
          selectedCards: [],
          carriedCargo: [],
          pendingCargoOpen: null,
          currentMiniGame: null,
          lastMiniGameResult: null,
        })
      })
    })

    it('shows CargoOpenModal at station when player has cargo', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          carriedCargo: [mockCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      // Cargo open modal should be shown before station modal
      expect(screen.getByTestId('cargo-open-modal')).toBeInTheDocument()
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })

    it('shows cargo reward when opening cargo', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          carriedCargo: [mockCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      // Check for reward display
      expect(screen.getByTestId('cargo-open-modal')).toBeInTheDocument()
      expect(screen.getByTestId('cargo-reward-amount')).toBeInTheDocument()
    })

    it('shows station modal after all cargo is opened', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          carriedCargo: [mockCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      // Cargo open modal should be visible
      expect(screen.getByTestId('cargo-open-modal')).toBeInTheDocument()

      // Click Collect to dismiss cargo modal
      const collectButton = screen.getByRole('button', { name: /collect/i })
      fireEvent.click(collectButton)

      // Now station modal should be visible
      expect(screen.queryByTestId('cargo-open-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('removes cargo from inventory after opening', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          carriedCargo: [mockCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      // Cargo should already be moved to pendingCargoOpen (removed from carriedCargo)
      // since the useEffect fires on mount
      expect(useGameStore.getState().carriedCargo).toHaveLength(0)
      expect(useGameStore.getState().pendingCargoOpen).not.toBeNull()

      // Click Collect to dismiss cargo modal
      fireEvent.click(screen.getByRole('button', { name: /collect/i }))

      // pendingCargoOpen should be cleared
      expect(useGameStore.getState().pendingCargoOpen).toBeNull()
      // Cargo should remain at 0 (fully processed)
      expect(useGameStore.getState().carriedCargo).toHaveLength(0)
    })

    it('opens multiple cargo items sequentially', () => {
      const secondCargoItem: CargoItem = {
        id: 'test-cargo-2',
        name: 'Second Cargo',
        icon: '🎁',
        rarity: 'rare',
        rewardType: 'fuel',
        rewardAmount: 30,
        description: 'A second cargo item',
      }
      const secondCargoDiscovery: CargoDiscovery = {
        item: secondCargoItem,
        foundAtCountry: 'france',
        turnFound: 1,
      }

      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          carriedCargo: [mockCargoDiscovery, secondCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      // First cargo modal should be shown
      expect(screen.getByTestId('cargo-open-modal')).toBeInTheDocument()
      expect(screen.getByText('Test Cargo')).toBeInTheDocument()

      // Collect first cargo
      fireEvent.click(screen.getByRole('button', { name: /collect/i }))

      // Second cargo modal should be shown
      expect(screen.getByTestId('cargo-open-modal')).toBeInTheDocument()
      expect(screen.getByText('Second Cargo')).toBeInTheDocument()

      // Collect second cargo
      fireEvent.click(screen.getByRole('button', { name: /collect/i }))

      // Now station modal should be visible
      expect(screen.queryByTestId('cargo-open-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })
  })

  describe('cargo inventory display', () => {
    const mockCargoItem: CargoItem = {
      id: 'test-cargo',
      name: 'Test Cargo',
      icon: '📦',
      rarity: 'common',
      rewardType: 'money',
      rewardAmount: 50,
      description: 'A test cargo item',
    }

    const mockCargoDiscovery: CargoDiscovery = {
      item: mockCargoItem,
      foundAtCountry: 'france',
      turnFound: 1,
    }

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
          currentEvent: null,
          cardHand: [],
          selectedCards: [],
          carriedCargo: [],
          pendingCargoOpen: null,
          currentMiniGame: null,
          lastMiniGameResult: null,
        })
      })
    })

    it('does not show CargoInventory when no cargo', () => {
      render(<DashboardScreen />)

      expect(screen.queryByTestId('cargo-inventory')).not.toBeInTheDocument()
    })

    it('shows CargoInventory when player has cargo', () => {
      act(() => {
        useGameStore.setState({
          carriedCargo: [mockCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('cargo-inventory')).toBeInTheDocument()
    })

    it('displays correct number of cargo items', () => {
      const secondCargoDiscovery: CargoDiscovery = {
        item: {
          id: 'test-cargo-2',
          name: 'Second Cargo',
          icon: '🎁',
          rarity: 'rare',
          rewardType: 'fuel',
          rewardAmount: 30,
          description: 'A second cargo item',
        },
        foundAtCountry: 'france',
        turnFound: 2,
      }

      act(() => {
        useGameStore.setState({
          carriedCargo: [mockCargoDiscovery, secondCargoDiscovery],
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('cargo-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('cargo-item-1')).toBeInTheDocument()
    })
  })

  describe('mini-game flow', () => {
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
      vi.useFakeTimers()
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
          currentEvent: null,
          cardHand: [],
          selectedCards: [],
          carriedCargo: [],
          pendingCargoOpen: null,
          currentMiniGame: null,
          lastMiniGameResult: null,
        })
      })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('shows Play Mini-Game button in station modal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /play mini-game/i })).toBeInTheDocument()
    })

    it('clicking Play Mini-Game from station shows MiniGameModal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Click Play Mini-Game button
      fireEvent.click(screen.getByRole('button', { name: /play mini-game/i }))

      // MiniGameModal should be visible
      expect(screen.getByTestId('minigame-modal-overlay')).toBeInTheDocument()
      // Station modal should be hidden
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })

    it('starts mini-game with correct country mini-game', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Click Play Mini-Game button
      fireEvent.click(screen.getByRole('button', { name: /play mini-game/i }))

      // Verify mini-game state is set (Germany = Beer Stein Balance)
      const state = useGameStore.getState()
      expect(state.currentMiniGame).not.toBeNull()
      expect(state.currentMiniGame?.countryId).toBe('germany')
    })

    it('skipping mini-game returns to station modal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Open mini-game
      fireEvent.click(screen.getByRole('button', { name: /play mini-game/i }))
      expect(screen.getByTestId('minigame-modal-overlay')).toBeInTheDocument()

      // Click Skip button
      fireEvent.click(screen.getByRole('button', { name: /skip/i }))

      // Should return to station modal
      expect(screen.queryByTestId('minigame-modal-overlay')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('completing mini-game applies reward and shows station modal for shop access', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany - timing game with money reward
          currentEvent: null,
          resources: { food: 50, fuel: 50, water: 100, money: 100 },
        })
      })
      render(<DashboardScreen />)

      // Start mini-game
      fireEvent.click(screen.getByRole('button', { name: /play mini-game/i }))

      // Complete the game using the mock button (triggers MiniGameModal's handleGameComplete)
      fireEvent.click(screen.getByTestId('mock-timing-complete'))

      // Click "Collect Reward" to finalize (triggers DashboardScreen's handleMiniGameComplete)
      fireEvent.click(screen.getByRole('button', { name: /collect reward/i }))

      // Mini-game modal should be gone
      expect(screen.queryByTestId('minigame-modal-overlay')).not.toBeInTheDocument()
      // Station modal should be visible (so player can access shop)
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      // Visit Shop button should be available
      expect(screen.getByRole('button', { name: /visit shop/i })).toBeInTheDocument()
      // Money should have increased (Germany gives money reward)
      expect(useGameStore.getState().resources.money).toBeGreaterThan(100)
    })

    it('shows turn result after dismissing station modal post mini-game', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany - timing game
          currentEvent: null,
          resources: { food: 50, fuel: 50, water: 100, money: 100 },
        })
      })
      render(<DashboardScreen />)

      // Start mini-game
      fireEvent.click(screen.getByRole('button', { name: /play mini-game/i }))

      // Complete the game using the mock button
      fireEvent.click(screen.getByTestId('mock-timing-complete'))

      // Click "Collect Reward" to finalize
      fireEvent.click(screen.getByRole('button', { name: /collect reward/i }))

      // Station modal should be visible
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()

      // Dismiss station modal by clicking Continue
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Now turn result should be visible
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('does not show turn result when mini-game is active', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Start mini-game
      fireEvent.click(screen.getByRole('button', { name: /play mini-game/i }))

      // Turn result should NOT be visible while mini-game is active
      expect(screen.queryByTestId('turn-result-display')).not.toBeInTheDocument()
    })
  })

  describe('quiz flow', () => {
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
          resources: { food: 50, fuel: 50, water: 100, money: 100 },
          crew: [...startingCrew],
          currentCountryIndex: 1,
          progressInCountry: 0,
          turnCount: 2,
          lastTurnResult: null,
          gameOverReason: null,
          currentEvent: null,
          cardHand: [],
          selectedCards: [],
          carriedCargo: [],
          pendingCargoOpen: null,
          currentMiniGame: null,
          lastMiniGameResult: null,
          currentQuiz: null,
          lastQuizResult: null,
        })
      })
    })

    it('shows Take Quiz button in station modal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /take quiz/i })).toBeInTheDocument()
    })

    it('clicking Take Quiz from station shows QuizModal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Click Take Quiz button
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // QuizModal should be visible
      expect(screen.getByTestId('quiz-modal')).toBeInTheDocument()
      // Station modal should be hidden
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })

    it('starts quiz with correct country quiz', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Click Take Quiz button
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // Verify quiz state is set (Germany quiz)
      const state = useGameStore.getState()
      expect(state.currentQuiz).not.toBeNull()
      expect(state.currentQuiz?.countryId).toBe('germany')
    })

    it('skipping quiz returns to station modal', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Open quiz
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))
      expect(screen.getByTestId('quiz-modal')).toBeInTheDocument()

      // Click Skip button
      fireEvent.click(screen.getByTestId('mock-quiz-skip'))

      // Should return to station modal
      expect(screen.queryByTestId('quiz-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('completing quiz applies reward and shows station modal for shop access', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany
          currentEvent: null,
          resources: { food: 50, fuel: 50, water: 100, money: 100 },
        })
      })
      render(<DashboardScreen />)

      // Start quiz
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // Complete the quiz using the mock button (3 correct answers = 30 money reward)
      fireEvent.click(screen.getByTestId('mock-quiz-complete'))

      // Quiz modal should be gone
      expect(screen.queryByTestId('quiz-modal')).not.toBeInTheDocument()
      // Station modal should be visible (so player can access shop)
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      // Visit Shop button should be available
      expect(screen.getByRole('button', { name: /visit shop/i })).toBeInTheDocument()
      // Money should have increased (3 correct = 30 money)
      expect(useGameStore.getState().resources.money).toBeGreaterThan(100)
    })

    it('shows turn result after dismissing station modal post quiz', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1, // Germany
          currentEvent: null,
          resources: { food: 50, fuel: 50, water: 100, money: 100 },
        })
      })
      render(<DashboardScreen />)

      // Start quiz
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // Complete the quiz
      fireEvent.click(screen.getByTestId('mock-quiz-complete'))

      // Station modal should be visible
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()

      // Dismiss station modal by clicking Continue
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Now turn result should be visible
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('does not show turn result when quiz is active', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Start quiz
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // Turn result should NOT be visible while quiz is active
      expect(screen.queryByTestId('turn-result-display')).not.toBeInTheDocument()
    })

    it('does not show station modal when quiz is active', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Start quiz
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // Station modal should NOT be visible while quiz is active
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })

    it('clears quiz state when skipped', () => {
      act(() => {
        useGameStore.setState({
          lastTurnResult: mockTurnResultWithStation,
          currentCountryIndex: 1,
          currentEvent: null,
        })
      })
      render(<DashboardScreen />)

      // Start quiz
      fireEvent.click(screen.getByRole('button', { name: /take quiz/i }))

      // Verify quiz is started
      expect(useGameStore.getState().currentQuiz).not.toBeNull()

      // Skip quiz
      fireEvent.click(screen.getByTestId('mock-quiz-skip'))

      // Quiz state should be cleared
      expect(useGameStore.getState().currentQuiz).toBeNull()
    })
  })
})
