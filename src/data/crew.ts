import type { CrewMember } from '../types';

/**
 * Starting crew members for the World Tram game.
 * Each crew member has a specific role that affects gameplay.
 */
export const startingCrew: CrewMember[] = [
  {
    id: 'tom',
    name: 'Tom',
    role: 'engineer',
    avatar: '👨‍🔧',
  },
  {
    id: 'maria',
    name: 'Maria',
    role: 'cook',
    avatar: '👩‍🍳',
  },
  {
    id: 'jack',
    name: 'Jack',
    role: 'security',
    avatar: '💂',
  },
  {
    id: 'sam',
    name: 'Sam',
    role: 'free',
    avatar: '👤',
  },
];

/**
 * Find a crew member by their unique ID.
 * @param id - The crew member's unique identifier
 * @returns The crew member if found, undefined otherwise
 */
export function getCrewMemberById(id: string): CrewMember | undefined {
  return startingCrew.find((member) => member.id === id);
}
