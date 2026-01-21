/**
 * Event data definitions for World Tram game
 * Events are random negative challenges that test the player
 */

/**
 * Type definition for game events
 */
export type GameEvent = {
  id: string;
  name: string;
  description: string;
  statTested: 'engineering' | 'food' | 'security';
  difficulty: number; // target number to beat (8-12)
  penalty: {
    type: 'resource' | 'progress';
    resource?: 'food' | 'fuel' | 'water' | 'money';
    amount: number;
  };
};

/**
 * Available events in the game
 */
export const events: GameEvent[] = [
  {
    id: 'bandit-attack',
    name: 'Bandit Attack',
    description: 'A gang of bandits has spotted your train and is attempting to board! Your security team must defend the passengers and cargo.',
    statTested: 'security',
    difficulty: 10,
    penalty: {
      type: 'resource',
      resource: 'money',
      amount: 50,
    },
  },
  {
    id: 'engine-failure',
    name: 'Engine Failure',
    description: 'The main engine is making terrible sounds! Your engineers must work quickly to prevent a complete breakdown.',
    statTested: 'engineering',
    difficulty: 9,
    penalty: {
      type: 'resource',
      resource: 'fuel',
      amount: 30,
    },
  },
  {
    id: 'food-spoilage',
    name: 'Food Spoilage',
    description: 'Something has gone wrong with the food storage. The cooks must salvage what they can before supplies are ruined.',
    statTested: 'food',
    difficulty: 8,
    penalty: {
      type: 'resource',
      resource: 'food',
      amount: 25,
    },
  },
  {
    id: 'storm',
    name: 'Storm',
    description: 'A violent storm is battering the train! The engineers must keep everything running through the dangerous conditions.',
    statTested: 'engineering',
    difficulty: 11,
    penalty: {
      type: 'progress',
      amount: 5,
    },
  },
  {
    id: 'crew-sickness',
    name: 'Crew Sickness',
    description: 'Several crew members have fallen ill. The cooks must prepare healing meals to get everyone back on their feet.',
    statTested: 'food',
    difficulty: 9,
    penalty: {
      type: 'resource',
      resource: 'water',
      amount: 20,
    },
  },
];

/**
 * Get an event by its ID
 * @param id - The event's unique identifier
 * @returns The event if found, undefined otherwise
 */
export function getEventById(id: string): GameEvent | undefined {
  return events.find((event) => event.id === id);
}
