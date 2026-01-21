import { describe, it, expect } from 'vitest'
import {
  calculateFuelConsumption,
  calculateFoodConsumption,
  calculateWaterConsumption,
  calculateWages,
  calculateFoodProduction,
  getCrewCountByRole,
  applyResourceChanges,
} from '../../logic/resources'
import {
  BASE_FUEL_CONSUMPTION,
  BASE_FOOD_CONSUMPTION,
  BASE_WATER_CONSUMPTION,
  BASE_MONEY_WAGES,
  COOK_FOOD_PRODUCTION,
  MAX_RESOURCES,
  ENGINEER_FUEL_SAVINGS,
} from '../../data/constants'
import type { CrewMember, Resources } from '../../types'

describe('resource logic', () => {
  const mockCrew: CrewMember[] = [
    { id: 'tom', name: 'Tom', role: 'engineer', avatar: '1' },
    { id: 'maria', name: 'Maria', role: 'cook', avatar: '2' },
    { id: 'jack', name: 'Jack', role: 'security', avatar: '3' },
    { id: 'sam', name: 'Sam', role: 'free', avatar: '4' },
  ]

  describe('calculateFuelConsumption', () => {
    it('should return base consumption for distance traveled with no engineers', () => {
      expect(calculateFuelConsumption(5, 3, 0)).toBe(BASE_FUEL_CONSUMPTION)
    })

    it('should reduce consumption with high train power', () => {
      const highPower = calculateFuelConsumption(5, 5, 0)
      const lowPower = calculateFuelConsumption(5, 1, 0)
      expect(highPower).toBeLessThanOrEqual(lowPower)
    })

    it('should not go below minimum consumption with no engineers', () => {
      expect(calculateFuelConsumption(1, 10, 0)).toBeGreaterThanOrEqual(1)
    })

    it('should reduce fuel consumption with engineers', () => {
      const withoutEngineers = calculateFuelConsumption(5, 3, 0)
      const withOneEngineer = calculateFuelConsumption(5, 3, 1)
      const withTwoEngineers = calculateFuelConsumption(5, 3, 2)

      // Each engineer reduces by ENGINEER_FUEL_SAVINGS (2)
      expect(withOneEngineer).toBe(withoutEngineers - ENGINEER_FUEL_SAVINGS)
      expect(withTwoEngineers).toBe(withoutEngineers - ENGINEER_FUEL_SAVINGS * 2)
    })

    it('should not allow fuel consumption to go below zero with many engineers', () => {
      // Even with many engineers, fuel consumption should never go negative
      const result = calculateFuelConsumption(5, 3, 10)
      expect(result).toBeGreaterThanOrEqual(0)
    })

    it('should handle negative engineer count as zero', () => {
      const withNegative = calculateFuelConsumption(5, 3, -1)
      const withZero = calculateFuelConsumption(5, 3, 0)
      expect(withNegative).toBe(withZero)
    })
  })

  describe('calculateFoodConsumption', () => {
    it('should return base consumption multiplied by crew count', () => {
      expect(calculateFoodConsumption(4)).toBe(BASE_FOOD_CONSUMPTION * 4)
    })

    it('should handle zero crew', () => {
      expect(calculateFoodConsumption(0)).toBe(0)
    })

    it('should scale with crew size', () => {
      expect(calculateFoodConsumption(2)).toBe(BASE_FOOD_CONSUMPTION * 2)
    })
  })

  describe('calculateWaterConsumption', () => {
    it('should return base consumption multiplied by crew count', () => {
      expect(calculateWaterConsumption(4)).toBe(BASE_WATER_CONSUMPTION * 4)
    })

    it('should handle zero crew', () => {
      expect(calculateWaterConsumption(0)).toBe(0)
    })
  })

  describe('calculateWages', () => {
    it('should return base wages for all crew', () => {
      expect(calculateWages(mockCrew)).toBe(BASE_MONEY_WAGES * mockCrew.length)
    })

    it('should handle empty crew', () => {
      expect(calculateWages([])).toBe(0)
    })
  })

  describe('calculateFoodProduction', () => {
    it('should produce food based on number of cooks', () => {
      const result = calculateFoodProduction(mockCrew, 2)
      // 1 cook * COOK_FOOD_PRODUCTION + captain food stat
      expect(result).toBe(COOK_FOOD_PRODUCTION * 1 + 2)
    })

    it('should increase with more cooks', () => {
      const twoCooks: CrewMember[] = [
        { id: 'a', name: 'A', role: 'cook', avatar: '1' },
        { id: 'b', name: 'B', role: 'cook', avatar: '2' },
      ]
      const result = calculateFoodProduction(twoCooks, 2)
      expect(result).toBe(COOK_FOOD_PRODUCTION * 2 + 2)
    })

    it('should still produce with zero cooks due to captain stat', () => {
      const noCooks: CrewMember[] = [
        { id: 'a', name: 'A', role: 'engineer', avatar: '1' },
      ]
      const result = calculateFoodProduction(noCooks, 3)
      expect(result).toBe(3) // Just captain stat
    })

    it('should handle zero captain food stat', () => {
      const result = calculateFoodProduction(mockCrew, 0)
      expect(result).toBe(COOK_FOOD_PRODUCTION * 1)
    })
  })

  describe('getCrewCountByRole', () => {
    it('should count engineers correctly', () => {
      expect(getCrewCountByRole(mockCrew, 'engineer')).toBe(1)
    })

    it('should count cooks correctly', () => {
      expect(getCrewCountByRole(mockCrew, 'cook')).toBe(1)
    })

    it('should return 0 when no crew has the role', () => {
      const noEngineers: CrewMember[] = [
        { id: 'a', name: 'A', role: 'cook', avatar: '1' },
      ]
      expect(getCrewCountByRole(noEngineers, 'engineer')).toBe(0)
    })

    it('should handle empty crew', () => {
      expect(getCrewCountByRole([], 'engineer')).toBe(0)
    })
  })

  describe('applyResourceChanges', () => {
    const startingResources: Resources = {
      food: 50,
      fuel: 100,
      water: 50,
      money: 200,
    }

    it('should apply positive changes', () => {
      const result = applyResourceChanges(startingResources, {
        food: 10,
        fuel: 0,
        water: 5,
        money: 50,
      })
      expect(result.food).toBe(60)
      expect(result.water).toBe(55)
      expect(result.money).toBe(250)
    })

    it('should apply negative changes', () => {
      const result = applyResourceChanges(startingResources, {
        food: -10,
        fuel: -20,
        water: -5,
        money: -30,
      })
      expect(result.food).toBe(40)
      expect(result.fuel).toBe(80)
      expect(result.water).toBe(45)
      expect(result.money).toBe(170)
    })

    it('should not go below zero', () => {
      const result = applyResourceChanges(startingResources, {
        food: -100,
        fuel: -200,
        water: -100,
        money: -500,
      })
      expect(result.food).toBe(0)
      expect(result.fuel).toBe(0)
      expect(result.water).toBe(0)
      expect(result.money).toBe(0)
    })

    it('should not exceed maximum', () => {
      const result = applyResourceChanges(startingResources, {
        food: 500,
        fuel: 500,
        water: 500,
        money: 5000,
      })
      expect(result.food).toBe(MAX_RESOURCES.food)
      expect(result.fuel).toBe(MAX_RESOURCES.fuel)
      expect(result.water).toBe(MAX_RESOURCES.water)
      expect(result.money).toBe(MAX_RESOURCES.money)
    })
  })
})
