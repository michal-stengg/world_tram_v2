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
    rewardType: 'food',
    maxReward: 38,
  },
  {
    id: 'signal-switch',
    name: 'Signal Switch',
    countryId: 'germany',
    type: 'signal',
    icon: '🚦',
    description: 'Switch the railway signals in the right order!',
    rewardType: 'money',
    maxReward: 75,
  },
  {
    id: 'matryoshka-match',
    name: 'Matryoshka Match',
    countryId: 'russia',
    type: 'memory',
    icon: '🪆',
    description: 'Match the nesting dolls!',
    rewardType: 'money',
    maxReward: 60,
  },
  {
    id: 'lantern-sequence',
    name: 'Lantern Sequence',
    countryId: 'china',
    type: 'sequence',
    icon: '🏮',
    description: 'Repeat the lantern pattern!',
    rewardType: 'food',
    maxReward: 38,
  },
  {
    id: 'sushi-sort',
    name: 'Sushi Sort',
    countryId: 'japan',
    type: 'timing',
    icon: '🍣',
    description: 'Sort sushi at the perfect time!',
    rewardType: 'food',
    maxReward: 38,
  },
  {
    id: 'night-market-grab',
    name: 'Night Market Grab',
    countryId: 'singapore',
    type: 'catcher',
    icon: '🏮',
    description: 'Grab treats at the night market!',
    rewardType: 'money',
    maxReward: 75,
  },
  {
    id: 'track-repair',
    name: 'Track Repair',
    countryId: 'australia',
    type: 'repair',
    icon: '🛠️',
    description: 'Repair the cracked rail tiles!',
    rewardType: 'money',
    maxReward: 60,
  },
  {
    id: 'carnival-rhythm',
    name: 'Carnival Rhythm',
    countryId: 'brazil',
    type: 'timing',
    icon: '🎭',
    description: 'Hit the beat!',
    rewardType: 'money',
    maxReward: 75,
  },
  {
    id: 'maple-syrup-pour',
    name: 'Maple Syrup Pour',
    countryId: 'canada',
    type: 'timing',
    icon: '🍁',
    description: 'Pour the perfect amount!',
    rewardType: 'food',
    maxReward: 38,
  },
  {
    id: 'hot-dog-stack',
    name: 'Hot Dog Stack',
    countryId: 'usa',
    type: 'catcher',
    icon: '🌭',
    description: 'Stack those hot dogs!',
    rewardType: 'food',
    maxReward: 38,
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
