import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../../stores/gameStore'
import type { GameScreen, Captain, Train, CrewMember } from '../../types'
import { STARTING_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import { cycleRole } from '../../logic/crew'

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
})
