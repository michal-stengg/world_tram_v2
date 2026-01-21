/**
 * Cart data definitions for World Tram game
 */

import type { Cart } from '../types';

/**
 * Available carts in the game
 */
export const carts: Cart[] = [
  {
    id: 'fuel-cart',
    name: 'Fuel Cart',
    icon: '⛽',
    price: 100,
    effectType: 'maxFuel',
    effectValue: 50, // increases max fuel by 50
    description: 'Extra fuel storage tank',
  },
  {
    id: 'food-cart',
    name: 'Food Cart',
    icon: '🍱',
    price: 80,
    effectType: 'maxFood',
    effectValue: 30, // increases max food by 30
    description: 'Refrigerated food storage',
  },
  {
    id: 'water-cart',
    name: 'Water Cart',
    icon: '💧',
    price: 70,
    effectType: 'maxWater',
    effectValue: 30, // increases max water by 30
    description: 'Clean water reservoir',
  },
  {
    id: 'spare-parts-cart',
    name: 'Spare Parts Cart',
    icon: '🔧',
    price: 120,
    effectType: 'fuelEfficiency',
    effectValue: 2, // reduces fuel consumption by 2 per turn
    description: 'Tools and spare parts reduce fuel consumption',
  },
  {
    id: 'security-cart',
    name: 'Security Cart',
    icon: '🛡️',
    price: 150,
    effectType: 'security',
    effectValue: 2, // adds +2 to security effectiveness
    description: 'Reinforced cart with security equipment',
  },
  {
    id: 'passenger-cart',
    name: 'Passenger Cart',
    icon: '🚃',
    price: 100,
    effectType: 'income',
    effectValue: 20, // earns 20 extra money at stations
    description: 'Carry passengers for extra income at stations',
  },
];

/**
 * Get a cart by its ID
 * @param id - The cart's unique identifier
 * @returns The cart if found, undefined otherwise
 */
export function getCartById(id: string): Cart | undefined {
  return carts.find((cart) => cart.id === id);
}
