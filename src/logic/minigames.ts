/**
 * Mini-game logic functions for World Tram game
 */

import type { MiniGame, MiniGameRewardType } from '../types';

/**
 * Calculate the reward based on mini-game performance
 * @param score - Player's score
 * @param maxScore - Maximum possible score
 * @param maxReward - Maximum reward amount
 * @returns Reward amount (proportional to score, capped at maxReward)
 */
export function calculateMiniGameReward(
  score: number,
  maxScore: number,
  maxReward: number
): number {
  // Handle edge cases
  if (score <= 0) {
    return 0;
  }

  // Cap at maxReward if score >= maxScore
  if (score >= maxScore) {
    return maxReward;
  }

  // Calculate proportional reward and round to nearest integer
  return Math.round((score / maxScore) * maxReward);
}

/**
 * Get the reward type for a mini-game
 * @param miniGame - The mini-game
 * @returns The reward type ('food' or 'money')
 */
export function getMiniGameRewardType(miniGame: MiniGame): MiniGameRewardType {
  return miniGame.rewardType;
}
