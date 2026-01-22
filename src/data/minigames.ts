/**
 * Mini-game data for World Tram game
 *
 * Each country has a unique mini-game that players can play
 * at stations to earn rewards (food or money).
 */

import type { MiniGame } from '../types';

/**
 * All mini-games in the game, one per country
 */
export const minigames: MiniGame[] = [
  {
    id: 'croissant-catcher',
    name: 'Croissant Catcher',
    countryId: 'france',
    type: 'catcher',
    icon: '🥐',
    description: 'Catch falling croissants!',
    rewardType: 'money',
    maxReward: 25,
  },
  {
    id: 'beer-stein-balance',
    name: 'Beer Stein Balance',
    countryId: 'germany',
    type: 'timing',
    icon: '🍺',
    description: 'Balance the stein at the right moment!',
    rewardType: 'money',
    maxReward: 50,
  },
  {
    id: 'matryoshka-match',
    name: 'Matryoshka Match',
    countryId: 'russia',
    type: 'memory',
    icon: '🪆',
    description: 'Match the nesting dolls!',
    rewardType: 'money',
    maxReward: 40,
  },
  {
    id: 'dumpling-catch',
    name: 'Dumpling Catch',
    countryId: 'china',
    type: 'catcher',
    icon: '🥟',
    description: 'Catch the dumplings!',
    rewardType: 'money',
    maxReward: 25,
  },
  {
    id: 'sushi-sort',
    name: 'Sushi Sort',
    countryId: 'japan',
    type: 'timing',
    icon: '🍣',
    description: 'Sort sushi at the perfect time!',
    rewardType: 'money',
    maxReward: 25,
  },
  {
    id: 'night-market-grab',
    name: 'Night Market Grab',
    countryId: 'singapore',
    type: 'catcher',
    icon: '🏮',
    description: 'Grab treats at the night market!',
    rewardType: 'money',
    maxReward: 50,
  },
  {
    id: 'boomerang-catch',
    name: 'Boomerang Catch',
    countryId: 'australia',
    type: 'timing',
    icon: '🪃',
    description: 'Time your catch perfectly!',
    rewardType: 'money',
    maxReward: 40,
  },
  {
    id: 'carnival-rhythm',
    name: 'Carnival Rhythm',
    countryId: 'brazil',
    type: 'timing',
    icon: '🎭',
    description: 'Hit the beat!',
    rewardType: 'money',
    maxReward: 50,
  },
  {
    id: 'maple-syrup-pour',
    name: 'Maple Syrup Pour',
    countryId: 'canada',
    type: 'timing',
    icon: '🍁',
    description: 'Pour the perfect amount!',
    rewardType: 'money',
    maxReward: 25,
  },
  {
    id: 'hot-dog-stack',
    name: 'Hot Dog Stack',
    countryId: 'usa',
    type: 'catcher',
    icon: '🌭',
    description: 'Stack those hot dogs!',
    rewardType: 'money',
    maxReward: 25,
  },
];

/**
 * Get a mini-game by its associated country ID
 * @param countryId - The country ID to search for
 * @returns The mini-game if found, undefined otherwise
 */
export function getMiniGameByCountryId(countryId: string): MiniGame | undefined {
  return minigames.find((minigame) => minigame.countryId === countryId);
}
