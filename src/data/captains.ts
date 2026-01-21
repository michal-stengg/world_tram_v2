/**
 * Captain data definitions for World Tram game
 */

import type { Captain } from '../types';

/**
 * Available captains in the game
 */
export const captains: Captain[] = [
  {
    id: 'renji',
    name: 'Renji',
    origin: 'Japan',
    description: 'A precise and disciplined engineer from Tokyo who keeps trains running on time.',
    portrait: '🧑‍✈️',
    stats: {
      engineering: 5,
      food: 2,
      security: 3,
    },
  },
  {
    id: 'luca',
    name: 'Luca',
    origin: 'Italy',
    description: 'A passionate chef from Rome who believes good food makes happy passengers.',
    portrait: '👨‍🍳',
    stats: {
      engineering: 2,
      food: 5,
      security: 3,
    },
  },
  {
    id: 'cooper',
    name: 'Cooper',
    origin: 'USA',
    description: 'A tough frontier guard from Texas who keeps everyone safe on the rails.',
    portrait: '🤠',
    stats: {
      engineering: 3,
      food: 2,
      security: 5,
    },
  },
];

/**
 * Get a captain by their ID
 * @param id - The captain's unique identifier
 * @returns The captain if found, undefined otherwise
 */
export function getCaptainById(id: string): Captain | undefined {
  return captains.find((captain) => captain.id === id);
}
