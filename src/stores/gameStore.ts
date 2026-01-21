import { create } from 'zustand'
import type { GameScreen, Captain, Train, Resources, CrewMember } from '../types'
import { STARTING_RESOURCES } from '../data/constants'
import { startingCrew } from '../data/crew'
import { processTurn } from '../logic/turn'
import type { TurnResult } from '../logic/turn'
import type { GameOverReason } from '../logic/conditions'
import { cycleRole } from '../logic/crew'
import type { BonusCard } from '../data/cards'
import type { GameEvent } from '../data/events'
import { drawInitialHand, playCards, replenishHand } from '../logic/cards'

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
  resolveCurrentEvent: () => void
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

  resolveCurrentEvent: () => {
    const state = get()
    if (!state.currentEvent) {
      return
    }

    // Remove played cards from hand
    const handAfterPlay = playCards(state.cardHand, state.selectedCards)
    // Replenish hand back to 3 cards
    const newHand = replenishHand(handAfterPlay)

    set({
      cardHand: newHand,
      currentEvent: null,
      selectedCards: [],
    })
  },
}))
