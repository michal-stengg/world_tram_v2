import { describe, it, expect } from 'vitest'
import { processStationArrival } from '../../logic/station'
import { MAX_RESOURCES } from '../../data/constants'
import type { Country } from '../../types'

describe('station logic', () => {
  // Mock country data for testing
  const mockCountry: Country = {
    id: 'france',
    name: 'France',
    icon: '🗼',
    landmark: 'Eiffel Tower in Paris',
    distanceRequired: 10,
  }

  const anotherCountry: Country = {
    id: 'japan',
    name: 'Japan',
    icon: '🗻',
    landmark: 'Mount Fuji',
    distanceRequired: 10,
  }

  describe('processStationArrival', () => {
    describe('water refill calculation', () => {
      it('should refill water to max when current water is 0', () => {
        const result = processStationArrival(mockCountry, 3, 0)
        expect(result.waterRefill).toBe(MAX_RESOURCES.water)
      })

      it('should refill water to max when current water is 50', () => {
        const result = processStationArrival(mockCountry, 3, 50)
        expect(result.waterRefill).toBe(MAX_RESOURCES.water - 50)
      })

      it('should refill water to max when current water is 80', () => {
        const result = processStationArrival(mockCountry, 3, 80)
        expect(result.waterRefill).toBe(MAX_RESOURCES.water - 80)
      })

      it('should refill zero water when already at max', () => {
        const result = processStationArrival(mockCountry, 3, MAX_RESOURCES.water)
        expect(result.waterRefill).toBe(0)
      })
    })

    describe('money earned calculation', () => {
      it('should earn base money with security stat of 1', () => {
        const result = processStationArrival(mockCountry, 1, 50)
        // Base money (10) + security (1) * multiplier (5) = 15
        expect(result.moneyEarned).toBe(15)
      })

      it('should earn more money with higher security stat', () => {
        const lowSecurity = processStationArrival(mockCountry, 1, 50)
        const highSecurity = processStationArrival(mockCountry, 6, 50)
        expect(highSecurity.moneyEarned).toBeGreaterThan(lowSecurity.moneyEarned)
      })

      it('should scale money earned linearly with security stat', () => {
        const result1 = processStationArrival(mockCountry, 1, 50)
        const result3 = processStationArrival(mockCountry, 3, 50)
        const result6 = processStationArrival(mockCountry, 6, 50)

        // Base (10) + stat * multiplier (5)
        expect(result1.moneyEarned).toBe(15) // 10 + 1*5
        expect(result3.moneyEarned).toBe(25) // 10 + 3*5
        expect(result6.moneyEarned).toBe(40) // 10 + 6*5
      })

      it('should handle security stat of 0', () => {
        const result = processStationArrival(mockCountry, 0, 50)
        expect(result.moneyEarned).toBe(10) // Just base money
      })
    })

    describe('with different countries', () => {
      it('should return same rewards for different countries (no country-specific bonuses yet)', () => {
        const franceResult = processStationArrival(mockCountry, 3, 50)
        const japanResult = processStationArrival(anotherCountry, 3, 50)

        expect(franceResult.waterRefill).toBe(japanResult.waterRefill)
        expect(franceResult.moneyEarned).toBe(japanResult.moneyEarned)
      })
    })

    describe('return type', () => {
      it('should return a StationReward object with correct properties', () => {
        const result = processStationArrival(mockCountry, 3, 50)

        expect(result).toHaveProperty('waterRefill')
        expect(result).toHaveProperty('moneyEarned')
        expect(typeof result.waterRefill).toBe('number')
        expect(typeof result.moneyEarned).toBe('number')
      })

      it('should not return negative values', () => {
        const result = processStationArrival(mockCountry, 0, MAX_RESOURCES.water)

        expect(result.waterRefill).toBeGreaterThanOrEqual(0)
        expect(result.moneyEarned).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
