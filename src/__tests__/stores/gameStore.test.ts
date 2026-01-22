import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../../stores/gameStore'
import type { GameScreen, Captain, Train, CrewMember, CargoItem } from '../../types'
import { STARTING_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import { cycleRole } from '../../logic/crew'
import { cards } from '../../data/cards'
import { events } from '../../data/events'
import { getCartById } from '../../data/carts'
import { getMiniGameByCountryId } from '../../data/minigames'
import { getQuizByCountryId } from '../../data/quizzes'
import type { EventResult } from '../../logic/events'
import { countries } from '../../data/countries'

// Mock data for tests
const mockCaptain: Captain = {
  id: 'test-captain',
  name: 'Test Captain',
  origin: 'Test Origin',
  description: 'A test captain',
  portrait: '🧑‍✈️',
  stats: { engineering: 3, food: 3, security: 3 },
}

const mockTrain: Train = {
  id: 'test-train',
  name: 'Test Train',
  origin: 'Test Origin',
  character: 'A test train',
  sprite: '🚂',
  stats: { speed: 3, reliability: 3, power: 3 },
}

describe('gameStore', () => {
  // Reset store state before each test
  beforeEach(() => {
    useGameStore.setState({
      currentScreen: 'intro',
      selectedCaptain: null,
      selectedTrain: null,
      resources: { ...STARTING_RESOURCES },
      crew: [...startingCrew],
      currentCountryIndex: 0,
      progressInCountry: 0,
      turnCount: 1,
      lastTurnResult: null,
      gameOverReason: null,
      cardHand: [],
      currentEvent: null,
      selectedCards: [],
      ownedCarts: [],
      currentMiniGame: null,
      lastMiniGameResult: null,
      carriedCargo: [],
      pendingCargoOpen: null,
      // Quiz state
      currentQuiz: null,
      quizAnswers: new Map(),
      currentQuestionIndex: 0,
      lastQuizResult: null,
      // Shop and activity tracking state
      shopCart: { food: 0, fuel: 0, water: 0 },
      playedMiniGames: new Set<string>(),
      takenQuizzes: new Set<string>(),
    })
  })

  describe('initial state', () => {
    it('should have intro as the initial screen', () => {
      const state = useGameStore.getState()
      expect(state.currentScreen).toBe('intro')
    })

    it('should have selectedCaptain as null', () => {
      const state = useGameStore.getState()
      expect(state.selectedCaptain).toBeNull()
    })

    it('should have selectedTrain as null', () => {
      const state = useGameStore.getState()
      expect(state.selectedTrain).toBeNull()
    })
  })

  describe('setScreen', () => {
    it('should change currentScreen to the specified screen', () => {
      const { setScreen } = useGameStore.getState()

      setScreen('captainSelect')
      expect(useGameStore.getState().currentScreen).toBe('captainSelect')
    })

    it('should allow setting any valid GameScreen', () => {
      const { setScreen } = useGameStore.getState()
      const screens: GameScreen[] = ['intro', 'captainSelect', 'trainSelect', 'dashboard', 'victory', 'gameOver']

      for (const screen of screens) {
        setScreen(screen)
        expect(useGameStore.getState().currentScreen).toBe(screen)
      }
    })
  })

  describe('goBack', () => {
    it('should go from captainSelect to intro', () => {
      useGameStore.setState({ currentScreen: 'captainSelect' })

      const { goBack } = useGameStore.getState()
      goBack()

      expect(useGameStore.getState().currentScreen).toBe('intro')
    })

    it('should go from trainSelect to captainSelect', () => {
      useGameStore.setState({ currentScreen: 'trainSelect' })

      const { goBack } = useGameStore.getState()
      goBack()

      expect(useGameStore.getState().currentScreen).toBe('captainSelect')
    })

    it('should go from dashboard to trainSelect', () => {
      useGameStore.setState({ currentScreen: 'dashboard' })

      const { goBack } = useGameStore.getState()
      goBack()

      expect(useGameStore.getState().currentScreen).toBe('trainSelect')
    })

    it('should not go back from victory screen (no-op)', () => {
      useGameStore.setState({ currentScreen: 'victory' })

      const { goBack } = useGameStore.getState()
      goBack()

      expect(useGameStore.getState().currentScreen).toBe('victory')
    })

    it('should not go back from gameOver screen (no-op)', () => {
      useGameStore.setState({ currentScreen: 'gameOver' })

      const { goBack } = useGameStore.getState()
      goBack()

      expect(useGameStore.getState().currentScreen).toBe('gameOver')
    })

    it('should stay on intro when going back from intro (no-op)', () => {
      useGameStore.setState({ currentScreen: 'intro' })

      const { goBack } = useGameStore.getState()
      goBack()

      expect(useGameStore.getState().currentScreen).toBe('intro')
    })
  })

  describe('selectCaptain', () => {
    it('should set the selected captain', () => {
      const { selectCaptain } = useGameStore.getState()

      selectCaptain(mockCaptain)

      expect(useGameStore.getState().selectedCaptain).toEqual(mockCaptain)
    })

    it('should navigate to trainSelect screen', () => {
      const { selectCaptain } = useGameStore.getState()

      selectCaptain(mockCaptain)

      expect(useGameStore.getState().currentScreen).toBe('trainSelect')
    })
  })

  describe('selectTrain', () => {
    it('should set the selected train', () => {
      const { selectTrain } = useGameStore.getState()

      selectTrain(mockTrain)

      expect(useGameStore.getState().selectedTrain).toEqual(mockTrain)
    })

    it('should navigate to dashboard screen', () => {
      const { selectTrain } = useGameStore.getState()

      selectTrain(mockTrain)

      expect(useGameStore.getState().currentScreen).toBe('dashboard')
    })
  })

  describe('resetSelection', () => {
    it('should clear selectedCaptain', () => {
      useGameStore.setState({ selectedCaptain: mockCaptain })

      const { resetSelection } = useGameStore.getState()
      resetSelection()

      expect(useGameStore.getState().selectedCaptain).toBeNull()
    })

    it('should clear selectedTrain', () => {
      useGameStore.setState({ selectedTrain: mockTrain })

      const { resetSelection } = useGameStore.getState()
      resetSelection()

      expect(useGameStore.getState().selectedTrain).toBeNull()
    })

    it('should clear both selections at once', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
      })

      const { resetSelection } = useGameStore.getState()
      resetSelection()

      expect(useGameStore.getState().selectedCaptain).toBeNull()
      expect(useGameStore.getState().selectedTrain).toBeNull()
    })

    it('should not change the current screen', () => {
      useGameStore.setState({
        currentScreen: 'dashboard',
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
      })

      const { resetSelection } = useGameStore.getState()
      resetSelection()

      expect(useGameStore.getState().currentScreen).toBe('dashboard')
    })
  })

  describe('game state initial values', () => {
    it('should have correct initial resources', () => {
      const state = useGameStore.getState()
      expect(state.resources).toEqual(STARTING_RESOURCES)
    })

    it('should have 4 crew members', () => {
      const state = useGameStore.getState()
      expect(state.crew).toHaveLength(4)
    })

    it('should have correct initial crew', () => {
      const state = useGameStore.getState()
      expect(state.crew).toEqual(startingCrew)
    })

    it('should have currentCountryIndex = 0', () => {
      const state = useGameStore.getState()
      expect(state.currentCountryIndex).toBe(0)
    })

    it('should have progressInCountry = 0', () => {
      const state = useGameStore.getState()
      expect(state.progressInCountry).toBe(0)
    })

    it('should have turnCount = 1', () => {
      const state = useGameStore.getState()
      expect(state.turnCount).toBe(1)
    })
  })

  describe('initializeGame', () => {
    it('should reset resources to starting values', () => {
      useGameStore.setState({
        resources: { food: 10, fuel: 10, water: 10, money: 10 },
      })

      const { initializeGame } = useGameStore.getState()
      initializeGame()

      expect(useGameStore.getState().resources).toEqual(STARTING_RESOURCES)
    })

    it('should reset crew to starting crew', () => {
      useGameStore.setState({
        crew: [],
      })

      const { initializeGame } = useGameStore.getState()
      initializeGame()

      expect(useGameStore.getState().crew).toEqual(startingCrew)
    })

    it('should reset currentCountryIndex to 0', () => {
      useGameStore.setState({
        currentCountryIndex: 5,
      })

      const { initializeGame } = useGameStore.getState()
      initializeGame()

      expect(useGameStore.getState().currentCountryIndex).toBe(0)
    })

    it('should reset progressInCountry to 0', () => {
      useGameStore.setState({
        progressInCountry: 7,
      })

      const { initializeGame } = useGameStore.getState()
      initializeGame()

      expect(useGameStore.getState().progressInCountry).toBe(0)
    })

    it('should reset turnCount to 1', () => {
      useGameStore.setState({
        turnCount: 50,
      })

      const { initializeGame } = useGameStore.getState()
      initializeGame()

      expect(useGameStore.getState().turnCount).toBe(1)
    })
  })

  describe('selectTrain with initializeGame', () => {
    it('should initialize game state when selecting train', () => {
      // Set some modified state
      useGameStore.setState({
        resources: { food: 10, fuel: 10, water: 10, money: 10 },
        currentCountryIndex: 5,
        progressInCountry: 7,
        turnCount: 50,
      })

      const { selectTrain } = useGameStore.getState()
      selectTrain(mockTrain)

      const state = useGameStore.getState()
      expect(state.resources).toEqual(STARTING_RESOURCES)
      expect(state.currentCountryIndex).toBe(0)
      expect(state.progressInCountry).toBe(0)
      expect(state.turnCount).toBe(1)
    })
  })

  describe('executeTurn', () => {
    it('should not execute without captain and train', () => {
      const initialState = useGameStore.getState()
      const { executeTurn } = initialState

      executeTurn()

      // State should remain unchanged
      expect(useGameStore.getState().turnCount).toBe(1)
    })

    it('should process turn when captain and train are selected', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
      })

      const { executeTurn } = useGameStore.getState()
      executeTurn()

      const state = useGameStore.getState()
      expect(state.turnCount).toBe(2)
      expect(state.lastTurnResult).not.toBeNull()
    })

    it('should update resources after turn', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
      })

      const { executeTurn } = useGameStore.getState()
      executeTurn()

      const state = useGameStore.getState()
      // Resources should have changed
      expect(state.resources.fuel).toBeLessThan(STARTING_RESOURCES.fuel)
    })

    it('should store last turn result', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
      })

      const { executeTurn } = useGameStore.getState()
      executeTurn()

      const state = useGameStore.getState()
      expect(state.lastTurnResult).not.toBeNull()
      expect(state.lastTurnResult?.diceRoll).toBeDefined()
      expect(state.lastTurnResult?.movement).toBeDefined()
    })

    it('should navigate to victory when reaching final country', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
        currentCountryIndex: 9, // Already at final country
        resources: { food: 100, fuel: 200, water: 100, money: 1000 },
      })

      const { executeTurn } = useGameStore.getState()
      executeTurn()

      const state = useGameStore.getState()
      expect(state.currentScreen).toBe('victory')
    })

    it('should navigate to gameOver when resources depleted', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
        resources: { food: 1, fuel: 1, water: 50, money: 200 },
      })

      const { executeTurn } = useGameStore.getState()
      executeTurn()

      const state = useGameStore.getState()
      // If food or fuel went to 0, should be game over
      if (state.resources.food <= 0 || state.resources.fuel <= 0) {
        expect(state.currentScreen).toBe('gameOver')
        expect(state.gameOverReason).not.toBeNull()
      }
    })
  })

  describe('clearTurnResult', () => {
    it('should clear the last turn result', () => {
      useGameStore.setState({
        selectedCaptain: mockCaptain,
        selectedTrain: mockTrain,
      })

      const { executeTurn, clearTurnResult } = useGameStore.getState()
      executeTurn()

      expect(useGameStore.getState().lastTurnResult).not.toBeNull()

      clearTurnResult()

      expect(useGameStore.getState().lastTurnResult).toBeNull()
    })
  })

  describe('cycleCrewRole', () => {
    it('should cycle a crew member role to the next role', () => {
      const crew = useGameStore.getState().crew
      const firstCrewMember = crew[0]
      const originalRole = firstCrewMember.role
      const expectedNewRole = cycleRole(originalRole)

      const { cycleCrewRole } = useGameStore.getState()
      cycleCrewRole(firstCrewMember.id)

      const updatedCrew = useGameStore.getState().crew
      const updatedCrewMember = updatedCrew.find(c => c.id === firstCrewMember.id)

      expect(updatedCrewMember?.role).toBe(expectedNewRole)
    })

    it('should cycle through all roles for a crew member', () => {
      // Set up a crew member with a known role
      const testCrew: CrewMember[] = [
        { id: 'test-crew-1', name: 'Test Crew', role: 'engineer', avatar: '👷' },
      ]
      useGameStore.setState({ crew: testCrew })

      const { cycleCrewRole } = useGameStore.getState()

      // engineer -> cook
      cycleCrewRole('test-crew-1')
      expect(useGameStore.getState().crew[0].role).toBe('cook')

      // cook -> security
      cycleCrewRole('test-crew-1')
      expect(useGameStore.getState().crew[0].role).toBe('security')

      // security -> free
      cycleCrewRole('test-crew-1')
      expect(useGameStore.getState().crew[0].role).toBe('free')

      // free -> engineer (cycle completes)
      cycleCrewRole('test-crew-1')
      expect(useGameStore.getState().crew[0].role).toBe('engineer')
    })

    it('should handle invalid crew member ID gracefully (no changes)', () => {
      const originalCrew = [...useGameStore.getState().crew]

      const { cycleCrewRole } = useGameStore.getState()
      cycleCrewRole('non-existent-id')

      const currentCrew = useGameStore.getState().crew
      expect(currentCrew).toEqual(originalCrew)
    })

    it('should only update the specified crew member', () => {
      const testCrew: CrewMember[] = [
        { id: 'crew-1', name: 'Crew 1', role: 'engineer', avatar: '👷' },
        { id: 'crew-2', name: 'Crew 2', role: 'cook', avatar: '👨‍🍳' },
        { id: 'crew-3', name: 'Crew 3', role: 'security', avatar: '💂' },
      ]
      useGameStore.setState({ crew: testCrew })

      const { cycleCrewRole } = useGameStore.getState()
      cycleCrewRole('crew-2')

      const updatedCrew = useGameStore.getState().crew
      expect(updatedCrew[0].role).toBe('engineer') // unchanged
      expect(updatedCrew[1].role).toBe('security') // cook -> security
      expect(updatedCrew[2].role).toBe('security') // unchanged
    })
  })

  describe('card hand state', () => {
    describe('initial card state', () => {
      it('should have cardHand as empty array initially', () => {
        const state = useGameStore.getState()
        expect(state.cardHand).toEqual([])
      })

      it('should have currentEvent as null initially', () => {
        const state = useGameStore.getState()
        expect(state.currentEvent).toBeNull()
      })

      it('should have selectedCards as empty array initially', () => {
        const state = useGameStore.getState()
        expect(state.selectedCards).toEqual([])
      })
    })

    describe('initializeCards', () => {
      it('should create a hand of exactly 3 cards', () => {
        const { initializeCards } = useGameStore.getState()
        initializeCards()

        const state = useGameStore.getState()
        expect(state.cardHand).toHaveLength(3)
      })

      it('should draw valid BonusCards from the card pool', () => {
        const { initializeCards } = useGameStore.getState()
        initializeCards()

        const state = useGameStore.getState()
        const cardIds = cards.map(c => c.id)
        state.cardHand.forEach(card => {
          expect(cardIds).toContain(card.id)
          expect(card).toHaveProperty('name')
          expect(card).toHaveProperty('stat')
          expect(card).toHaveProperty('bonus')
        })
      })

      it('should clear selectedCards when initializing', () => {
        useGameStore.setState({ selectedCards: ['some-card-id'] })

        const { initializeCards } = useGameStore.getState()
        initializeCards()

        expect(useGameStore.getState().selectedCards).toEqual([])
      })

      it('should clear currentEvent when initializing', () => {
        useGameStore.setState({ currentEvent: events[0] })

        const { initializeCards } = useGameStore.getState()
        initializeCards()

        expect(useGameStore.getState().currentEvent).toBeNull()
      })
    })

    describe('selectCard', () => {
      beforeEach(() => {
        // Set up a hand with known cards
        useGameStore.setState({
          cardHand: [cards[0], cards[1], cards[2]],
          selectedCards: [],
        })
      })

      it('should add card id to selectedCards when not selected', () => {
        const { selectCard } = useGameStore.getState()
        selectCard(cards[0].id)

        expect(useGameStore.getState().selectedCards).toContain(cards[0].id)
      })

      it('should remove card id from selectedCards when already selected (toggle)', () => {
        useGameStore.setState({ selectedCards: [cards[0].id] })

        const { selectCard } = useGameStore.getState()
        selectCard(cards[0].id)

        expect(useGameStore.getState().selectedCards).not.toContain(cards[0].id)
      })

      it('should only allow selecting one card at a time', () => {
        const { selectCard } = useGameStore.getState()
        selectCard(cards[0].id)
        selectCard(cards[1].id)

        const selectedCards = useGameStore.getState().selectedCards
        expect(selectedCards).not.toContain(cards[0].id)
        expect(selectedCards).toContain(cards[1].id)
        expect(selectedCards).toHaveLength(1)
      })

      it('should replace selection when selecting different card', () => {
        const { selectCard } = useGameStore.getState()
        selectCard(cards[0].id)
        expect(useGameStore.getState().selectedCards).toEqual([cards[0].id])

        selectCard(cards[1].id)
        expect(useGameStore.getState().selectedCards).toEqual([cards[1].id])

        selectCard(cards[2].id)
        expect(useGameStore.getState().selectedCards).toEqual([cards[2].id])
      })
    })

    describe('setCurrentEvent', () => {
      it('should set the current event', () => {
        const { setCurrentEvent } = useGameStore.getState()
        setCurrentEvent(events[0])

        expect(useGameStore.getState().currentEvent).toEqual(events[0])
      })

      it('should allow setting event to null', () => {
        useGameStore.setState({ currentEvent: events[0] })

        const { setCurrentEvent } = useGameStore.getState()
        setCurrentEvent(null)

        expect(useGameStore.getState().currentEvent).toBeNull()
      })
    })

    describe('resolveCurrentEvent', () => {
      beforeEach(() => {
        // Set up state with event, cards, and selection
        useGameStore.setState({
          cardHand: [cards[0], cards[1], cards[2]],
          selectedCards: [cards[0].id],
          currentEvent: events[0],
          resources: { ...STARTING_RESOURCES },
        })
      })

      it('should clear currentEvent after resolution', () => {
        const { resolveCurrentEvent } = useGameStore.getState()
        resolveCurrentEvent()

        expect(useGameStore.getState().currentEvent).toBeNull()
      })

      it('should clear selectedCards after resolution', () => {
        const { resolveCurrentEvent } = useGameStore.getState()
        resolveCurrentEvent()

        expect(useGameStore.getState().selectedCards).toEqual([])
      })

      it('should remove played cards from hand', () => {
        const { resolveCurrentEvent } = useGameStore.getState()
        resolveCurrentEvent()

        const hand = useGameStore.getState().cardHand
        expect(hand.find(c => c.id === cards[0].id)).toBeUndefined()
      })

      it('should replenish hand back to 3 cards after playing cards', () => {
        const { resolveCurrentEvent } = useGameStore.getState()
        resolveCurrentEvent()

        expect(useGameStore.getState().cardHand).toHaveLength(3)
      })

      it('should do nothing if no currentEvent', () => {
        useGameStore.setState({ currentEvent: null })

        const initialHand = [...useGameStore.getState().cardHand]
        const { resolveCurrentEvent } = useGameStore.getState()
        resolveCurrentEvent()

        expect(useGameStore.getState().cardHand).toEqual(initialHand)
      })
    })

    describe('initializeGame with cards', () => {
      it('should initialize cards when game is initialized', () => {
        const { initializeGame } = useGameStore.getState()
        initializeGame()

        const state = useGameStore.getState()
        expect(state.cardHand).toHaveLength(3)
        expect(state.selectedCards).toEqual([])
        expect(state.currentEvent).toBeNull()
      })
    })
  })

  describe('cart functionality', () => {
    it('initializes with empty ownedCarts array', () => {
      const state = useGameStore.getState()
      expect(state.ownedCarts).toEqual([])
    })

    it('resets ownedCarts when initializing game', () => {
      // First, simulate having purchased carts
      const fuelCart = getCartById('fuel-cart')!
      useGameStore.setState({
        ownedCarts: [fuelCart],
        resources: { ...STARTING_RESOURCES, money: 1000 },
      })

      expect(useGameStore.getState().ownedCarts).toHaveLength(1)

      // Now initialize game
      const { initializeGame } = useGameStore.getState()
      initializeGame()

      expect(useGameStore.getState().ownedCarts).toEqual([])
    })

    it('purchaseCart adds cart to ownedCarts when can afford', () => {
      // Set up enough money to afford the fuel cart (price: 100)
      useGameStore.setState({
        resources: { ...STARTING_RESOURCES, money: 200 },
      })

      const { purchaseCart } = useGameStore.getState()
      purchaseCart('fuel-cart')

      const state = useGameStore.getState()
      expect(state.ownedCarts).toHaveLength(1)
      expect(state.ownedCarts[0].id).toBe('fuel-cart')
    })

    it('purchaseCart deducts money from resources', () => {
      const initialMoney = 200
      useGameStore.setState({
        resources: { ...STARTING_RESOURCES, money: initialMoney },
      })

      const { purchaseCart } = useGameStore.getState()
      purchaseCart('fuel-cart') // price is 100

      const state = useGameStore.getState()
      expect(state.resources.money).toBe(initialMoney - 100)
    })

    it('purchaseCart does nothing when cannot afford', () => {
      // Set up not enough money for fuel cart (price: 100)
      const initialMoney = 50
      useGameStore.setState({
        resources: { ...STARTING_RESOURCES, money: initialMoney },
        ownedCarts: [],
      })

      const { purchaseCart } = useGameStore.getState()
      purchaseCart('fuel-cart')

      const state = useGameStore.getState()
      expect(state.ownedCarts).toHaveLength(0)
      expect(state.resources.money).toBe(initialMoney)
    })

    it('purchaseCart does nothing when cart not found', () => {
      const initialMoney = 200
      useGameStore.setState({
        resources: { ...STARTING_RESOURCES, money: initialMoney },
        ownedCarts: [],
      })

      const { purchaseCart } = useGameStore.getState()
      purchaseCart('non-existent-cart')

      const state = useGameStore.getState()
      expect(state.ownedCarts).toHaveLength(0)
      expect(state.resources.money).toBe(initialMoney)
    })

    it('allows purchasing multiple carts', () => {
      // Set up enough money for multiple carts
      useGameStore.setState({
        resources: { ...STARTING_RESOURCES, money: 500 },
      })

      const { purchaseCart } = useGameStore.getState()
      purchaseCart('fuel-cart') // price: 100
      purchaseCart('food-cart') // price: 80
      purchaseCart('water-cart') // price: 70

      const state = useGameStore.getState()
      expect(state.ownedCarts).toHaveLength(3)
      expect(state.ownedCarts.map(c => c.id)).toEqual(['fuel-cart', 'food-cart', 'water-cart'])
      expect(state.resources.money).toBe(500 - 100 - 80 - 70)
    })
  })

  describe('mini-game actions', () => {
    it('startMiniGame sets currentMiniGame for valid country', () => {
      const { startMiniGame } = useGameStore.getState()
      startMiniGame('france')

      const state = useGameStore.getState()
      expect(state.currentMiniGame).not.toBeNull()
      expect(state.currentMiniGame?.countryId).toBe('france')
      expect(state.currentMiniGame?.name).toBe('Croissant Catcher')
    })

    it('startMiniGame does nothing for invalid country', () => {
      const { startMiniGame } = useGameStore.getState()
      startMiniGame('invalid-country')

      const state = useGameStore.getState()
      expect(state.currentMiniGame).toBeNull()
    })

    it('completeMiniGame calculates and applies money reward for France', () => {
      // Set up mini-game with money reward (France's Croissant Catcher has maxReward: 25)
      const franceMiniGame = getMiniGameByCountryId('france')!
      useGameStore.setState({
        currentMiniGame: franceMiniGame,
        resources: { ...STARTING_RESOURCES, money: 50 },
      })

      const { completeMiniGame } = useGameStore.getState()
      completeMiniGame(10, 10) // Perfect score = maxReward of 25

      const state = useGameStore.getState()
      expect(state.resources.money).toBe(50 + 25) // money increased by reward
      expect(state.lastMiniGameResult).toEqual({
        score: 10,
        maxScore: 10,
        reward: 25,
      })
    })

    it('completeMiniGame calculates and applies money reward', () => {
      // Set up mini-game with money reward (Germany's Beer Stein Balance has maxReward: 50)
      const germanyMiniGame = getMiniGameByCountryId('germany')!
      useGameStore.setState({
        currentMiniGame: germanyMiniGame,
        resources: { ...STARTING_RESOURCES, money: 100 },
      })

      const { completeMiniGame } = useGameStore.getState()
      completeMiniGame(5, 10) // Half score = 25 reward (50 * 0.5)

      const state = useGameStore.getState()
      expect(state.resources.money).toBe(100 + 25) // money increased by reward
      expect(state.lastMiniGameResult?.reward).toBe(25)
    })

    it('completeMiniGame clears currentMiniGame', () => {
      const franceMiniGame = getMiniGameByCountryId('france')!
      useGameStore.setState({
        currentMiniGame: franceMiniGame,
        resources: { ...STARTING_RESOURCES },
      })

      const { completeMiniGame } = useGameStore.getState()
      completeMiniGame(5, 10)

      const state = useGameStore.getState()
      expect(state.currentMiniGame).toBeNull()
    })

    it('completeMiniGame does nothing if no currentMiniGame', () => {
      const initialResources = { ...STARTING_RESOURCES }
      useGameStore.setState({
        currentMiniGame: null,
        resources: initialResources,
      })

      const { completeMiniGame } = useGameStore.getState()
      completeMiniGame(10, 10)

      const state = useGameStore.getState()
      expect(state.resources).toEqual(initialResources)
      expect(state.lastMiniGameResult).toBeNull()
    })

    it('skipMiniGame clears mini-game state', () => {
      const franceMiniGame = getMiniGameByCountryId('france')!
      useGameStore.setState({
        currentMiniGame: franceMiniGame,
        lastMiniGameResult: { score: 5, maxScore: 10, reward: 7 },
      })

      const { skipMiniGame } = useGameStore.getState()
      skipMiniGame()

      const state = useGameStore.getState()
      expect(state.currentMiniGame).toBeNull()
      expect(state.lastMiniGameResult).toBeNull()
    })

    it('initializeGame resets mini-game state', () => {
      const franceMiniGame = getMiniGameByCountryId('france')!
      useGameStore.setState({
        currentMiniGame: franceMiniGame,
        lastMiniGameResult: { score: 5, maxScore: 10, reward: 7 },
      })

      const { initializeGame } = useGameStore.getState()
      initializeGame()

      const state = useGameStore.getState()
      expect(state.currentMiniGame).toBeNull()
      expect(state.lastMiniGameResult).toBeNull()
    })

    it('initial state has null mini-game values', () => {
      const state = useGameStore.getState()
      expect(state.currentMiniGame).toBeNull()
      expect(state.lastMiniGameResult).toBeNull()
    })
  })

  describe('cargo state', () => {
    const mockCargoItem: CargoItem = {
      id: 'test-cargo',
      name: 'Test Cargo',
      icon: '📦',
      rarity: 'common',
      rewardType: 'money',
      rewardAmount: 50,
      description: 'A test cargo item',
    }

    const mockFoodCargoItem: CargoItem = {
      id: 'test-food-cargo',
      name: 'Test Food Cargo',
      icon: '🍎',
      rarity: 'rare',
      rewardType: 'food',
      rewardAmount: 25,
      description: 'A test food cargo item',
    }

    describe('initial cargo state', () => {
      it('should have empty carriedCargo array initially', () => {
        const state = useGameStore.getState()
        expect(state.carriedCargo).toEqual([])
      })

      it('should have pendingCargoOpen as null initially', () => {
        const state = useGameStore.getState()
        expect(state.pendingCargoOpen).toBeNull()
      })
    })

    describe('addCargo', () => {
      it('should add item to carriedCargo array', () => {
        const { addCargo } = useGameStore.getState()
        addCargo(mockCargoItem, 'france', 5)

        const state = useGameStore.getState()
        expect(state.carriedCargo).toHaveLength(1)
        expect(state.carriedCargo[0].item).toEqual(mockCargoItem)
        expect(state.carriedCargo[0].foundAtCountry).toBe('france')
        expect(state.carriedCargo[0].turnFound).toBe(5)
      })

      it('should allow adding multiple cargo items', () => {
        const { addCargo } = useGameStore.getState()
        addCargo(mockCargoItem, 'france', 3)
        addCargo(mockFoodCargoItem, 'germany', 7)

        const state = useGameStore.getState()
        expect(state.carriedCargo).toHaveLength(2)
        expect(state.carriedCargo[0].item.id).toBe('test-cargo')
        expect(state.carriedCargo[1].item.id).toBe('test-food-cargo')
      })
    })

    describe('openCargoAtStation', () => {
      it('should return null when no cargo', () => {
        const { openCargoAtStation } = useGameStore.getState()
        const result = openCargoAtStation()

        expect(result).toBeNull()
        expect(useGameStore.getState().carriedCargo).toEqual([])
      })

      it('should remove first item from carriedCargo', () => {
        useGameStore.setState({
          carriedCargo: [
            { item: mockCargoItem, foundAtCountry: 'france', turnFound: 3 },
            { item: mockFoodCargoItem, foundAtCountry: 'germany', turnFound: 7 },
          ],
        })

        const { openCargoAtStation } = useGameStore.getState()
        openCargoAtStation()

        const state = useGameStore.getState()
        expect(state.carriedCargo).toHaveLength(1)
        expect(state.carriedCargo[0].item.id).toBe('test-food-cargo')
      })

      it('should set pendingCargoOpen to the opened item', () => {
        useGameStore.setState({
          carriedCargo: [
            { item: mockCargoItem, foundAtCountry: 'france', turnFound: 3 },
          ],
        })

        const { openCargoAtStation } = useGameStore.getState()
        openCargoAtStation()

        const state = useGameStore.getState()
        expect(state.pendingCargoOpen).toEqual(mockCargoItem)
      })

      it('should apply reward to resources (money)', () => {
        useGameStore.setState({
          carriedCargo: [
            { item: mockCargoItem, foundAtCountry: 'france', turnFound: 3 },
          ],
          resources: { ...STARTING_RESOURCES, money: 100 },
        })

        const { openCargoAtStation } = useGameStore.getState()
        openCargoAtStation()

        const state = useGameStore.getState()
        expect(state.resources.money).toBe(100 + mockCargoItem.rewardAmount)
      })

      it('should apply reward to resources (food)', () => {
        useGameStore.setState({
          carriedCargo: [
            { item: mockFoodCargoItem, foundAtCountry: 'germany', turnFound: 5 },
          ],
          resources: { ...STARTING_RESOURCES, food: 30 },
        })

        const { openCargoAtStation } = useGameStore.getState()
        openCargoAtStation()

        const state = useGameStore.getState()
        expect(state.resources.food).toBe(30 + mockFoodCargoItem.rewardAmount)
      })

      it('should return the cargo reward', () => {
        useGameStore.setState({
          carriedCargo: [
            { item: mockCargoItem, foundAtCountry: 'france', turnFound: 3 },
          ],
          resources: { ...STARTING_RESOURCES },
        })

        const { openCargoAtStation } = useGameStore.getState()
        const result = openCargoAtStation()

        expect(result).toEqual({
          rewardType: 'money',
          amount: 50,
        })
      })
    })

    describe('clearPendingCargo', () => {
      it('should set pendingCargoOpen to null', () => {
        useGameStore.setState({
          pendingCargoOpen: mockCargoItem,
        })

        const { clearPendingCargo } = useGameStore.getState()
        clearPendingCargo()

        expect(useGameStore.getState().pendingCargoOpen).toBeNull()
      })
    })

    describe('initializeGame resets cargo state', () => {
      it('should reset carriedCargo to empty array', () => {
        useGameStore.setState({
          carriedCargo: [
            { item: mockCargoItem, foundAtCountry: 'france', turnFound: 3 },
          ],
        })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().carriedCargo).toEqual([])
      })

      it('should reset pendingCargoOpen to null', () => {
        useGameStore.setState({
          pendingCargoOpen: mockCargoItem,
        })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().pendingCargoOpen).toBeNull()
      })
    })
  })

  describe('quiz state', () => {
    describe('initial quiz state', () => {
      it('should have currentQuiz as null initially', () => {
        const state = useGameStore.getState()
        expect(state.currentQuiz).toBeNull()
      })

      it('should have quizAnswers as empty Map initially', () => {
        const state = useGameStore.getState()
        expect(state.quizAnswers).toBeInstanceOf(Map)
        expect(state.quizAnswers.size).toBe(0)
      })

      it('should have currentQuestionIndex as 0 initially', () => {
        const state = useGameStore.getState()
        expect(state.currentQuestionIndex).toBe(0)
      })

      it('should have lastQuizResult as null initially', () => {
        const state = useGameStore.getState()
        expect(state.lastQuizResult).toBeNull()
      })
    })

    describe('startQuiz', () => {
      it('should set currentQuiz for valid country', () => {
        const { startQuiz } = useGameStore.getState()
        startQuiz('france')

        const state = useGameStore.getState()
        expect(state.currentQuiz).not.toBeNull()
        expect(state.currentQuiz?.countryId).toBe('france')
        expect(state.currentQuiz?.name).toBe('France')
      })

      it('should reset quizAnswers to empty Map', () => {
        // Set some existing answers
        const existingAnswers = new Map([['q1', 'answer1']])
        useGameStore.setState({ quizAnswers: existingAnswers })

        const { startQuiz } = useGameStore.getState()
        startQuiz('france')

        const state = useGameStore.getState()
        expect(state.quizAnswers.size).toBe(0)
      })

      it('should reset currentQuestionIndex to 0', () => {
        useGameStore.setState({ currentQuestionIndex: 2 })

        const { startQuiz } = useGameStore.getState()
        startQuiz('france')

        const state = useGameStore.getState()
        expect(state.currentQuestionIndex).toBe(0)
      })

      it('should do nothing for invalid country', () => {
        const { startQuiz } = useGameStore.getState()
        startQuiz('invalid-country')

        const state = useGameStore.getState()
        expect(state.currentQuiz).toBeNull()
      })
    })

    describe('answerQuestion', () => {
      beforeEach(() => {
        // Set up a quiz first
        const franceQuiz = getQuizByCountryId('france')!
        useGameStore.setState({
          currentQuiz: franceQuiz,
          quizAnswers: new Map(),
          currentQuestionIndex: 0,
        })
      })

      it('should store answer in quizAnswers Map', () => {
        const { answerQuestion } = useGameStore.getState()
        answerQuestion('france-q1', 'Eiffel Tower')

        const state = useGameStore.getState()
        expect(state.quizAnswers.get('france-q1')).toBe('Eiffel Tower')
      })

      it('should allow updating an existing answer', () => {
        const { answerQuestion } = useGameStore.getState()
        answerQuestion('france-q1', 'Big Ben')
        answerQuestion('france-q1', 'Eiffel Tower')

        const state = useGameStore.getState()
        expect(state.quizAnswers.get('france-q1')).toBe('Eiffel Tower')
      })

      it('should allow multiple answers for different questions', () => {
        const { answerQuestion } = useGameStore.getState()
        answerQuestion('france-q1', 'Eiffel Tower')
        answerQuestion('france-q2', 'Croissants')

        const state = useGameStore.getState()
        expect(state.quizAnswers.get('france-q1')).toBe('Eiffel Tower')
        expect(state.quizAnswers.get('france-q2')).toBe('Croissants')
      })
    })

    describe('nextQuestion', () => {
      it('should increment currentQuestionIndex', () => {
        useGameStore.setState({ currentQuestionIndex: 0 })

        const { nextQuestion } = useGameStore.getState()
        nextQuestion()

        const state = useGameStore.getState()
        expect(state.currentQuestionIndex).toBe(1)
      })

      it('should increment from 1 to 2', () => {
        useGameStore.setState({ currentQuestionIndex: 1 })

        const { nextQuestion } = useGameStore.getState()
        nextQuestion()

        const state = useGameStore.getState()
        expect(state.currentQuestionIndex).toBe(2)
      })
    })

    describe('completeQuiz', () => {
      beforeEach(() => {
        // Set up quiz with all correct answers using actual quiz questions
        const franceQuiz = getQuizByCountryId('france')!
        // Build correct answers map from actual quiz questions
        const correctAnswers = new Map<string, string>()
        franceQuiz.questions.forEach(q => {
          correctAnswers.set(q.id, q.correctAnswer)
        })
        useGameStore.setState({
          currentQuiz: franceQuiz,
          quizAnswers: correctAnswers,
          currentQuestionIndex: 2,
          resources: { ...STARTING_RESOURCES, money: 100 },
        })
      })

      it('should calculate correct score (all correct = 3)', () => {
        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.lastQuizResult?.score).toBe(3)
        expect(state.lastQuizResult?.totalQuestions).toBe(3)
      })

      it('should apply money reward (3 correct = $30)', () => {
        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.resources.money).toBe(100 + 30) // 3 correct = $30
        expect(state.lastQuizResult?.reward).toBe(30)
      })

      it('should set rating for 3 correct', () => {
        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.lastQuizResult?.rating).toContain('Quiz Master')
      })

      it('should clear currentQuiz after completion', () => {
        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.currentQuiz).toBeNull()
      })

      it('should handle 2 correct answers', () => {
        // Get the current quiz and build answers with 2 correct, 1 wrong
        const franceQuiz = useGameStore.getState().currentQuiz!
        const partialAnswers = new Map<string, string>()
        franceQuiz.questions.forEach((q, idx) => {
          if (idx < 2) {
            partialAnswers.set(q.id, q.correctAnswer)
          } else {
            partialAnswers.set(q.id, 'Wrong Answer')
          }
        })
        useGameStore.setState({ quizAnswers: partialAnswers })

        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.lastQuizResult?.score).toBe(2)
        expect(state.lastQuizResult?.reward).toBe(20) // 2 correct = $20
        expect(state.resources.money).toBe(100 + 20)
      })

      it('should handle 1 correct answer', () => {
        // Get the current quiz and build answers with 1 correct, 2 wrong
        const franceQuiz = useGameStore.getState().currentQuiz!
        const oneCorrect = new Map<string, string>()
        franceQuiz.questions.forEach((q, idx) => {
          if (idx === 0) {
            oneCorrect.set(q.id, q.correctAnswer)
          } else {
            oneCorrect.set(q.id, 'Wrong Answer')
          }
        })
        useGameStore.setState({ quizAnswers: oneCorrect })

        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.lastQuizResult?.score).toBe(1)
        expect(state.lastQuizResult?.reward).toBe(10) // 1 correct = $10
      })

      it('should handle 0 correct answers (participation reward)', () => {
        // Get the current quiz and build answers with 0 correct
        const franceQuiz = useGameStore.getState().currentQuiz!
        const noCorrect = new Map<string, string>()
        franceQuiz.questions.forEach(q => {
          noCorrect.set(q.id, 'Wrong Answer')
        })
        useGameStore.setState({ quizAnswers: noCorrect })

        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.lastQuizResult?.score).toBe(0)
        expect(state.lastQuizResult?.reward).toBe(5) // 0 correct = $5
      })

      it('should do nothing if no currentQuiz', () => {
        useGameStore.setState({ currentQuiz: null })
        const initialMoney = useGameStore.getState().resources.money

        const { completeQuiz } = useGameStore.getState()
        completeQuiz()

        const state = useGameStore.getState()
        expect(state.resources.money).toBe(initialMoney)
        expect(state.lastQuizResult).toBeNull()
      })
    })

    describe('skipQuiz', () => {
      beforeEach(() => {
        const franceQuiz = getQuizByCountryId('france')!
        useGameStore.setState({
          currentQuiz: franceQuiz,
          quizAnswers: new Map([['france-q1', 'Eiffel Tower']]),
          currentQuestionIndex: 1,
        })
      })

      it('should clear currentQuiz', () => {
        const { skipQuiz } = useGameStore.getState()
        skipQuiz()

        const state = useGameStore.getState()
        expect(state.currentQuiz).toBeNull()
      })

      it('should clear quizAnswers', () => {
        const { skipQuiz } = useGameStore.getState()
        skipQuiz()

        const state = useGameStore.getState()
        expect(state.quizAnswers.size).toBe(0)
      })

      it('should reset currentQuestionIndex to 0', () => {
        const { skipQuiz } = useGameStore.getState()
        skipQuiz()

        const state = useGameStore.getState()
        expect(state.currentQuestionIndex).toBe(0)
      })

      it('should not affect resources (no reward)', () => {
        const initialMoney = useGameStore.getState().resources.money

        const { skipQuiz } = useGameStore.getState()
        skipQuiz()

        const state = useGameStore.getState()
        expect(state.resources.money).toBe(initialMoney)
      })
    })

    describe('initializeGame resets quiz state', () => {
      it('should reset currentQuiz to null', () => {
        const franceQuiz = getQuizByCountryId('france')!
        useGameStore.setState({ currentQuiz: franceQuiz })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().currentQuiz).toBeNull()
      })

      it('should reset quizAnswers to empty Map', () => {
        useGameStore.setState({ quizAnswers: new Map([['q1', 'a1']]) })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().quizAnswers.size).toBe(0)
      })

      it('should reset currentQuestionIndex to 0', () => {
        useGameStore.setState({ currentQuestionIndex: 2 })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().currentQuestionIndex).toBe(0)
      })

      it('should reset lastQuizResult to null', () => {
        useGameStore.setState({
          lastQuizResult: { score: 3, totalQuestions: 3, reward: 30, rating: 'Quiz Master!' },
        })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().lastQuizResult).toBeNull()
      })
    })
  })

  describe('resolveCurrentEvent with penalty application', () => {
    const mockEvent = events[0] // Get a real event from the events list

    // Crew with NO security members for "full penalty" tests
    const crewWithNoSecurity: CrewMember[] = [
      { id: 'crew-1', name: 'Crew 1', role: 'engineer', avatar: '👷' },
      { id: 'crew-2', name: 'Crew 2', role: 'cook', avatar: '👨‍🍳' },
      { id: 'crew-3', name: 'Crew 3', role: 'engineer', avatar: '🔧' },
      { id: 'crew-4', name: 'Crew 4', role: 'free', avatar: '😊' },
    ]

    beforeEach(() => {
      useGameStore.setState({
        cardHand: [cards[0], cards[1], cards[2]],
        selectedCards: [cards[0].id],
        currentEvent: mockEvent,
        resources: { food: 50, fuel: 100, water: 50, money: 200 },
        crew: crewWithNoSecurity, // Use crew with no security for full penalty tests
        progressInCountry: 5,
      })
    })

    it('should apply fuel penalty when event fails with fuel penalty', () => {
      const fuelPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }
      useGameStore.setState({ currentEvent: fuelPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      // With 0 security crew, full penalty of 20 is applied
      expect(state.resources.fuel).toBe(100 - 20)
    })

    it('should apply food penalty when event fails with food penalty', () => {
      const foodPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'food', amount: 15 },
      }
      useGameStore.setState({ currentEvent: foodPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'food', amount: 15 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      expect(state.resources.food).toBe(50 - 15)
    })

    it('should apply water penalty when event fails with water penalty', () => {
      const waterPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'water', amount: 10 },
      }
      useGameStore.setState({ currentEvent: waterPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'water', amount: 10 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      expect(state.resources.water).toBe(50 - 10)
    })

    it('should apply money penalty when event fails with money penalty', () => {
      const moneyPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'money', amount: 30 },
      }
      useGameStore.setState({ currentEvent: moneyPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'money', amount: 30 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      expect(state.resources.money).toBe(200 - 30)
    })

    it('should apply delay penalty to progress when event fails', () => {
      const delayPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'delay', amount: 3 },
      }
      useGameStore.setState({ currentEvent: delayPenaltyEvent, progressInCountry: 5 })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'delay', amount: 3 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      expect(state.progressInCountry).toBe(5 - 3)
    })

    it('should reduce penalty with 1 security crew (15% reduction)', () => {
      // Set up 1 security crew member
      const crewWithOneSecurity: CrewMember[] = [
        { id: 'crew-1', name: 'Crew 1', role: 'security', avatar: '👷' },
        { id: 'crew-2', name: 'Crew 2', role: 'cook', avatar: '👨‍🍳' },
        { id: 'crew-3', name: 'Crew 3', role: 'engineer', avatar: '🔧' },
        { id: 'crew-4', name: 'Crew 4', role: 'free', avatar: '😊' },
      ]
      useGameStore.setState({ crew: crewWithOneSecurity })

      const fuelPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }
      useGameStore.setState({ currentEvent: fuelPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      // 1 security = 0.85 multiplier, 20 * 0.85 = 17, floor = 17
      expect(state.resources.fuel).toBe(100 - 17)
    })

    it('should reduce penalty with 4 security crew (60% reduction)', () => {
      // Set up 4 security crew members
      const crewWithFourSecurity: CrewMember[] = [
        { id: 'crew-1', name: 'Crew 1', role: 'security', avatar: '👷' },
        { id: 'crew-2', name: 'Crew 2', role: 'security', avatar: '👨‍🍳' },
        { id: 'crew-3', name: 'Crew 3', role: 'security', avatar: '🔧' },
        { id: 'crew-4', name: 'Crew 4', role: 'security', avatar: '😊' },
      ]
      useGameStore.setState({ crew: crewWithFourSecurity })

      const fuelPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }
      useGameStore.setState({ currentEvent: fuelPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      // 4 security = 0.40 multiplier, 20 * 0.40 = 8
      expect(state.resources.fuel).toBe(100 - 8)
    })

    it('should not apply penalty when event succeeds', () => {
      const successResult: EventResult = {
        success: true,
        total: 15,
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(successResult)

      const state = useGameStore.getState()
      // Resources should not be changed (except normal behavior)
      expect(state.resources.fuel).toBe(100)
      expect(state.resources.food).toBe(50)
      expect(state.resources.water).toBe(50)
      expect(state.resources.money).toBe(200)
    })

    it('should not apply penalty when no eventResult is provided', () => {
      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent() // No parameter

      const state = useGameStore.getState()
      // Resources should not be changed
      expect(state.resources.fuel).toBe(100)
      expect(state.resources.food).toBe(50)
    })

    it('should not go below 0 for resource penalties', () => {
      useGameStore.setState({ resources: { food: 50, fuel: 5, water: 50, money: 200 } })

      const fuelPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }
      useGameStore.setState({ currentEvent: fuelPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      expect(state.resources.fuel).toBe(0) // Should not go below 0
    })

    it('should not go below 0 for progress penalties', () => {
      useGameStore.setState({ progressInCountry: 1 })

      const delayPenaltyEvent = {
        ...mockEvent,
        penalty: { type: 'delay', amount: 5 },
      }
      useGameStore.setState({ currentEvent: delayPenaltyEvent })

      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'delay', amount: 5 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      const state = useGameStore.getState()
      expect(state.progressInCountry).toBe(0) // Should not go below 0
    })

    it('should clear currentEvent after resolution with penalty', () => {
      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      expect(useGameStore.getState().currentEvent).toBeNull()
    })

    it('should clear selectedCards after resolution with penalty', () => {
      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      expect(useGameStore.getState().selectedCards).toEqual([])
    })

    it('should replenish hand after resolution with penalty', () => {
      const failedResult: EventResult = {
        success: false,
        total: 5,
        penalty: { type: 'resource', resource: 'fuel', amount: 20 },
      }

      const { resolveCurrentEvent } = useGameStore.getState()
      resolveCurrentEvent(failedResult)

      expect(useGameStore.getState().cardHand).toHaveLength(3)
    })
  })

  describe('shop cart state', () => {
    describe('initial shop state', () => {
      it('should have empty shopCart initially', () => {
        const state = useGameStore.getState()
        expect(state.shopCart).toEqual({ food: 0, fuel: 0, water: 0 })
      })

      it('should have empty playedMiniGames Set initially', () => {
        const state = useGameStore.getState()
        expect(state.playedMiniGames.size).toBe(0)
      })

      it('should have empty takenQuizzes Set initially', () => {
        const state = useGameStore.getState()
        expect(state.takenQuizzes.size).toBe(0)
      })
    })

    describe('updateShopCart', () => {
      it('should update food in cart', () => {
        const { updateShopCart } = useGameStore.getState()
        updateShopCart('food', 10)

        const state = useGameStore.getState()
        expect(state.shopCart.food).toBe(10)
      })

      it('should update fuel in cart', () => {
        const { updateShopCart } = useGameStore.getState()
        updateShopCart('fuel', 20)

        const state = useGameStore.getState()
        expect(state.shopCart.fuel).toBe(20)
      })

      it('should update water in cart', () => {
        const { updateShopCart } = useGameStore.getState()
        updateShopCart('water', 15)

        const state = useGameStore.getState()
        expect(state.shopCart.water).toBe(15)
      })

      it('should not allow negative amounts', () => {
        const { updateShopCart } = useGameStore.getState()
        updateShopCart('food', -5)

        const state = useGameStore.getState()
        expect(state.shopCart.food).toBe(0)
      })
    })

    describe('purchaseResources', () => {
      const prices = { food: 4, fuel: 3, water: 2 }

      beforeEach(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 100, water: 50, money: 200 },
          shopCart: { food: 10, fuel: 10, water: 10 },
        })
      })

      it('should add resources from cart', () => {
        const { purchaseResources } = useGameStore.getState()
        purchaseResources(prices)

        const state = useGameStore.getState()
        expect(state.resources.food).toBe(60)  // 50 + 10
        expect(state.resources.fuel).toBe(110) // 100 + 10
        expect(state.resources.water).toBe(60) // 50 + 10
      })

      it('should deduct money for purchase', () => {
        const { purchaseResources } = useGameStore.getState()
        purchaseResources(prices)

        const state = useGameStore.getState()
        // (10 * 4) + (10 * 3) + (10 * 2) = 40 + 30 + 20 = 90
        expect(state.resources.money).toBe(200 - 90)
      })

      it('should reset cart after purchase', () => {
        const { purchaseResources } = useGameStore.getState()
        purchaseResources(prices)

        const state = useGameStore.getState()
        expect(state.shopCart).toEqual({ food: 0, fuel: 0, water: 0 })
      })

      it('should not purchase if cannot afford', () => {
        useGameStore.setState({
          resources: { food: 50, fuel: 100, water: 50, money: 50 },
          shopCart: { food: 10, fuel: 10, water: 10 },
        })

        const { purchaseResources } = useGameStore.getState()
        purchaseResources(prices)

        const state = useGameStore.getState()
        // Should not change
        expect(state.resources.food).toBe(50)
        expect(state.resources.money).toBe(50)
        expect(state.shopCart).toEqual({ food: 10, fuel: 10, water: 10 })
      })
    })

    describe('clearShopCart', () => {
      it('should reset cart to empty', () => {
        useGameStore.setState({
          shopCart: { food: 10, fuel: 20, water: 15 },
        })

        const { clearShopCart } = useGameStore.getState()
        clearShopCart()

        const state = useGameStore.getState()
        expect(state.shopCart).toEqual({ food: 0, fuel: 0, water: 0 })
      })
    })
  })

  describe('activity tracking', () => {
    describe('hasMiniGameBeenPlayed', () => {
      it('should return false for unplayed country', () => {
        const { hasMiniGameBeenPlayed } = useGameStore.getState()
        expect(hasMiniGameBeenPlayed('france')).toBe(false)
      })

      it('should return true after completing mini-game', () => {
        // Set up and complete mini-game
        const franceMiniGame = getMiniGameByCountryId('france')!
        useGameStore.setState({
          currentMiniGame: franceMiniGame,
          currentCountryIndex: 0, // France
          resources: { ...STARTING_RESOURCES },
        })

        const { completeMiniGame, hasMiniGameBeenPlayed } = useGameStore.getState()
        completeMiniGame(10, 10)

        expect(hasMiniGameBeenPlayed('france')).toBe(true)
      })
    })

    describe('hasQuizBeenTaken', () => {
      it('should return false for untaken country', () => {
        const { hasQuizBeenTaken } = useGameStore.getState()
        expect(hasQuizBeenTaken('france')).toBe(false)
      })

      it('should return true after completing quiz', () => {
        // Set up and complete quiz
        const franceQuiz = getQuizByCountryId('france')!
        // Build correct answers map from actual quiz questions
        const correctAnswers = new Map<string, string>()
        franceQuiz.questions.forEach(q => {
          correctAnswers.set(q.id, q.correctAnswer)
        })
        useGameStore.setState({
          currentQuiz: franceQuiz,
          quizAnswers: correctAnswers,
          currentCountryIndex: 0, // France
          resources: { ...STARTING_RESOURCES },
        })

        const { completeQuiz, hasQuizBeenTaken } = useGameStore.getState()
        completeQuiz()

        expect(hasQuizBeenTaken('france')).toBe(true)
      })
    })

    describe('initializeGame resets activity tracking', () => {
      it('should reset playedMiniGames', () => {
        useGameStore.setState({
          playedMiniGames: new Set(['france', 'germany']),
        })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().playedMiniGames.size).toBe(0)
      })

      it('should reset takenQuizzes', () => {
        useGameStore.setState({
          takenQuizzes: new Set(['france', 'germany']),
        })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().takenQuizzes.size).toBe(0)
      })

      it('should reset shopCart', () => {
        useGameStore.setState({
          shopCart: { food: 10, fuel: 20, water: 15 },
        })

        const { initializeGame } = useGameStore.getState()
        initializeGame()

        expect(useGameStore.getState().shopCart).toEqual({ food: 0, fuel: 0, water: 0 })
      })
    })
  })
})
