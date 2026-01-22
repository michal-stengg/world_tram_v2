import type { ResourceCart, ResourcePrices, Resources, MaxResources } from '../types'

/**
 * Calculate the total cost of a resource cart
 * @param cart - The resource cart with quantities
 * @param prices - The prices per unit
 * @returns The total cost
 */
export function calculateCartTotal(cart: ResourceCart, prices: ResourcePrices): number {
  return (cart.food * prices.food) + (cart.fuel * prices.fuel) + (cart.water * prices.water)
}

/**
 * Check if the player can afford the cart
 * @param cart - The resource cart with quantities
 * @param prices - The prices per unit
 * @param money - Current money amount
 * @returns True if the player can afford the cart
 */
export function canAfford(cart: ResourceCart, prices: ResourcePrices, money: number): boolean {
  return calculateCartTotal(cart, prices) <= money
}

/**
 * Apply a resource purchase to the current resources
 * Respects max resource limits (clamped to max)
 * @param resources - Current resources
 * @param cart - The resource cart with quantities to add
 * @param maxResources - The maximum resource limits
 * @returns Updated resources after purchase
 */
export function applyPurchase(resources: Resources, cart: ResourceCart, maxResources: MaxResources): Resources {
  return {
    food: Math.min(resources.food + cart.food, maxResources.food),
    fuel: Math.min(resources.fuel + cart.fuel, maxResources.fuel),
    water: Math.min(resources.water + cart.water, maxResources.water),
    money: resources.money, // Money is deducted separately
  }
}

/**
 * Create an empty resource cart
 * @returns An empty resource cart
 */
export function createEmptyCart(): ResourceCart {
  return { food: 0, fuel: 0, water: 0 }
}
