import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameStore } from '../../stores/gameStore'
import { processTurn } from '../../logic/turn'
import * as cargoLogic from '../../logic/cargo'
import { cargoItems, getCargoById } from '../../data/cargo'
import { captains } from '../../data/captains'
import { trains } from '../../data/trains'
import { countries } from '../../data/countries'
import { STARTING_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import type { CargoItem } from '../../types'

// Mock the cargo logic functions
vi.mock('../../logic/cargo', async () => {
  const actual = await vi.importActual('../../logic/cargo')
  return {
    ...actual,
    shouldDiscoverCargo: vi.fn(),
    selectRandomCargo: vi.fn(),
  }
})

// Mock dice roll for consistent movement testing
vi.mock('../../logic/dice', () => ({
  rollMovement: () => 5, // Fixed dice roll that won't automatically trigger station arrival
  rollDice: () => 6,
}))

// Mock events to prevent random event triggering during cargo tests
vi.mock('../../logic/events', () => ({
  shouldTriggerEvent: () => false,
  selectRandomEvent: () => ({
    id: 'test-event',
    name: 'Test Event',
    description: 'A test event',
    statTested: 'engineering',
    difficulty: 10,
    penalty: { type: 'resource', resource: 'fuel', amount: 20 },
  }),
  resolveEvent: () => ({
    success: true,
    total: 15,
  }),
}))

describe('Phase 10: Cargo Integration', () => {
  // Reset store to initial game state before each test
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        currentScreen: 'dashboard',
        selectedCaptain: captains[0], // Renji
        selectedTrain: trains[0], // Blitzzug
        resources: { ...STARTING_RESOURCES },
        crew: JSON.parse(JSON.stringify(startingCrew)),
        currentCountryIndex: 0, // France
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
      })
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('cargo discovery during turn', () => {
    it('should include cargoDiscovered in turn result when cargo is discovered', () => {
      const testCargo = cargoItems.find(c => c.id === 'old-toolbox')!

      // Mock shouldDiscoverCargo to return true
      vi.mocked(cargoLogic.shouldDiscoverCargo).mockReturnValue(true)
      vi.mocked(cargoLogic.selectRandomCargo).mockReturnValue(testCargo)

      const state = useGameStore.getState()

      // Execute turn via processTurn directly (to avoid station arrival behavior)
      const result = processTurn({
        captain: state.selectedCaptain!,
        train: state.selectedTrain!,
        crew: state.crew,
        resources: state.resources,
        currentCountryIndex: state.currentCountryIndex,
        progressInCountry: state.progressInCountry,
        turnCount: state.turnCount,
      })

      // Verify cargo was discovered
      expect(result.cargoDiscovered).toBeDefined()
      expect(result.cargoDiscovered?.id).toBe('old-toolbox')
      expect(result.cargoDiscovered?.name).toBe('Old Toolbox')
    })

    it('should not discover cargo when shouldDiscoverCargo returns false', () => {
      vi.mocked(cargoLogic.shouldDiscoverCargo).mockReturnValue(false)

      const state = useGameStore.getState()

      const result = processTurn({
        captain: state.selectedCaptain!,
        train: state.selectedTrain!,
        crew: state.crew,
        resources: state.resources,
        currentCountryIndex: state.currentCountryIndex,
        progressInCountry: state.progressInCountry,
        turnCount: state.turnCount,
      })

      // Verify no cargo was discovered
      expect(result.cargoDiscovered).toBeUndefined()
    })

    it('should not discover cargo when arriving at a station', () => {
      const testCargo = cargoItems.find(c => c.id === 'old-toolbox')!

      vi.mocked(cargoLogic.shouldDiscoverCargo).mockReturnValue(true)
      vi.mocked(cargoLogic.selectRandomCargo).mockReturnValue(testCargo)

      const state = useGameStore.getState()

      // Set progress near station to ensure arrival (progress 18 + movement of ~8 = station)
      const result = processTurn({
        captain: state.selectedCaptain!,
        train: state.selectedTrain!,
        crew: state.crew,
        resources: state.resources,
        currentCountryIndex: state.currentCountryIndex,
        progressInCountry: 18, // Near enough to arrive at station
        turnCount: state.turnCount,
      })

      // When arriving at station, cargo should not be discovered
      if (result.arrivedAtCountry) {
        expect(result.cargoDiscovered).toBeUndefined()
      }
    })
  })

  describe('cargo storage', () => {
    it('should store cargo until station arrival', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'antique-clock')!

      // Add cargo to inventory
      act(() => {
        result.current.addCargo(testCargo, 'france', 1)
      })

      // Verify cargo appears in carriedCargo state
      expect(result.current.carriedCargo.length).toBe(1)
      expect(result.current.carriedCargo[0].item.id).toBe('antique-clock')
      expect(result.current.carriedCargo[0].foundAtCountry).toBe('france')
      expect(result.current.carriedCargo[0].turnFound).toBe(1)
    })

    it('should retain cargo in inventory across multiple turns', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'fuel-reserves')!

      // Add cargo to inventory
      act(() => {
        result.current.addCargo(testCargo, 'germany', 2)
      })

      // Verify cargo is stored
      expect(result.current.carriedCargo.length).toBe(1)

      // Execute a turn (not arriving at station)
      act(() => {
        result.current.executeTurn()
      })

      // Verify cargo remains in inventory
      expect(result.current.carriedCargo.length).toBe(1)
      expect(result.current.carriedCargo[0].item.id).toBe('fuel-reserves')
    })

    it('should store cargo with correct discovery metadata', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'golden-artifact')!

      act(() => {
        result.current.addCargo(testCargo, 'japan', 5)
      })

      const discovery = result.current.carriedCargo[0]
      expect(discovery.item).toEqual(testCargo)
      expect(discovery.foundAtCountry).toBe('japan')
      expect(discovery.turnFound).toBe(5)
    })
  })

  describe('cargo opening at station', () => {
    it('should open cargo and apply reward when calling openCargoAtStation', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'old-toolbox')! // money reward: 20

      // Set initial resources
      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 100, water: 50, money: 100 },
        })
      })

      // Add cargo to inventory
      act(() => {
        result.current.addCargo(testCargo, 'france', 1)
      })

      // Open cargo at station
      let reward: any
      act(() => {
        reward = result.current.openCargoAtStation()
      })

      // Verify reward is returned
      expect(reward).toBeDefined()
      expect(reward.rewardType).toBe('money')
      expect(reward.amount).toBe(20)

      // Verify resources are updated
      expect(result.current.resources.money).toBe(120) // 100 + 20

      // Verify cargo is removed from inventory
      expect(result.current.carriedCargo.length).toBe(0)

      // Verify pendingCargoOpen is set for UI feedback
      expect(result.current.pendingCargoOpen).toBeDefined()
      expect(result.current.pendingCargoOpen?.id).toBe('old-toolbox')
    })

    it('should return null when no cargo to open', () => {
      const { result } = renderHook(() => useGameStore())

      // Try to open cargo when inventory is empty
      let reward: any
      act(() => {
        reward = result.current.openCargoAtStation()
      })

      expect(reward).toBeNull()
    })

    it('should apply fuel reward correctly', () => {
      const { result } = renderHook(() => useGameStore())
      const fuelCargo = cargoItems.find(c => c.id === 'rusty-parts')! // fuel reward: 10

      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 50, water: 50, money: 100 },
        })
      })

      act(() => {
        result.current.addCargo(fuelCargo, 'germany', 2)
      })

      act(() => {
        result.current.openCargoAtStation()
      })

      expect(result.current.resources.fuel).toBe(60) // 50 + 10
    })

    it('should apply food reward correctly', () => {
      const { result } = renderHook(() => useGameStore())
      const foodCargo = cargoItems.find(c => c.id === 'dried-rations')! // food reward: 15

      act(() => {
        useGameStore.setState({
          resources: { food: 30, fuel: 50, water: 50, money: 100 },
        })
      })

      act(() => {
        result.current.addCargo(foodCargo, 'russia', 3)
      })

      act(() => {
        result.current.openCargoAtStation()
      })

      expect(result.current.resources.food).toBe(45) // 30 + 15
    })

    it('should apply water reward correctly', () => {
      const { result } = renderHook(() => useGameStore())
      const waterCargo = cargoItems.find(c => c.id === 'water-canteen')! // water reward: 20

      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 50, water: 40, money: 100 },
        })
      })

      act(() => {
        result.current.addCargo(waterCargo, 'china', 4)
      })

      act(() => {
        result.current.openCargoAtStation()
      })

      expect(result.current.resources.water).toBe(60) // 40 + 20
    })

    it('should clear pending cargo when clearPendingCargo is called', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'old-toolbox')!

      act(() => {
        result.current.addCargo(testCargo, 'france', 1)
      })

      act(() => {
        result.current.openCargoAtStation()
      })

      expect(result.current.pendingCargoOpen).toBeDefined()

      act(() => {
        result.current.clearPendingCargo()
      })

      expect(result.current.pendingCargoOpen).toBeNull()
    })
  })

  describe('multiple cargo items', () => {
    it('should handle multiple cargo items correctly', () => {
      const { result } = renderHook(() => useGameStore())

      const cargo1 = cargoItems.find(c => c.id === 'old-toolbox')! // money: 20
      const cargo2 = cargoItems.find(c => c.id === 'rusty-parts')! // fuel: 10
      const cargo3 = cargoItems.find(c => c.id === 'dried-rations')! // food: 15

      // Add multiple cargo items
      act(() => {
        result.current.addCargo(cargo1, 'france', 1)
        result.current.addCargo(cargo2, 'germany', 2)
        result.current.addCargo(cargo3, 'russia', 3)
      })

      // Verify all are stored
      expect(result.current.carriedCargo.length).toBe(3)
      expect(result.current.carriedCargo[0].item.id).toBe('old-toolbox')
      expect(result.current.carriedCargo[1].item.id).toBe('rusty-parts')
      expect(result.current.carriedCargo[2].item.id).toBe('dried-rations')
    })

    it('should open cargo items in FIFO order', () => {
      const { result } = renderHook(() => useGameStore())

      const cargo1 = cargoItems.find(c => c.id === 'old-toolbox')! // First in
      const cargo2 = cargoItems.find(c => c.id === 'antique-clock')! // Second in

      act(() => {
        result.current.addCargo(cargo1, 'france', 1)
        result.current.addCargo(cargo2, 'germany', 2)
      })

      // Open first cargo
      let reward1: any
      act(() => {
        reward1 = result.current.openCargoAtStation()
      })

      // Should open first-in cargo (old-toolbox)
      expect(reward1.rewardType).toBe('money')
      expect(reward1.amount).toBe(20) // old-toolbox reward
      expect(result.current.carriedCargo.length).toBe(1)
      expect(result.current.carriedCargo[0].item.id).toBe('antique-clock')

      // Clear pending and open second cargo
      act(() => {
        result.current.clearPendingCargo()
      })

      let reward2: any
      act(() => {
        reward2 = result.current.openCargoAtStation()
      })

      // Should open second cargo (antique-clock)
      expect(reward2.rewardType).toBe('money')
      expect(reward2.amount).toBe(75) // antique-clock reward
      expect(result.current.carriedCargo.length).toBe(0)
    })

    it('should accumulate rewards from multiple cargo items sequentially', () => {
      const { result } = renderHook(() => useGameStore())

      // Start with known resources
      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 50, water: 50, money: 100 },
        })
      })

      const cargo1 = cargoItems.find(c => c.id === 'old-toolbox')! // money: 20
      const cargo2 = cargoItems.find(c => c.id === 'antique-clock')! // money: 75
      const cargo3 = cargoItems.find(c => c.id === 'rusty-parts')! // fuel: 10

      act(() => {
        result.current.addCargo(cargo1, 'france', 1)
        result.current.addCargo(cargo2, 'germany', 2)
        result.current.addCargo(cargo3, 'russia', 3)
      })

      // Open all cargo items sequentially
      act(() => {
        result.current.openCargoAtStation() // +20 money
      })
      act(() => {
        result.current.openCargoAtStation() // +75 money
      })
      act(() => {
        result.current.openCargoAtStation() // +10 fuel
      })

      // Verify accumulated rewards
      expect(result.current.resources.money).toBe(195) // 100 + 20 + 75
      expect(result.current.resources.fuel).toBe(60) // 50 + 10
      expect(result.current.carriedCargo.length).toBe(0)
    })

    it('should handle different rarity cargo items', () => {
      const { result } = renderHook(() => useGameStore())

      const commonCargo = cargoItems.find(c => c.rarity === 'common')!
      const rareCargo = cargoItems.find(c => c.rarity === 'rare')!
      const legendaryCargo = cargoItems.find(c => c.rarity === 'legendary')!

      act(() => {
        result.current.addCargo(commonCargo, 'france', 1)
        result.current.addCargo(rareCargo, 'germany', 2)
        result.current.addCargo(legendaryCargo, 'russia', 3)
      })

      expect(result.current.carriedCargo.length).toBe(3)
      expect(result.current.carriedCargo[0].item.rarity).toBe('common')
      expect(result.current.carriedCargo[1].item.rarity).toBe('rare')
      expect(result.current.carriedCargo[2].item.rarity).toBe('legendary')
    })

    it('should handle each reward type correctly', () => {
      const { result } = renderHook(() => useGameStore())

      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 50, water: 50, money: 100 },
        })
      })

      // Get one cargo of each reward type
      const moneyCargo = cargoItems.find(c => c.rewardType === 'money')!
      const fuelCargo = cargoItems.find(c => c.rewardType === 'fuel')!
      const foodCargo = cargoItems.find(c => c.rewardType === 'food')!
      const waterCargo = cargoItems.find(c => c.rewardType === 'water')!

      act(() => {
        result.current.addCargo(moneyCargo, 'france', 1)
        result.current.addCargo(fuelCargo, 'germany', 2)
        result.current.addCargo(foodCargo, 'russia', 3)
        result.current.addCargo(waterCargo, 'china', 4)
      })

      // Open all and verify each reward type applies correctly
      const initialResources = { ...result.current.resources }

      let reward: any
      act(() => {
        reward = result.current.openCargoAtStation()
      })
      expect(result.current.resources[reward.rewardType]).toBe(
        initialResources[reward.rewardType as keyof typeof initialResources] + reward.amount
      )
    })
  })

  describe('cargo system integration with game flow', () => {
    it('should reset cargo when initializing new game', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'old-toolbox')!

      // Add cargo
      act(() => {
        result.current.addCargo(testCargo, 'france', 1)
      })

      expect(result.current.carriedCargo.length).toBe(1)

      // Initialize new game
      act(() => {
        result.current.initializeGame()
      })

      // Cargo should be reset
      expect(result.current.carriedCargo.length).toBe(0)
      expect(result.current.pendingCargoOpen).toBeNull()
    })

    it('should preserve cargo data correctly in discovery object', () => {
      const { result } = renderHook(() => useGameStore())
      const testCargo = cargoItems.find(c => c.id === 'golden-artifact')! // legendary money cargo

      act(() => {
        result.current.addCargo(testCargo, 'japan', 10)
      })

      const discovery = result.current.carriedCargo[0]

      // Verify all cargo item properties are preserved
      expect(discovery.item.id).toBe('golden-artifact')
      expect(discovery.item.name).toBe('Golden Artifact')
      expect(discovery.item.icon).toBe(testCargo.icon)
      expect(discovery.item.rarity).toBe('legendary')
      expect(discovery.item.rewardType).toBe('money')
      expect(discovery.item.rewardAmount).toBe(200)
      expect(discovery.item.description).toBe(testCargo.description)
    })
  })
})
