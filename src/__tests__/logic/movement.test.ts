import { describe, it, expect } from 'vitest'
import { calculateMovement, advanceProgress } from '../../logic/movement'
import { DISTANCE_PER_COUNTRY } from '../../data/constants'

describe('movement logic', () => {
  describe('calculateMovement', () => {
    it('should return dice roll plus train speed', () => {
      expect(calculateMovement(5, 3)).toBe(8)
      expect(calculateMovement(0, 5)).toBe(5)
      expect(calculateMovement(10, 3)).toBe(13)
    })

    it('should handle zero speed', () => {
      expect(calculateMovement(5, 0)).toBe(5)
    })

    it('should handle zero dice roll', () => {
      expect(calculateMovement(0, 3)).toBe(3)
    })
  })

  describe('advanceProgress', () => {
    const countryDistance = DISTANCE_PER_COUNTRY // 10

    it('should add movement to current progress', () => {
      const result = advanceProgress(0, 5, countryDistance, 0)
      expect(result.newProgress).toBe(5)
      expect(result.arrivedAtNextCountry).toBe(false)
      expect(result.newCountryIndex).toBe(0)
    })

    it('should advance to next country when progress exceeds distance', () => {
      const result = advanceProgress(5, 8, countryDistance, 0)
      // 5 + 8 = 13, which is >= 10, so we move to next country
      // Overflow is 13 - 10 = 3
      expect(result.arrivedAtNextCountry).toBe(true)
      expect(result.newCountryIndex).toBe(1)
      expect(result.newProgress).toBe(3)
    })

    it('should handle exactly reaching the country border', () => {
      const result = advanceProgress(5, 5, countryDistance, 0)
      // 5 + 5 = 10, which is exactly the distance
      expect(result.arrivedAtNextCountry).toBe(true)
      expect(result.newCountryIndex).toBe(1)
      expect(result.newProgress).toBe(0)
    })

    it('should handle multiple country crossings in one movement', () => {
      const result = advanceProgress(5, 25, countryDistance, 0)
      // 5 + 25 = 30, which crosses 3 countries
      expect(result.arrivedAtNextCountry).toBe(true)
      expect(result.newCountryIndex).toBe(3)
      expect(result.newProgress).toBe(0)
    })

    it('should start from current country index', () => {
      const result = advanceProgress(5, 8, countryDistance, 3)
      expect(result.newCountryIndex).toBe(4)
    })

    it('should handle staying in same country', () => {
      const result = advanceProgress(3, 2, countryDistance, 5)
      expect(result.arrivedAtNextCountry).toBe(false)
      expect(result.newCountryIndex).toBe(5)
      expect(result.newProgress).toBe(5)
    })

    it('should cap country index at maximum (9 for 10 countries)', () => {
      const result = advanceProgress(5, 100, countryDistance, 8)
      // Even with huge movement, can't go past country 9
      expect(result.newCountryIndex).toBeLessThanOrEqual(9)
    })
  })
})
