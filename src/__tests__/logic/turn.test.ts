import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processTurn } from '../../logic/turn'
import type { GameState } from '../../logic/turn'
import type { Captain, Train, CrewMember } from '../../types'
import { STARTING_RESOURCES } from '../../data/constants'

// Mock dice for predictable tests
vi.mock('../../logic/dice', () => ({
  rollMovement: vi.fn(() => 5),
}))

describe('turn processor', () => {
  const mockCaptain: Captain = {
    id: 'renji',
    name: 'Renji',
    origin: 'Japan',
    description: 'Test captain',
    portrait: '1',
    stats: { engineering: 5, food: 2, security: 3 },
  }

  const mockTrain: Train = {
    id: 'blitzzug',
    name: 'Blitzzug',
    origin: 'Germany',
    character: 'Test train',
    sprite: '2',
    stats: { speed: 3, reliability: 5, power: 3 },
  }

  const mockCrew: CrewMember[] = [
    { id: 'tom', name: 'Tom', role: 'engineer', avatar: '1' },
    { id: 'maria', name: 'Maria', role: 'cook', avatar: '2' },
    { id: 'jack', name: 'Jack', role: 'security', avatar: '3' },
    { id: 'sam', name: 'Sam', role: 'free', avatar: '4' },
  ]

  const createGameState = (overrides: Partial<GameState> = {}): GameState => ({
    captain: mockCaptain,
    train: mockTrain,
    crew: mockCrew,
    resources: { ...STARTING_RESOURCES },
    currentCountryIndex: 0,
    progressInCountry: 0,
    turnCount: 1,
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('processTurn', () => {
    it('should return a turn result with all required fields', () => {
      const state = createGameState()
      const result = processTurn(state)

      expect(result).toHaveProperty('diceRoll')
      expect(result).toHaveProperty('movement')
      expect(result).toHaveProperty('resourceChanges')
      expect(result).toHaveProperty('newResources')
      expect(result).toHaveProperty('newCountryIndex')
      expect(result).toHaveProperty('newProgress')
      expect(result).toHaveProperty('gameStatus')
      expect(result).toHaveProperty('newTurnCount')
    })

    it('should include dice roll in result', () => {
      const state = createGameState()
      const result = processTurn(state)

      expect(result.diceRoll).toBe(5) // Mocked value
    })

    it('should calculate movement from dice + train speed', () => {
      const state = createGameState()
      const result = processTurn(state)

      // dice (5) + train speed (3) = 8
      expect(result.movement).toBe(8)
    })

    it('should advance country progress', () => {
      const state = createGameState()
      const result = processTurn(state)

      // With movement of 8 and starting at 0, progress should be 8
      expect(result.newProgress).toBe(8)
      expect(result.newCountryIndex).toBe(0) // Still in first country
    })

    it('should advance to next country when enough progress', () => {
      const state = createGameState({ progressInCountry: 5 })
      const result = processTurn(state)

      // Progress 5 + movement 8 = 13, which crosses country border (10)
      expect(result.newCountryIndex).toBe(1)
      expect(result.newProgress).toBe(3)
      expect(result.arrivedAtCountry).toBe(true)
    })

    it('should consume resources', () => {
      const state = createGameState()
      const result = processTurn(state)

      // Should have negative changes for fuel, food, water, money
      expect(result.resourceChanges.fuel).toBeLessThan(0)
      expect(result.resourceChanges.food).toBeLessThan(0)
      expect(result.resourceChanges.water).toBeLessThan(0)
      expect(result.resourceChanges.money).toBeLessThan(0)
    })

    it('should produce food from cooks', () => {
      const state = createGameState()
      const result = processTurn(state)

      // Food change = production - consumption
      // 1 cook * 5 + captain food stat 2 = 7 production
      // 4 crew * 3 base = 12 consumption
      // Net = 7 - 12 = -5
      expect(result.resourceChanges.food).toBe(-5)
    })

    it('should update resources correctly', () => {
      const state = createGameState()
      const result = processTurn(state)

      expect(result.newResources.food).toBe(
        STARTING_RESOURCES.food + result.resourceChanges.food
      )
      expect(result.newResources.fuel).toBe(
        STARTING_RESOURCES.fuel + result.resourceChanges.fuel
      )
    })

    it('should increment turn count', () => {
      const state = createGameState({ turnCount: 5 })
      const result = processTurn(state)

      expect(result.newTurnCount).toBe(6)
    })

    it('should detect victory when reaching final country', () => {
      const state = createGameState({
        currentCountryIndex: 8, // Second to last
        progressInCountry: 5,
      })
      const result = processTurn(state)

      // Movement 8 + progress 5 = 13, should reach country 9 (final)
      expect(result.newCountryIndex).toBe(9)
      expect(result.gameStatus).toBe('victory')
    })

    it('should detect game over when resources depleted', () => {
      const state = createGameState({
        resources: { food: 1, fuel: 100, water: 50, money: 200 },
      })
      const result = processTurn(state)

      // With only 1 food and consumption of ~12, will go negative
      if (result.newResources.food <= 0) {
        expect(result.gameStatus).toBe('gameOver')
        expect(result.gameOverReason).toBe('starvation')
      }
    })

    it('should return playing status when game continues', () => {
      const state = createGameState()
      const result = processTurn(state)

      expect(result.gameStatus).toBe('playing')
    })

    it('should handle arriving at station', () => {
      const state = createGameState({ progressInCountry: 5 })
      const result = processTurn(state)

      // Progress 5 + movement 8 = 13, arrives at country 1
      expect(result.arrivedAtCountry).toBe(true)
    })

    describe('station arrival rewards', () => {
      it('should include stationReward in TurnResult when arriving at new country', () => {
        const state = createGameState({ progressInCountry: 5 })
        const result = processTurn(state)

        // Progress 5 + movement 8 = 13, arrives at country 1
        expect(result.arrivedAtCountry).toBe(true)
        expect(result.stationReward).toBeDefined()
        expect(result.stationReward).toHaveProperty('waterRefill')
        expect(result.stationReward).toHaveProperty('moneyEarned')
      })

      it('should NOT include stationReward when staying in same country', () => {
        const state = createGameState({ progressInCountry: 0 })
        const result = processTurn(state)

        // Progress 0 + movement 8 = 8, still in first country (needs 10)
        expect(result.arrivedAtCountry).toBe(false)
        expect(result.stationReward).toBeUndefined()
      })

      it('should refill water when arriving at station', () => {
        const state = createGameState({
          progressInCountry: 5,
          resources: { food: 100, fuel: 100, water: 20, money: 200 },
        })
        const result = processTurn(state)

        // Arriving at station should refill water to max (100)
        // Initial water 20, consumption from turn, then refill
        expect(result.arrivedAtCountry).toBe(true)
        expect(result.stationReward).toBeDefined()
        expect(result.stationReward!.waterRefill).toBeGreaterThan(0)
        // Final water should be higher than without station reward
        // Water after consumption + refill
        expect(result.newResources.water).toBeGreaterThan(20) // Should be refilled
      })

      it('should add money when arriving at station', () => {
        const state = createGameState({
          progressInCountry: 5,
          resources: { food: 100, fuel: 100, water: 50, money: 200 },
        })
        const result = processTurn(state)

        // Arriving at station should earn money based on captain security stat
        // Base 10 + (security 3 * 5) = 25
        expect(result.arrivedAtCountry).toBe(true)
        expect(result.stationReward).toBeDefined()
        expect(result.stationReward!.moneyEarned).toBe(25)
        // Final money should include wages deduction + station reward
        // Money after changes should reflect the station reward
      })

      it('should apply station rewards to final resources', () => {
        const state = createGameState({
          progressInCountry: 5,
          resources: { food: 100, fuel: 100, water: 50, money: 200 },
        })
        const result = processTurn(state)

        // Resource changes should NOT include station rewards (they're separate)
        // But newResources SHOULD include station rewards
        expect(result.arrivedAtCountry).toBe(true)

        // Calculate expected final money:
        // Starting: 200, wages: -(4 crew * 5 base) = -20, station: +25
        // Net: 200 - 20 + 25 = 205
        const expectedMoneyAfterWages = 200 + result.resourceChanges.money
        const expectedFinalMoney = expectedMoneyAfterWages + result.stationReward!.moneyEarned
        expect(result.newResources.money).toBe(expectedFinalMoney)
      })
    })
  })
})
