import { create } from 'zustand'
import type { GameScreen, Captain, Train, Resources, CrewMember, Cart, MiniGame, MiniGameResult, CargoItem, CargoDiscovery, CargoReward, CountryQuiz, QuizResult } from '../types'
import { STARTING_RESOURCES } from '../data/constants'
import { startingCrew } from '../data/crew'
import { processTurn } from '../logic/turn'
import type { TurnResult } from '../logic/turn'
import type { GameOverReason } from '../logic/conditions'
import { cycleRole, calculateSecurityBonus } from '../logic/crew'
import type { BonusCard } from '../data/cards'
import type { GameEvent } from '../data/events'
import type { EventResult } from '../logic/events'
import { drawInitialHand, playCards, replenishHand } from '../logic/cards'
import { canPurchaseCart } from '../logic/carts'
import { getCartById } from '../data/carts'
import { getMiniGameByCountryId } from '../data/minigames'
import { calculateMiniGameReward } from '../logic/minigames'
import { openCargo, applyCargoReward } from '../logic/cargo'
import { getQuizByCountryId } from '../data/quizzes'
import { calculateQuizReward, getQuizRating } from '../logic/quizzes'

interface GameState {
  currentScreen: GameScreen
  selectedCaptain: Captain | null
  selectedTrain: Train | null
  // Game state
  resources: Resources
  crew: CrewMember[]
  currentCountryIndex: number
  progressInCountry: number
  turnCount: number
  // Turn result state
  lastTurnResult: TurnResult | null
  gameOverReason: GameOverReason | null
  // Card hand state
  cardHand: BonusCard[]
  currentEvent: GameEvent | null
  selectedCards: string[]
  // Cart state
  ownedCarts: Cart[]
  // Mini-game state
  currentMiniGame: MiniGame | null
  lastMiniGameResult: MiniGameResult | null
  // Cargo state
  carriedCargo: CargoDiscovery[]
  pendingCargoOpen: CargoItem | null
  // Quiz state
  currentQuiz: CountryQuiz | null
  quizAnswers: Map<string, string>  // questionId -> selectedAnswer
  currentQuestionIndex: number
  lastQuizResult: QuizResult | null
}

interface GameActions {
  setScreen: (screen: GameScreen) => void
  goBack: () => void
  selectCaptain: (captain: Captain) => void
  selectTrain: (train: Train) => void
  resetSelection: () => void
  initializeGame: () => void
  executeTurn: () => void
  clearTurnResult: () => void
  cycleCrewRole: (crewMemberId: string) => void
  // Card actions
  initializeCards: () => void
  selectCard: (cardId: string) => void
  setCurrentEvent: (event: GameEvent | null) => void
  resolveCurrentEvent: (eventResult?: EventResult) => void
  // Cart actions
  purchaseCart: (cartId: string) => void
  // Mini-game actions
  startMiniGame: (countryId: string) => void
  completeMiniGame: (score: number, maxScore: number) => void
  skipMiniGame: () => void
  // Cargo actions
  addCargo: (item: CargoItem, countryId: string, turn: number) => void
  openCargoAtStation: () => CargoReward | null
  clearPendingCargo: () => void
  // Quiz actions
  startQuiz: (countryId: string) => void
  answerQuestion: (questionId: string, answer: string) => void
  nextQuestion: () => void
  completeQuiz: () => void
  skipQuiz: () => void
}

type GameStore = GameState & GameActions

// Navigation map for goBack functionality
// null means no back navigation (stay on current screen)
const screenHistory: Record<GameScreen, GameScreen | null> = {
  intro: null,              // no back from intro
  captainSelect: 'intro',
  trainSelect: 'captainSelect',
  dashboard: 'trainSelect',
  victory: null,            // no back from end screens
  gameOver: null,           // no back from end screens
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  currentScreen: 'intro',
  selectedCaptain: null,
  selectedTrain: null,
  // Game state
  resources: { ...STARTING_RESOURCES },
  crew: [...startingCrew],
  currentCountryIndex: 0,
  progressInCountry: 0,
  turnCount: 1,
  // Turn result state
  lastTurnResult: null,
  gameOverReason: null,
  // Card hand state
  cardHand: [],
  currentEvent: null,
  selectedCards: [],
  // Cart state
  ownedCarts: [],
  // Mini-game state
  currentMiniGame: null,
  lastMiniGameResult: null,
  // Cargo state
  carriedCargo: [],
  pendingCargoOpen: null,
  // Quiz state
  currentQuiz: null,
  quizAnswers: new Map(),
  currentQuestionIndex: 0,
  lastQuizResult: null,

  // Actions
  setScreen: (screen) => set({ currentScreen: screen }),

  goBack: () => set((state) => {
    const previousScreen = screenHistory[state.currentScreen]
    if (previousScreen) {
      return { currentScreen: previousScreen }
    }
    return state
  }),

  selectCaptain: (captain) => set({
    selectedCaptain: captain,
    currentScreen: 'trainSelect',
  }),

  selectTrain: (train) => {
    set({ selectedTrain: train })
    get().initializeGame()
    set({ currentScreen: 'dashboard' })
  },

  resetSelection: () => set({
    selectedCaptain: null,
    selectedTrain: null,
  }),

  initializeGame: () => set({
    resources: { ...STARTING_RESOURCES },
    crew: [...startingCrew],
    currentCountryIndex: 0,
    progressInCountry: 0,
    turnCount: 1,
    lastTurnResult: null,
    gameOverReason: null,
    cardHand: drawInitialHand(),
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
  }),

  executeTurn: () => {
    const state = get()
    const { selectedCaptain, selectedTrain, crew, resources, currentCountryIndex, progressInCountry, turnCount } = state

    // Can't execute turn without captain and train
    if (!selectedCaptain || !selectedTrain) return

    const result = processTurn({
      captain: selectedCaptain,
      train: selectedTrain,
      crew,
      resources,
      currentCountryIndex,
      progressInCountry,
      turnCount,
    })

    // Update state with turn result
    set({
      resources: result.newResources,
      currentCountryIndex: result.newCountryIndex,
      progressInCountry: result.newProgress,
      turnCount: result.newTurnCount,
      lastTurnResult: result,
    })

    // Handle game end navigation
    if (result.gameStatus === 'victory') {
      set({ currentScreen: 'victory' })
    } else if (result.gameStatus === 'gameOver') {
      set({
        currentScreen: 'gameOver',
        gameOverReason: result.gameOverReason ?? null,
      })
    }
  },

  clearTurnResult: () => set({ lastTurnResult: null }),

  cycleCrewRole: (crewMemberId: string) => set((state) => {
    const crewMember = state.crew.find(c => c.id === crewMemberId)
    if (!crewMember) {
      return state
    }

    const newRole = cycleRole(crewMember.role)
    const updatedCrew = state.crew.map(c =>
      c.id === crewMemberId ? { ...c, role: newRole } : c
    )

    return { crew: updatedCrew }
  }),

  // Card actions
  initializeCards: () => set({
    cardHand: drawInitialHand(),
    currentEvent: null,
    selectedCards: [],
  }),

  selectCard: (cardId: string) => set((state) => {
    const isSelected = state.selectedCards.includes(cardId)
    if (isSelected) {
      return { selectedCards: state.selectedCards.filter(id => id !== cardId) }
    } else {
      return { selectedCards: [...state.selectedCards, cardId] }
    }
  }),

  setCurrentEvent: (event: GameEvent | null) => set({
    currentEvent: event,
  }),

  resolveCurrentEvent: (eventResult?: EventResult) => {
    const state = get()
    if (!state.currentEvent) {
      return
    }

    // Apply penalties if event failed
    if (eventResult && !eventResult.success && eventResult.penalty) {
      const securityCount = state.crew.filter(c => c.role === 'security').length
      const securityMultiplier = calculateSecurityBonus(securityCount)
      const reducedAmount = Math.floor(eventResult.penalty.amount * securityMultiplier)

      const newResources = { ...state.resources }

      if (eventResult.penalty.resource) {
        const resource = eventResult.penalty.resource as keyof typeof newResources
        if (resource in newResources) {
          newResources[resource] = Math.max(0, newResources[resource] - reducedAmount)
        }
      }

      let newProgress = state.progressInCountry
      if (eventResult.penalty.type === 'delay') {
        newProgress = Math.max(0, state.progressInCountry - reducedAmount)
      }

      // Remove played cards from hand
      const handAfterPlay = playCards(state.cardHand, state.selectedCards)
      // Replenish hand back to 3 cards
      const newHand = replenishHand(handAfterPlay)

      set({
        resources: newResources,
        progressInCountry: newProgress,
        cardHand: newHand,
        currentEvent: null,
        selectedCards: [],
      })
    } else {
      // No penalty or success - just handle cards
      const handAfterPlay = playCards(state.cardHand, state.selectedCards)
      const newHand = replenishHand(handAfterPlay)

      set({
        cardHand: newHand,
        currentEvent: null,
        selectedCards: [],
      })
    }
  },

  purchaseCart: (cartId: string) => {
    const state = get()
    const cart = getCartById(cartId)

    // If cart not found, do nothing
    if (!cart) {
      return
    }

    // Check if player can afford it
    if (!canPurchaseCart(cart, state.resources.money)) {
      return
    }

    // Deduct price and add cart to owned carts
    set({
      resources: {
        ...state.resources,
        money: state.resources.money - cart.price,
      },
      ownedCarts: [...state.ownedCarts, cart],
    })
  },

  // Mini-game actions
  startMiniGame: (countryId: string) => {
    const miniGame = getMiniGameByCountryId(countryId)
    if (miniGame) {
      set({ currentMiniGame: miniGame })
    }
  },

  completeMiniGame: (score: number, maxScore: number) => {
    const state = get()
    const { currentMiniGame, resources } = state

    // If no current mini-game, do nothing
    if (!currentMiniGame) {
      return
    }

    // Calculate reward
    const reward = calculateMiniGameReward(score, maxScore, currentMiniGame.maxReward)

    // Create result object
    const result: MiniGameResult = {
      score,
      maxScore,
      reward,
    }

    // Apply reward to resources based on reward type
    const newResources = { ...resources }
    if (currentMiniGame.rewardType === 'food') {
      newResources.food = resources.food + reward
    } else if (currentMiniGame.rewardType === 'money') {
      newResources.money = resources.money + reward
    }

    // Update state
    set({
      resources: newResources,
      lastMiniGameResult: result,
      currentMiniGame: null,
    })
  },

  skipMiniGame: () => {
    set({
      currentMiniGame: null,
      lastMiniGameResult: null,
    })
  },

  // Cargo actions
  addCargo: (item: CargoItem, countryId: string, turn: number) => {
    const discovery: CargoDiscovery = {
      item,
      foundAtCountry: countryId,
      turnFound: turn,
    }
    set((state) => ({
      carriedCargo: [...state.carriedCargo, discovery],
    }))
  },

  openCargoAtStation: () => {
    const state = get()
    if (state.carriedCargo.length === 0) return null

    // Get first cargo item
    const [first, ...rest] = state.carriedCargo
    const reward = openCargo(first.item)

    // Apply reward to resources
    const newResources = applyCargoReward(state.resources, reward)

    set({
      carriedCargo: rest,
      pendingCargoOpen: first.item,
      resources: newResources,
    })

    return reward
  },

  clearPendingCargo: () => set({ pendingCargoOpen: null }),

  // Quiz actions
  startQuiz: (countryId: string) => {
    const quiz = getQuizByCountryId(countryId)
    if (quiz) {
      set({
        currentQuiz: quiz,
        quizAnswers: new Map(),
        currentQuestionIndex: 0,
      })
    }
  },

  answerQuestion: (questionId: string, answer: string) => {
    set((state) => {
      const newAnswers = new Map(state.quizAnswers)
      newAnswers.set(questionId, answer)
      return { quizAnswers: newAnswers }
    })
  },

  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: state.currentQuestionIndex + 1,
    }))
  },

  completeQuiz: () => {
    const state = get()
    const { currentQuiz, quizAnswers, resources } = state

    // If no current quiz, do nothing
    if (!currentQuiz) {
      return
    }

    // Calculate correct answers
    let correctCount = 0
    for (const question of currentQuiz.questions) {
      const userAnswer = quizAnswers.get(question.id)
      if (userAnswer === question.correctAnswer) {
        correctCount++
      }
    }

    // Calculate reward and rating
    const reward = calculateQuizReward(correctCount)
    const rating = getQuizRating(correctCount)

    // Create result object
    const result: QuizResult = {
      score: correctCount,
      totalQuestions: currentQuiz.questions.length,
      reward,
      rating,
    }

    // Apply reward to resources
    const newResources = {
      ...resources,
      money: resources.money + reward,
    }

    // Update state
    set({
      resources: newResources,
      lastQuizResult: result,
      currentQuiz: null,
    })
  },

  skipQuiz: () => {
    set({
      currentQuiz: null,
      quizAnswers: new Map(),
      currentQuestionIndex: 0,
    })
  },
}))
