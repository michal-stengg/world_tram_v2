import type { Train } from '../types';

/**
 * Train definitions for World Tram game
 * Each train has unique stats and personality
 */
export const trains: Train[] = [
  {
    id: 'blitzzug',
    name: 'Blitzzug',
    origin: 'Germany',
    character: 'The reliable German express that never breaks down. Steady and dependable.',
    sprite: '🚄',
    stats: {
      speed: 3,
      reliability: 5,
      power: 3,
    },
  },
  {
    id: 'kitsune',
    name: 'Kitsune',
    origin: 'Japan',
    character: 'A swift and nimble train inspired by the legendary fox spirit. Fast as the wind!',
    sprite: '🦊',
    stats: {
      speed: 5,
      reliability: 3,
      power: 3,
    },
  },
  {
    id: 'ironhorse',
    name: 'Ironhorse',
    origin: 'USA',
    character: 'A powerful American locomotive that can haul anything up any mountain.',
    sprite: '🚂',
    stats: {
      speed: 3,
      reliability: 3,
      power: 5,
    },
  },
];

/**
 * Get a train by its ID
 * @param id - The train ID to look up
 * @returns The train if found, undefined otherwise
 */
export function getTrainById(id: string): Train | undefined {
  return trains.find((train) => train.id === id);
}
