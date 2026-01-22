import { describe, it, expect } from 'vitest'
import {
  calculateMiniGameReward,
  getMiniGameRewardType,
} from '../../logic/minigames'
import type { MiniGame } from '../../types'

describe('minigame logic', () => {
  describe('calculateMiniGameReward', () => {
    it('should return 0 when score is 0', () => {
      expect(calculateMiniGameReward(0, 100, 50)).toBe(0)
    })

    it('should return 0 when score is negative', () => {
      expect(calculateMiniGameReward(-5, 100, 50)).toBe(0)
    })

    it('should return maxReward when score equals maxScore', () => {
      expect(calculateMiniGameReward(100, 100, 50)).toBe(50)
    })

    it('should return maxReward when score exceeds maxScore', () => {
      expect(calculateMiniGameReward(150, 100, 50)).toBe(50)
    })

    it('should return proportional reward for partial score (50% score = 50% reward)', () => {
      expect(calculateMiniGameReward(50, 100, 100)).toBe(50)
    })

    it('should return proportional reward for 25% score', () => {
      expect(calculateMiniGameReward(25, 100, 100)).toBe(25)
    })

    it('should return proportional reward for 75% score', () => {
      expect(calculateMiniGameReward(75, 100, 100)).toBe(75)
    })

    it('should round reward to nearest integer', () => {
      // 33/100 * 50 = 16.5, should round to 17
      expect(calculateMiniGameReward(33, 100, 50)).toBe(17)
    })

    it('should round down when decimal is below 0.5', () => {
      // 1/3 * 10 = 3.33..., should round to 3
      expect(calculateMiniGameReward(1, 3, 10)).toBe(3)
    })

    it('should handle small maxReward values', () => {
      expect(calculateMiniGameReward(50, 100, 10)).toBe(5)
    })

    it('should handle maxScore of 1', () => {
      expect(calculateMiniGameReward(1, 1, 100)).toBe(100)
      expect(calculateMiniGameReward(0, 1, 100)).toBe(0)
    })
  })

  describe('getMiniGameRewardType', () => {
    it("should return 'food' for food-rewarding mini-games", () => {
      const foodMiniGame: MiniGame = {
        id: 'test-food',
        name: 'Test Food Game',
        countryId: 'test',
        type: 'catcher',
        icon: '🍎',
        description: 'A food game',
        rewardType: 'food',
        maxReward: 15,
      }
      expect(getMiniGameRewardType(foodMiniGame)).toBe('food')
    })

    it("should return 'money' for money-rewarding mini-games", () => {
      const moneyMiniGame: MiniGame = {
        id: 'test-money',
        name: 'Test Money Game',
        countryId: 'test',
        type: 'timing',
        icon: '💰',
        description: 'A money game',
        rewardType: 'money',
        maxReward: 50,
      }
      expect(getMiniGameRewardType(moneyMiniGame)).toBe('money')
    })
  })
})
