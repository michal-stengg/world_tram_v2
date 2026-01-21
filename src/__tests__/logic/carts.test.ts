import { describe, it, expect } from 'vitest'
import {
  canPurchaseCart,
  calculatePurchaseCost,
  applyCartEffects,
  calculateFuelEfficiencyBonus,
  calculateSecurityBonus,
  calculateIncomeBonus,
} from '../../logic/carts'
import type { Cart, MaxResources } from '../../types'

describe('cart logic', () => {
  // Mock cart data for testing
  const fuelCart: Cart = {
    id: 'fuel-cart',
    name: 'Fuel Cart',
    icon: '⛽',
    price: 100,
    effectType: 'maxFuel',
    effectValue: 50,
    description: 'Extra fuel storage tank',
  }

  const foodCart: Cart = {
    id: 'food-cart',
    name: 'Food Cart',
    icon: '🍱',
    price: 80,
    effectType: 'maxFood',
    effectValue: 30,
    description: 'Refrigerated food storage',
  }

  const waterCart: Cart = {
    id: 'water-cart',
    name: 'Water Cart',
    icon: '💧',
    price: 70,
    effectType: 'maxWater',
    effectValue: 30,
    description: 'Clean water reservoir',
  }

  const sparePartsCart: Cart = {
    id: 'spare-parts-cart',
    name: 'Spare Parts Cart',
    icon: '🔧',
    price: 120,
    effectType: 'fuelEfficiency',
    effectValue: 2,
    description: 'Tools and spare parts reduce fuel consumption',
  }

  const securityCart: Cart = {
    id: 'security-cart',
    name: 'Security Cart',
    icon: '🛡️',
    price: 150,
    effectType: 'security',
    effectValue: 2,
    description: 'Reinforced cart with security equipment',
  }

  const passengerCart: Cart = {
    id: 'passenger-cart',
    name: 'Passenger Cart',
    icon: '🚃',
    price: 100,
    effectType: 'income',
    effectValue: 20,
    description: 'Carry passengers for extra income at stations',
  }

  const baseMaxResources: MaxResources = {
    food: 100,
    fuel: 200,
    water: 100,
    money: 1000,
  }

  describe('canPurchaseCart', () => {
    it('should return true when money equals cart price', () => {
      expect(canPurchaseCart(fuelCart, 100)).toBe(true)
    })

    it('should return true when money exceeds cart price', () => {
      expect(canPurchaseCart(fuelCart, 150)).toBe(true)
    })

    it('should return false when money is less than cart price', () => {
      expect(canPurchaseCart(fuelCart, 50)).toBe(false)
    })

    it('should return false when money is zero', () => {
      expect(canPurchaseCart(fuelCart, 0)).toBe(false)
    })

    it('should work with different cart prices', () => {
      expect(canPurchaseCart(foodCart, 80)).toBe(true)
      expect(canPurchaseCart(foodCart, 79)).toBe(false)
      expect(canPurchaseCart(securityCart, 150)).toBe(true)
      expect(canPurchaseCart(securityCart, 100)).toBe(false)
    })
  })

  describe('calculatePurchaseCost', () => {
    it('should return the cart price', () => {
      expect(calculatePurchaseCost(fuelCart)).toBe(100)
    })

    it('should work with different carts', () => {
      expect(calculatePurchaseCost(foodCart)).toBe(80)
      expect(calculatePurchaseCost(waterCart)).toBe(70)
      expect(calculatePurchaseCost(sparePartsCart)).toBe(120)
      expect(calculatePurchaseCost(securityCart)).toBe(150)
      expect(calculatePurchaseCost(passengerCart)).toBe(100)
    })
  })

  describe('applyCartEffects', () => {
    it('should return base max resources when no carts are owned', () => {
      const result = applyCartEffects([], baseMaxResources)
      expect(result).toEqual(baseMaxResources)
    })

    it('should increase maxFuel when fuel cart is owned', () => {
      const result = applyCartEffects([fuelCart], baseMaxResources)
      expect(result.fuel).toBe(250) // 200 + 50
      expect(result.food).toBe(100) // unchanged
      expect(result.water).toBe(100) // unchanged
      expect(result.money).toBe(1000) // unchanged
    })

    it('should increase maxFood when food cart is owned', () => {
      const result = applyCartEffects([foodCart], baseMaxResources)
      expect(result.food).toBe(130) // 100 + 30
      expect(result.fuel).toBe(200) // unchanged
      expect(result.water).toBe(100) // unchanged
      expect(result.money).toBe(1000) // unchanged
    })

    it('should increase maxWater when water cart is owned', () => {
      const result = applyCartEffects([waterCart], baseMaxResources)
      expect(result.water).toBe(130) // 100 + 30
      expect(result.food).toBe(100) // unchanged
      expect(result.fuel).toBe(200) // unchanged
      expect(result.money).toBe(1000) // unchanged
    })

    it('should handle multiple carts of the same type', () => {
      const result = applyCartEffects([fuelCart, fuelCart], baseMaxResources)
      expect(result.fuel).toBe(300) // 200 + 50 + 50
    })

    it('should handle multiple different carts', () => {
      const result = applyCartEffects([fuelCart, foodCart, waterCart], baseMaxResources)
      expect(result.fuel).toBe(250) // 200 + 50
      expect(result.food).toBe(130) // 100 + 30
      expect(result.water).toBe(130) // 100 + 30
      expect(result.money).toBe(1000) // unchanged
    })

    it('should not modify base resources for non-resource effect carts', () => {
      const result = applyCartEffects([sparePartsCart, securityCart, passengerCart], baseMaxResources)
      expect(result).toEqual(baseMaxResources)
    })
  })

  describe('calculateFuelEfficiencyBonus', () => {
    it('should return 0 when no carts are owned', () => {
      expect(calculateFuelEfficiencyBonus([])).toBe(0)
    })

    it('should return 0 when no spare parts carts are owned', () => {
      expect(calculateFuelEfficiencyBonus([fuelCart, foodCart])).toBe(0)
    })

    it('should return the effect value for one spare parts cart', () => {
      expect(calculateFuelEfficiencyBonus([sparePartsCart])).toBe(2)
    })

    it('should sum effect values for multiple spare parts carts', () => {
      expect(calculateFuelEfficiencyBonus([sparePartsCart, sparePartsCart])).toBe(4)
    })

    it('should only count fuelEfficiency carts', () => {
      expect(calculateFuelEfficiencyBonus([sparePartsCart, fuelCart, securityCart])).toBe(2)
    })
  })

  describe('calculateSecurityBonus', () => {
    it('should return 0 when no carts are owned', () => {
      expect(calculateSecurityBonus([])).toBe(0)
    })

    it('should return 0 when no security carts are owned', () => {
      expect(calculateSecurityBonus([fuelCart, foodCart])).toBe(0)
    })

    it('should return the effect value for one security cart', () => {
      expect(calculateSecurityBonus([securityCart])).toBe(2)
    })

    it('should sum effect values for multiple security carts', () => {
      expect(calculateSecurityBonus([securityCart, securityCart])).toBe(4)
    })

    it('should only count security carts', () => {
      expect(calculateSecurityBonus([securityCart, fuelCart, sparePartsCart])).toBe(2)
    })
  })

  describe('calculateIncomeBonus', () => {
    it('should return 0 when no carts are owned', () => {
      expect(calculateIncomeBonus([])).toBe(0)
    })

    it('should return 0 when no passenger carts are owned', () => {
      expect(calculateIncomeBonus([fuelCart, foodCart])).toBe(0)
    })

    it('should return the effect value for one passenger cart', () => {
      expect(calculateIncomeBonus([passengerCart])).toBe(20)
    })

    it('should sum effect values for multiple passenger carts', () => {
      expect(calculateIncomeBonus([passengerCart, passengerCart])).toBe(40)
    })

    it('should only count income carts', () => {
      expect(calculateIncomeBonus([passengerCart, fuelCart, securityCart])).toBe(20)
    })
  })
})
