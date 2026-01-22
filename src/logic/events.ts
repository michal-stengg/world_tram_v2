/**
 * Event trigger logic for World Tram game
 * Handles random event triggering and selection
 */

import { events } from '../data/events';
import type { GameEvent } from '../data/events';
import type { BonusCard } from '../data/cards';
import type { CrewMember } from '../types';
import { calculateCrewEventBonus } from './crew';

/**
 * Result of resolving an event
 */
export type EventResult = {
  success: boolean;
  total: number; // dice + card bonuses + captain stat
  penalty?: {
    type: string;
    resource?: string;
    amount: number;
  };
};

/**
 * Determines if an event should trigger
 * Approximately 40% chance to trigger an event
 * @returns true if an event should trigger, false otherwise
 */
export function shouldTriggerEvent(): boolean {
  return Math.random() < 0.4;
}

/**
 * Selects a random event from the available events
 * @returns A randomly selected GameEvent
 */
export function selectRandomEvent(): GameEvent {
  const randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
}

/**
 * Resolves an event by calculating the total score and determining success
 * @param event - The event being resolved
 * @param playedCards - Array of bonus cards played to help resolve the event
 * @param captainStats - The captain's stats (engineering, food, security)
 * @param diceRoll - The dice roll result
 * @param crew - Optional crew members to calculate crew event bonus
 * @returns EventResult with success status, total score, and penalty if failed
 */
export function resolveEvent(
  event: GameEvent,
  playedCards: BonusCard[],
  captainStats: { engineering: number; food: number; security: number },
  diceRoll: number,
  crew?: CrewMember[]
): EventResult {
  // Get the relevant captain stat based on the event's tested stat
  const captainStatValue = captainStats[event.statTested];

  // Calculate the sum of bonuses from cards that match the event's stat
  const cardBonusTotal = playedCards
    .filter((card) => card.stat === event.statTested)
    .reduce((sum, card) => sum + card.bonus, 0);

  // Calculate crew bonus (each crew member with matching role adds +1)
  const crewBonus = crew ? calculateCrewEventBonus(crew, event.statTested) : 0;

  // Calculate total: dice roll + captain stat + matching card bonuses + crew bonus
  const total = diceRoll + captainStatValue + cardBonusTotal + crewBonus;

  // Determine success
  const success = total >= event.difficulty;

  // Build the result
  const result: EventResult = {
    success,
    total,
  };

  // Add penalty if failed
  if (!success) {
    result.penalty = {
      type: event.penalty.type,
      amount: event.penalty.amount,
    };
    if (event.penalty.resource) {
      result.penalty.resource = event.penalty.resource;
    }
  }

  return result;
}
