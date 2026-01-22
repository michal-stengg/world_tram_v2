import { describe, it, expect } from 'vitest'
import { countryPrices, getPricesForCountry } from '../../data/shopPrices'

describe('shopPrices data', () => {
  describe('countryPrices array', () => {
    it('should have exactly 10 country prices (one per country)', () => {
      expect(countryPrices).toHaveLength(10)
    })

    it('should have all required fields for each country', () => {
      countryPrices.forEach((cp) => {
        expect(cp.countryId).toBeDefined()
        expect(typeof cp.countryId).toBe('string')
        expect(cp.prices).toBeDefined()
        expect(typeof cp.prices.food).toBe('number')
        expect(typeof cp.prices.fuel).toBe('number')
        expect(typeof cp.prices.water).toBe('number')
        expect(cp.theme).toBeDefined()
        expect(typeof cp.theme).toBe('string')
      })
    })

    it('should have unique countryIds', () => {
      const countryIds = countryPrices.map((cp) => cp.countryId)
      const uniqueIds = new Set(countryIds)
      expect(uniqueIds.size).toBe(countryPrices.length)
    })

    it('should cover all 10 countries', () => {
      const expectedCountryIds = [
        'france', 'germany', 'russia', 'china', 'japan',
        'singapore', 'australia', 'brazil', 'canada', 'usa',
      ]
      const actualCountryIds = countryPrices.map((cp) => cp.countryId).sort()
      expect(actualCountryIds).toEqual(expectedCountryIds.sort())
    })

    it('should have positive prices for all resources', () => {
      countryPrices.forEach((cp) => {
        expect(cp.prices.food).toBeGreaterThan(0)
        expect(cp.prices.fuel).toBeGreaterThan(0)
        expect(cp.prices.water).toBeGreaterThan(0)
      })
    })

    it('should have correct prices for each country', () => {
      const expectedPrices: Record<string, { food: number, fuel: number, water: number, theme: string }> = {
        france: { food: 4, fuel: 3, water: 2, theme: 'French Market' },
        germany: { food: 3, fuel: 2, water: 3, theme: 'German Market' },
        russia: { food: 4, fuel: 4, water: 2, theme: 'Russian Market' },
        china: { food: 2, fuel: 3, water: 3, theme: 'Chinese Market' },
        japan: { food: 3, fuel: 4, water: 2, theme: 'Japanese Market' },
        singapore: { food: 3, fuel: 3, water: 4, theme: 'Singapore Market' },
        australia: { food: 3, fuel: 3, water: 5, theme: 'Australian Market' },
        brazil: { food: 2, fuel: 3, water: 2, theme: 'Brazilian Market' },
        canada: { food: 3, fuel: 2, water: 2, theme: 'Canadian Market' },
        usa: { food: 3, fuel: 2, water: 3, theme: 'American Market' },
      }

      countryPrices.forEach((cp) => {
        const expected = expectedPrices[cp.countryId]
        expect(cp.prices.food).toBe(expected.food)
        expect(cp.prices.fuel).toBe(expected.fuel)
        expect(cp.prices.water).toBe(expected.water)
        expect(cp.theme).toBe(expected.theme)
      })
    })
  })

  describe('getPricesForCountry', () => {
    it('should return correct prices for France', () => {
      const prices = getPricesForCountry('france')
      expect(prices).toBeDefined()
      expect(prices?.prices.food).toBe(4)
      expect(prices?.prices.fuel).toBe(3)
      expect(prices?.prices.water).toBe(2)
      expect(prices?.theme).toBe('French Market')
    })

    it('should return correct prices for Australia (expensive water)', () => {
      const prices = getPricesForCountry('australia')
      expect(prices).toBeDefined()
      expect(prices?.prices.water).toBe(5)
    })

    it('should return correct prices for each valid country ID', () => {
      countryPrices.forEach((expected) => {
        const actual = getPricesForCountry(expected.countryId)
        expect(actual).toEqual(expected)
      })
    })

    it('should return undefined for invalid country ID', () => {
      expect(getPricesForCountry('invalid')).toBeUndefined()
      expect(getPricesForCountry('')).toBeUndefined()
      expect(getPricesForCountry('FRANCE')).toBeUndefined()
    })
  })
})
