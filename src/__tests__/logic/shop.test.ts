import { describe, it, expect } from 'vitest'
import { calculateCartTotal, canAfford, applyPurchase, createEmptyCart } from '../../logic/shop'
import type { ResourceCart, ResourcePrices, Resources, MaxResources } from '../../types'

describe('shop logic', () => {
  const samplePrices: ResourcePrices = { food: 4, fuel: 3, water: 2 }
  const sampleResources: Resources = { food: 50, fuel: 100, water: 50, money: 200 }
  const sampleMaxResources: MaxResources = { food: 100, fuel: 200, water: 100, money: 1000 }

  describe('calculateCartTotal', () => {
    it('should return 0 for empty cart', () => {
      const cart: ResourceCart = { food: 0, fuel: 0, water: 0 }
      expect(calculateCartTotal(cart, samplePrices)).toBe(0)
    })

    it('should calculate total for food only', () => {
      const cart: ResourceCart = { food: 10, fuel: 0, water: 0 }
      expect(calculateCartTotal(cart, samplePrices)).toBe(40) // 10 * 4
    })

    it('should calculate total for fuel only', () => {
      const cart: ResourceCart = { food: 0, fuel: 20, water: 0 }
      expect(calculateCartTotal(cart, samplePrices)).toBe(60) // 20 * 3
    })

    it('should calculate total for water only', () => {
      const cart: ResourceCart = { food: 0, fuel: 0, water: 15 }
      expect(calculateCartTotal(cart, samplePrices)).toBe(30) // 15 * 2
    })

    it('should calculate total for mixed cart', () => {
      const cart: ResourceCart = { food: 5, fuel: 10, water: 5 }
      // (5 * 4) + (10 * 3) + (5 * 2) = 20 + 30 + 10 = 60
      expect(calculateCartTotal(cart, samplePrices)).toBe(60)
    })

    it('should work with different prices', () => {
      const expensivePrices: ResourcePrices = { food: 10, fuel: 8, water: 6 }
      const cart: ResourceCart = { food: 1, fuel: 1, water: 1 }
      expect(calculateCartTotal(cart, expensivePrices)).toBe(24)
    })
  })

  describe('canAfford', () => {
    it('should return true for empty cart', () => {
      const cart: ResourceCart = { food: 0, fuel: 0, water: 0 }
      expect(canAfford(cart, samplePrices, 100)).toBe(true)
    })

    it('should return true when cart cost equals money', () => {
      const cart: ResourceCart = { food: 10, fuel: 10, water: 10 }
      // (10 * 4) + (10 * 3) + (10 * 2) = 40 + 30 + 20 = 90
      expect(canAfford(cart, samplePrices, 90)).toBe(true)
    })

    it('should return true when cart cost is less than money', () => {
      const cart: ResourceCart = { food: 5, fuel: 5, water: 5 }
      // (5 * 4) + (5 * 3) + (5 * 2) = 20 + 15 + 10 = 45
      expect(canAfford(cart, samplePrices, 100)).toBe(true)
    })

    it('should return false when cart cost exceeds money', () => {
      const cart: ResourceCart = { food: 10, fuel: 10, water: 10 }
      // Cost: 90
      expect(canAfford(cart, samplePrices, 50)).toBe(false)
    })

    it('should return false for empty wallet with non-empty cart', () => {
      const cart: ResourceCart = { food: 1, fuel: 0, water: 0 }
      expect(canAfford(cart, samplePrices, 0)).toBe(false)
    })
  })

  describe('applyPurchase', () => {
    it('should add resources from cart', () => {
      const cart: ResourceCart = { food: 10, fuel: 20, water: 15 }
      const result = applyPurchase(sampleResources, cart, sampleMaxResources)
      expect(result.food).toBe(60)  // 50 + 10
      expect(result.fuel).toBe(120) // 100 + 20
      expect(result.water).toBe(65) // 50 + 15
    })

    it('should not change money', () => {
      const cart: ResourceCart = { food: 10, fuel: 20, water: 15 }
      const result = applyPurchase(sampleResources, cart, sampleMaxResources)
      expect(result.money).toBe(200)
    })

    it('should cap food at max', () => {
      const cart: ResourceCart = { food: 100, fuel: 0, water: 0 }
      const result = applyPurchase(sampleResources, cart, sampleMaxResources)
      expect(result.food).toBe(100) // capped at max
    })

    it('should cap fuel at max', () => {
      const cart: ResourceCart = { food: 0, fuel: 150, water: 0 }
      const result = applyPurchase(sampleResources, cart, sampleMaxResources)
      expect(result.fuel).toBe(200) // capped at max
    })

    it('should cap water at max', () => {
      const cart: ResourceCart = { food: 0, fuel: 0, water: 100 }
      const result = applyPurchase(sampleResources, cart, sampleMaxResources)
      expect(result.water).toBe(100) // capped at max
    })

    it('should handle empty cart', () => {
      const cart: ResourceCart = { food: 0, fuel: 0, water: 0 }
      const result = applyPurchase(sampleResources, cart, sampleMaxResources)
      expect(result).toEqual(sampleResources)
    })
  })

  describe('createEmptyCart', () => {
    it('should return a cart with all zeros', () => {
      const cart = createEmptyCart()
      expect(cart.food).toBe(0)
      expect(cart.fuel).toBe(0)
      expect(cart.water).toBe(0)
    })

    it('should return a new object each time', () => {
      const cart1 = createEmptyCart()
      const cart2 = createEmptyCart()
      expect(cart1).not.toBe(cart2)
    })
  })
})
