import { describe, it, expect } from 'vitest'
import { calculateResourcePreview } from '../../logic/resourcePreview'
import type { CrewMember, Captain, Train } from '../../types'
import {
  BASE_FOOD_CONSUMPTION,
  BASE_WATER_CONSUMPTION,
  BASE_MONEY_WAGES,
  COOK_FOOD_PRODUCTION,
} from '../../data/constants'

describe('calculateResourcePreview', () => {
  const mockCaptain: Captain = {
    id: 'captain-1',
    name: 'Test Captain',
    origin: 'Test',
    description: 'Test description',
    portrait: '1',
    stats: { engineering: 3, food: 2, security: 3 },
  }

  const mockTrain: Train = {
    id: 'train-1',
    name: 'Test Train',
    origin: 'Test',
    character: 'Test character',
    sprite: '1',
    stats: { speed: 3, reliability: 3, power: 3 },
  }

  const mockCrew: CrewMember[] = [
    { id: 'tom', name: 'Tom', role: 'engineer', avatar: '1' },
    { id: 'maria', name: 'Maria', role: 'cook', avatar: '2' },
    { id: 'jack', name: 'Jack', role: 'security', avatar: '3' },
    { id: 'sam', name: 'Sam', role: 'free', avatar: '4' },
  ]

  describe('returns zeros when captain or train is null', () => {
    it('returns zeros when captain is null', () => {
      const result = calculateResourcePreview(mockCrew, null, mockTrain)
      expect(result).toEqual({ food: 0, fuel: 0, water: 0, money: 0 })
    })

    it('returns zeros when train is null', () => {
      const result = calculateResourcePreview(mockCrew, mockCaptain, null)
      expect(result).toEqual({ food: 0, fuel: 0, water: 0, money: 0 })
    })

    it('returns zeros when both are null', () => {
      const result = calculateResourcePreview(mockCrew, null, null)
      expect(result).toEqual({ food: 0, fuel: 0, water: 0, money: 0 })
    })
  })

  describe('food preview', () => {
    it('calculates food delta correctly with one cook', () => {
      const result = calculateResourcePreview(mockCrew, mockCaptain, mockTrain)
      // Production: 1 cook * COOK_FOOD_PRODUCTION + captain food stat (2)
      // Consumption: 4 crew * BASE_FOOD_CONSUMPTION
      const expectedProduction = COOK_FOOD_PRODUCTION + mockCaptain.stats.food
      const expectedConsumption = mockCrew.length * BASE_FOOD_CONSUMPTION
      expect(result.food).toBe(expectedProduction - expectedConsumption)
    })

    it('increases food production with more cooks', () => {
      const twoCooks: CrewMember[] = [
        { id: 'a', name: 'A', role: 'cook', avatar: '1' },
        { id: 'b', name: 'B', role: 'cook', avatar: '2' },
      ]
      const result = calculateResourcePreview(twoCooks, mockCaptain, mockTrain)
      const expectedProduction = 2 * COOK_FOOD_PRODUCTION + mockCaptain.stats.food
      const expectedConsumption = 2 * BASE_FOOD_CONSUMPTION
      expect(result.food).toBe(expectedProduction - expectedConsumption)
    })
  })

  describe('fuel preview', () => {
    it('calculates negative fuel delta (consumption)', () => {
      const result = calculateResourcePreview(mockCrew, mockCaptain, mockTrain)
      expect(result.fuel).toBeLessThan(0)
    })

    it('reduces fuel consumption with engineers', () => {
      const noEngineers: CrewMember[] = [
        { id: 'a', name: 'A', role: 'cook', avatar: '1' },
        { id: 'b', name: 'B', role: 'cook', avatar: '2' },
      ]
      const oneEngineer: CrewMember[] = [
        { id: 'a', name: 'A', role: 'engineer', avatar: '1' },
        { id: 'b', name: 'B', role: 'cook', avatar: '2' },
      ]

      const resultNoEng = calculateResourcePreview(noEngineers, mockCaptain, mockTrain)
      const resultOneEng = calculateResourcePreview(oneEngineer, mockCaptain, mockTrain)

      // With an engineer, fuel consumption should be less (delta closer to 0)
      expect(resultOneEng.fuel).toBeGreaterThan(resultNoEng.fuel)
    })
  })

  describe('water preview', () => {
    it('calculates negative water delta based on crew size', () => {
      const result = calculateResourcePreview(mockCrew, mockCaptain, mockTrain)
      const expectedConsumption = mockCrew.length * BASE_WATER_CONSUMPTION
      expect(result.water).toBe(-expectedConsumption)
    })

    it('scales with crew size', () => {
      const smallCrew: CrewMember[] = [
        { id: 'a', name: 'A', role: 'cook', avatar: '1' },
      ]
      const largeCrew: CrewMember[] = [
        { id: 'a', name: 'A', role: 'cook', avatar: '1' },
        { id: 'b', name: 'B', role: 'cook', avatar: '2' },
        { id: 'c', name: 'C', role: 'cook', avatar: '3' },
      ]

      const smallResult = calculateResourcePreview(smallCrew, mockCaptain, mockTrain)
      const largeResult = calculateResourcePreview(largeCrew, mockCaptain, mockTrain)

      expect(smallResult.water).toBe(-1 * BASE_WATER_CONSUMPTION)
      expect(largeResult.water).toBe(-3 * BASE_WATER_CONSUMPTION)
    })
  })

  describe('money preview', () => {
    it('calculates negative money delta based on crew wages', () => {
      const result = calculateResourcePreview(mockCrew, mockCaptain, mockTrain)
      const expectedWages = mockCrew.length * BASE_MONEY_WAGES
      expect(result.money).toBe(-expectedWages)
    })
  })

  describe('empty crew', () => {
    it('handles empty crew array', () => {
      const result = calculateResourcePreview([], mockCaptain, mockTrain)
      // No crew means no consumption or wages
      expect(result.food).toBe(mockCaptain.stats.food) // Just captain's food production
      expect(result.water).toBe(0)
      expect(result.money).toBe(0)
    })
  })
})
