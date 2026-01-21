/**
 * Cart purchase and effect application logic for World Tram game
 */

import type { Cart, MaxResources } from '../types'

/**
 * Check if a cart can be purchased with the available money
 * @param cart - The cart to purchase
 * @param money - Available money
 * @returns true if the player has enough money to buy the cart
 */
export function canPurchaseCart(cart: Cart, money: number): boolean {
  return money >= cart.price
}

/**
 * Calculate the cost of purchasing a cart
 * @param cart - The cart to purchase
 * @returns The price of the cart
 */
export function calculatePurchaseCost(cart: Cart): number {
  return cart.price
}

/**
 * Apply cart effects to base max resources
 * Only maxFuel, maxFood, and maxWater effect types modify the max resources
 * @param ownedCarts - Array of owned carts
 * @param baseMaxResources - Base maximum resources before cart bonuses
 * @returns Modified max resources with cart bonuses applied
 */
export function applyCartEffects(ownedCarts: Cart[], baseMaxResources: MaxResources): MaxResources {
  const result: MaxResources = { ...baseMaxResources }

  for (const cart of ownedCarts) {
    switch (cart.effectType) {
      case 'maxFuel':
        result.fuel += cart.effectValue
        break
      case 'maxFood':
        result.food += cart.effectValue
        break
      case 'maxWater':
        result.water += cart.effectValue
        break
      // Other effect types (fuelEfficiency, security, income) don't modify max resources
    }
  }

  return result
}

/**
 * Calculate the total fuel efficiency bonus from owned carts
 * @param ownedCarts - Array of owned carts
 * @returns Total fuel efficiency bonus (reduces fuel consumption per turn)
 */
export function calculateFuelEfficiencyBonus(ownedCarts: Cart[]): number {
  return ownedCarts
    .filter((cart) => cart.effectType === 'fuelEfficiency')
    .reduce((total, cart) => total + cart.effectValue, 0)
}

/**
 * Calculate the total security bonus from owned carts
 * @param ownedCarts - Array of owned carts
 * @returns Total security bonus (adds to security effectiveness)
 */
export function calculateSecurityBonus(ownedCarts: Cart[]): number {
  return ownedCarts
    .filter((cart) => cart.effectType === 'security')
    .reduce((total, cart) => total + cart.effectValue, 0)
}

/**
 * Calculate the total income bonus from owned carts
 * @param ownedCarts - Array of owned carts
 * @returns Total income bonus (extra money earned at stations)
 */
export function calculateIncomeBonus(ownedCarts: Cart[]): number {
  return ownedCarts
    .filter((cart) => cart.effectType === 'income')
    .reduce((total, cart) => total + cart.effectValue, 0)
}
