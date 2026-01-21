import { describe, it, expect } from 'vitest'
import { rollDice, rollMovement } from '../../logic/dice'
import { DICE_MIN, DICE_MAX } from '../../data/constants'

describe('dice logic', () => {
  describe('rollDice', () => {
    it('should return a number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollDice(1, 6)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(6)
      }
    })

    it('should return an integer', () => {
      for (let i = 0; i < 20; i++) {
        const result = rollDice(1, 10)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should handle min and max being the same', () => {
      const result = rollDice(5, 5)
      expect(result).toBe(5)
    })

    it('should produce different values over multiple rolls', () => {
      const results = new Set<number>()
      for (let i = 0; i < 100; i++) {
        results.add(rollDice(1, 10))
      }
      // With 100 rolls of a 1-10 die, we should get at least 2 different values
      expect(results.size).toBeGreaterThan(1)
    })
  })

  describe('rollMovement', () => {
    it('should return a number within DICE_MIN and DICE_MAX', () => {
      for (let i = 0; i < 100; i++) {
        const result = rollMovement()
        expect(result).toBeGreaterThanOrEqual(DICE_MIN)
        expect(result).toBeLessThanOrEqual(DICE_MAX)
      }
    })

    it('should return an integer', () => {
      for (let i = 0; i < 20; i++) {
        const result = rollMovement()
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should produce different values over multiple rolls', () => {
      const results = new Set<number>()
      for (let i = 0; i < 100; i++) {
        results.add(rollMovement())
      }
      // With 100 rolls, we should get multiple different values
      expect(results.size).toBeGreaterThan(1)
    })
  })
})
