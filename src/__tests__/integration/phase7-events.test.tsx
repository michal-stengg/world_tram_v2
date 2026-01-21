import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../../App'
import { useGameStore } from '../../stores/gameStore'
import { captains } from '../../data/captains'
import { trains } from '../../data/trains'
import { STARTING_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import { events } from '../../data/events'
import type { BonusCard } from '../../data/cards'
import type { GameEvent } from '../../data/events'

// Create unique test cards with different IDs to avoid collision issues
const testCards: BonusCard[] = [
  {
    id: 'test-engineering-card',
    name: 'Test Engineering Card',
    stat: 'engineering',
    bonus: 3,
    description: 'Test card for engineering',
  },
  {
    id: 'test-security-card',
    name: 'Test Security Card',
    stat: 'security',
    bonus: 3,
    description: 'Test card for security',
  },
  {
    id: 'test-food-card',
    name: 'Test Food Card',
    stat: 'food',
    bonus: 3,
    description: 'Test card for food',
  },
]

// Initialize mocks at module level with default values
// These will be reconfigured in beforeEach for each test
const mockConfig = {
  shouldTriggerEvent: false,
  selectedEvent: events.find(e => e.statTested === 'engineering')! as GameEvent,
  diceRoll: 6,
  movement: 5,
  initialHand: testCards,
}

// Mock the events module
vi.mock('../../logic/events', async () => {
  const actual = await vi.importActual<typeof import('../../logic/events')>('../../logic/events')
  return {
    ...actual,
    shouldTriggerEvent: () => mockConfig.shouldTriggerEvent,
    selectRandomEvent: () => mockConfig.selectedEvent,
    resolveEvent: actual.resolveEvent, // Use real resolveEvent logic
  }
})

// Mock the dice module
vi.mock('../../logic/dice', () => ({
  rollMovement: () => mockConfig.movement,
  rollDice: () => mockConfig.diceRoll,
}))

// Track calls to replenishHand for testing
let replenishHandCalls: BonusCard[][] = []

// Mock the cards module for controlled hand drawing
vi.mock('../../logic/cards', async () => {
  const actual = await vi.importActual<typeof import('../../logic/cards')>('../../logic/cards')
  return {
    ...actual,
    drawInitialHand: () => [...mockConfig.initialHand],
    replenishHand: (hand: BonusCard[]) => {
      replenishHandCalls.push([...hand])
      // Fill hand back to 3 cards with test cards
      const newHand = [...hand]
      while (newHand.length < 3) {
        newHand.push(testCards[newHand.length % testCards.length])
      }
      return newHand
    },
  }
})

describe('Phase 7: Events Integration', () => {
  // Engineering event with difficulty 9 for testing
  const engineeringEvent = events.find(e => e.statTested === 'engineering')!
  // Security event with difficulty 10 for testing
  const securityEvent = events.find(e => e.statTested === 'security')!

  beforeEach(() => {
    // Reset mock config to defaults before each test
    mockConfig.shouldTriggerEvent = false // Default: no events
    mockConfig.selectedEvent = engineeringEvent
    mockConfig.diceRoll = 6 // Default dice roll
    mockConfig.movement = 5 // Default movement (less than country distance to avoid station)
    mockConfig.initialHand = [...testCards]

    // Reset replenish hand call tracking
    replenishHandCalls = []

    // Reset store to initial game state
    act(() => {
      useGameStore.setState({
        currentScreen: 'dashboard',
        selectedCaptain: captains[0], // Renji - engineering: 5, food: 2, security: 3
        selectedTrain: trains[0], // Blitzzug
        resources: { ...STARTING_RESOURCES },
        crew: JSON.parse(JSON.stringify(startingCrew)),
        currentCountryIndex: 0,
        progressInCountry: 0,
        turnCount: 1,
        lastTurnResult: null,
        gameOverReason: null,
        cardHand: [...testCards],
        currentEvent: null,
        selectedCards: [],
      })
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('event modal appears when event triggers', () => {
    it('displays event modal when shouldTriggerEvent returns true', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent

      render(<App />)

      // Execute turn
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Event modal should be visible
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
      expect(screen.getByText(engineeringEvent.name)).toBeInTheDocument()
      expect(screen.getByText(engineeringEvent.description)).toBeInTheDocument()
    })

    it('displays event difficulty and stat tested', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      expect(screen.getByTestId('event-stat-tested')).toHaveTextContent('engineering')
      expect(screen.getByTestId('event-difficulty')).toHaveTextContent(String(engineeringEvent.difficulty))
    })

    it('does not show event modal when shouldTriggerEvent returns false', () => {
      mockConfig.shouldTriggerEvent = false

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Event modal should NOT be visible
      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()

      // Turn result display should show (since no station either with movement of 5)
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('shows card hand in event modal for selection', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Card hand should be displayed
      expect(screen.getByTestId('card-hand')).toBeInTheDocument()

      // Should show the Roll button
      expect(screen.getByRole('button', { name: /roll/i })).toBeInTheDocument()
    })
  })

  describe('selecting matching cards increases success chance', () => {
    it('allows selecting cards in the event modal', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Find and click on a card to select it (using card-display- prefix)
      const cardElements = screen.getAllByTestId(/^card-display-/)
      expect(cardElements.length).toBeGreaterThan(0)

      // Click to select the first card
      fireEvent.click(cardElements[0])

      // Verify the card is selected (store state)
      const state = useGameStore.getState()
      expect(state.selectedCards.length).toBe(1)
    })

    it('matching cards contribute to total when rolling', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent // engineering event
      mockConfig.diceRoll = 2 // Low dice roll

      // Use Renji who has engineering: 5
      // Engineering event difficulty: 9
      // Without cards: 2 (dice) + 5 (captain) = 7 < 9 (fail)
      // With engineering card (+3): 2 + 5 + 3 = 10 >= 9 (success)

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Find and select the engineering card (first card in testCards)
      const cardElement = screen.getByTestId('card-display-test-engineering-card')
      fireEvent.click(cardElement)

      // Roll
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Check the result - should succeed with card bonus
      // Total: 2 (dice) + 5 (captain engineering) + 3 (card bonus) = 10
      expect(screen.getByTestId('event-result')).toHaveTextContent('Success!')
    })

    it('non-matching cards do not contribute to total', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent // engineering event
      mockConfig.diceRoll = 2 // Low dice roll

      // Without matching cards: 2 (dice) + 5 (captain) = 7 < 9 (fail)
      // Security card won't help for engineering event

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Find and select the security card (non-matching)
      const cardElement = screen.getByTestId('card-display-test-security-card')
      fireEvent.click(cardElement)

      // Roll
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Check the result - should fail because security card doesn't help engineering event
      expect(screen.getByTestId('event-result')).toHaveTextContent('Failed!')
    })
  })

  describe('success avoids penalty to resources', () => {
    it('does not apply penalty when event succeeds', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent // difficulty 9, fuel penalty 30
      mockConfig.diceRoll = 6 // High dice roll

      // Renji has engineering: 5
      // Total: 6 (dice) + 5 (captain) = 11 >= 9 (success)

      const initialResources = { ...STARTING_RESOURCES }
      act(() => {
        useGameStore.setState({ resources: initialResources })
      })

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Roll without selecting cards
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Should show success
      expect(screen.getByTestId('event-result')).toHaveTextContent('Success!')

      // No penalty should be displayed
      expect(screen.queryByTestId('event-penalty-applied')).not.toBeInTheDocument()

      // Continue past the event
      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      // Resources should not have the penalty applied
      // (fuel would have been reduced by 30 if failed, but consumption still applies from turn)
      const state = useGameStore.getState()
      // Fuel consumption happens during turn, but no penalty from event
      // Just verify the event didn't add extra penalty
      expect(state.resources.fuel).toBeGreaterThan(initialResources.fuel - 30 - 50) // Some margin for consumption
    })

    it('shows success message and total in result', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.diceRoll = 6

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      expect(screen.getByTestId('event-result')).toHaveTextContent('Success!')
      // Total: 6 (dice) + 5 (captain engineering) = 11
      expect(screen.getByTestId('event-total')).toHaveTextContent('11')
    })
  })

  describe('failure applies penalty to resources', () => {
    it('shows penalty applied message when event fails', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent // difficulty 9, fuel penalty 30
      mockConfig.diceRoll = 1 // Low dice roll

      // Renji has engineering: 5
      // Total: 1 (dice) + 5 (captain) = 6 < 9 (fail)

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Should show failure
      expect(screen.getByTestId('event-result')).toHaveTextContent('Failed!')

      // Penalty should be displayed
      expect(screen.getByTestId('event-penalty-applied')).toBeInTheDocument()
      expect(screen.getByTestId('event-penalty-applied')).toHaveTextContent(`-${engineeringEvent.penalty.amount}`)
    })

    it('shows failure message and total in result', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.diceRoll = 1

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      expect(screen.getByTestId('event-result')).toHaveTextContent('Failed!')
      // Total: 1 (dice) + 5 (captain engineering) = 6
      expect(screen.getByTestId('event-total')).toHaveTextContent('6')
    })

    it('displays the correct penalty type for resource penalties', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = securityEvent // money penalty
      mockConfig.diceRoll = 1

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      expect(screen.getByTestId('event-penalty-applied')).toHaveTextContent('money')
    })
  })

  describe('card hand replenishes after event resolution', () => {
    it('replenishes cards to 3 after playing cards in event', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.diceRoll = 6

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Select a card
      const cardElement = screen.getByTestId('card-display-test-engineering-card')
      fireEvent.click(cardElement)

      // Verify card is selected
      expect(useGameStore.getState().selectedCards.length).toBe(1)

      // Roll
      const rollButton = screen.getByRole('button', { name: /roll/i })
      fireEvent.click(rollButton)

      // Continue past event
      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      // After event resolution, hand should be replenished
      const state = useGameStore.getState()
      expect(state.cardHand.length).toBe(3)
      expect(state.selectedCards.length).toBe(0)
      expect(state.currentEvent).toBeNull()
    })

    it('removes played cards from hand before replenishing', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.diceRoll = 6

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Select a card
      const cardElement = screen.getByTestId('card-display-test-engineering-card')
      fireEvent.click(cardElement)

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Verify replenishHand was called with the remaining cards (2 cards)
      expect(replenishHandCalls.length).toBeGreaterThan(0)
      const callArg = replenishHandCalls[0]
      expect(callArg.length).toBe(2) // Started with 3, played 1
    })

    it('clears selected cards after event resolution', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.diceRoll = 6

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Select multiple cards (use card-display- prefix)
      const cardElements = screen.getAllByTestId(/^card-display-/)
      fireEvent.click(cardElements[0])
      fireEvent.click(cardElements[1])

      expect(useGameStore.getState().selectedCards.length).toBe(2)

      // Roll and continue
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Selected cards should be cleared
      expect(useGameStore.getState().selectedCards.length).toBe(0)
    })
  })

  describe('event flow integrates with station arrivals', () => {
    it('shows event modal before station modal when both trigger', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.movement = 10 // Enough to reach next country
      mockConfig.diceRoll = 6

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Event modal should show first (not station modal)
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
    })

    it('shows station modal after event is resolved', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.movement = 10 // Enough to reach next country
      mockConfig.diceRoll = 6

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Resolve event
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Now station modal should appear
      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('shows turn result after dismissing station modal', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.movement = 10
      mockConfig.diceRoll = 6

      render(<App />)

      // Execute turn
      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      // Resolve event
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Dismiss station modal
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Turn result should show
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('game continues normally after full event + station flow', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.movement = 10
      mockConfig.diceRoll = 6

      // Give plenty of resources
      act(() => {
        useGameStore.setState({
          resources: { food: 100, fuel: 200, water: 100, money: 500 },
        })
      })

      render(<App />)

      // Execute first turn
      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      // Resolve event
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Dismiss station modal
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Dismiss turn result
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Should be back to normal dashboard state
      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.queryByTestId('turn-result-display')).not.toBeInTheDocument()

      // Can execute another turn
      expect(useGameStore.getState().turnCount).toBe(2)
      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      // Another event should trigger based on our mock
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
    })
  })

  describe('event only shows during playing state', () => {
    it('does not show event modal when game is over', () => {
      mockConfig.shouldTriggerEvent = true

      // Set up a game over state (no resources)
      act(() => {
        useGameStore.setState({
          resources: { food: 0, fuel: 0, water: 0, money: 0 },
        })
      })

      render(<App />)

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)

      // Should transition to game over screen, not show event
      expect(useGameStore.getState().currentScreen).toBe('gameOver')
      expect(screen.queryByTestId('event-modal')).not.toBeInTheDocument()
    })
  })

  describe('multiple card selection for events', () => {
    it('allows selecting and deselecting multiple cards', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent

      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      // Select two cards (use card-display- prefix)
      const cardElements = screen.getAllByTestId(/^card-display-/)
      fireEvent.click(cardElements[0])
      fireEvent.click(cardElements[1])

      expect(useGameStore.getState().selectedCards.length).toBe(2)

      // Deselect one
      fireEvent.click(cardElements[0])

      expect(useGameStore.getState().selectedCards.length).toBe(1)
    })

    it('can play zero cards', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = engineeringEvent
      mockConfig.diceRoll = 6

      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      // Don't select any cards, just roll
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))

      // Should still work
      expect(screen.getByTestId('event-result')).toBeInTheDocument()
    })
  })

  describe('different event types work correctly', () => {
    it('handles security events with security stat', () => {
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = securityEvent // security event
      mockConfig.diceRoll = 6

      // Renji has security: 3
      // Security event difficulty: 10
      // Total: 6 + 3 = 9 < 10 (fail without cards)

      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      expect(screen.getByTestId('event-stat-tested')).toHaveTextContent('security')

      // Roll without cards - should fail
      fireEvent.click(screen.getByRole('button', { name: /roll/i }))

      expect(screen.getByTestId('event-result')).toHaveTextContent('Failed!')
    })

    it('handles food events with food stat', () => {
      const foodEvent = events.find(e => e.statTested === 'food')!
      mockConfig.shouldTriggerEvent = true
      mockConfig.selectedEvent = foodEvent
      mockConfig.diceRoll = 6

      // Renji has food: 2
      // Food event difficulty varies

      render(<App />)

      fireEvent.click(screen.getByRole('button', { name: /go/i }))

      expect(screen.getByTestId('event-stat-tested')).toHaveTextContent('food')
    })
  })
})
