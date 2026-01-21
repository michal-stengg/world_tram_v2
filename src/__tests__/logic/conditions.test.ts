import { describe, it, expect } from 'vitest'
import { checkVictory, checkGameOver } from '../../logic/conditions'
import type { Resources } from '../../types'

describe('conditions logic', () => {
  describe('checkVictory', () => {
    const totalCountries = 10

    it('should return true when at final country', () => {
      expect(checkVictory(9, totalCountries)).toBe(true)
    })

    it('should return false when not at final country', () => {
      expect(checkVictory(0, totalCountries)).toBe(false)
      expect(checkVictory(5, totalCountries)).toBe(false)
      expect(checkVictory(8, totalCountries)).toBe(false)
    })

    it('should handle edge case of 1 country', () => {
      expect(checkVictory(0, 1)).toBe(true)
    })
  })

  describe('checkGameOver', () => {
    it('should return not game over for healthy resources', () => {
      const resources: Resources = { food: 50, fuel: 100, water: 50, money: 200 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(false)
      expect(result.reason).toBeNull()
    })

    it('should return starvation when food is 0', () => {
      const resources: Resources = { food: 0, fuel: 100, water: 50, money: 200 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(true)
      expect(result.reason).toBe('starvation')
    })

    it('should return out_of_fuel when fuel is 0', () => {
      const resources: Resources = { food: 50, fuel: 0, water: 50, money: 200 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(true)
      expect(result.reason).toBe('out_of_fuel')
    })

    it('should return dehydration when water is 0', () => {
      const resources: Resources = { food: 50, fuel: 100, water: 0, money: 200 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(true)
      expect(result.reason).toBe('dehydration')
    })

    it('should return broke when money is 0', () => {
      const resources: Resources = { food: 50, fuel: 100, water: 50, money: 0 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(true)
      expect(result.reason).toBe('broke')
    })

    it('should prioritize starvation over other conditions', () => {
      // When multiple resources are 0, starvation is checked first
      const resources: Resources = { food: 0, fuel: 0, water: 0, money: 0 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(true)
      expect(result.reason).toBe('starvation')
    })

    it('should not trigger on low but non-zero resources', () => {
      const resources: Resources = { food: 1, fuel: 1, water: 1, money: 1 }
      const result = checkGameOver(resources)
      expect(result.isGameOver).toBe(false)
    })
  })
})
