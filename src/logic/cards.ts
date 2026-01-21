/**
 * Card hand management logic for World Tram game
 * Handles drawing, playing, and replenishing bonus cards
 */

import { cards } from '../data/cards';
import type { BonusCard } from '../data/cards';

/** Maximum number of cards in a player's hand */
const HAND_SIZE = 3;

/**
 * Draw a random card from the available cards pool
 * @returns A random BonusCard
 */
function drawRandomCard(): BonusCard {
  const randomIndex = Math.floor(Math.random() * cards.length);
  return cards[randomIndex];
}

/**
 * Draw the initial hand of cards for the player
 * @returns An array of 3 random BonusCards
 */
export function drawInitialHand(): BonusCard[] {
  const hand: BonusCard[] = [];
  for (let i = 0; i < HAND_SIZE; i++) {
    hand.push(drawRandomCard());
  }
  return hand;
}

/**
 * Remove played cards from the player's hand
 * @param hand - The current hand of cards
 * @param cardIds - Array of card IDs to remove
 * @returns A new array with the specified cards removed
 */
export function playCards(hand: BonusCard[], cardIds: string[]): BonusCard[] {
  return hand.filter((card) => !cardIds.includes(card.id));
}

/**
 * Replenish the hand back to the maximum size
 * @param hand - The current hand of cards
 * @returns A new array with the hand filled back to 3 cards
 */
export function replenishHand(hand: BonusCard[]): BonusCard[] {
  const newHand = [...hand];
  while (newHand.length < HAND_SIZE) {
    newHand.push(drawRandomCard());
  }
  return newHand;
}
