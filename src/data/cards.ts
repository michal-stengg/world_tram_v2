/**
 * Bonus card data definitions for World Tram game
 * Cards are used during event resolution to boost stats
 */

/**
 * Bonus card type definition
 */
export type BonusCard = {
  id: string;
  name: string;
  stat: 'engineering' | 'food' | 'security';
  bonus: number; // +2 to +4 typically
  description: string;
};

/**
 * Available bonus cards in the game
 */
export const cards: BonusCard[] = [
  {
    id: 'security-patrol',
    name: 'Security Patrol',
    stat: 'security',
    bonus: 3,
    description: 'Deploy a trained patrol team to handle threats and maintain order.',
  },
  {
    id: 'quick-repairs',
    name: 'Quick Repairs',
    stat: 'engineering',
    bonus: 3,
    description: 'A kit of emergency tools and spare parts for rapid mechanical fixes.',
  },
  {
    id: 'emergency-rations',
    name: 'Emergency Rations',
    stat: 'food',
    bonus: 2,
    description: 'Preserved food supplies that can sustain the crew during shortages.',
  },
  {
    id: 'armed-guard',
    name: 'Armed Guard',
    stat: 'security',
    bonus: 4,
    description: 'A heavily armed guard ready to defend against serious threats.',
  },
  {
    id: 'backup-generator',
    name: 'Backup Generator',
    stat: 'engineering',
    bonus: 4,
    description: 'A portable power unit that keeps critical systems running during failures.',
  },
  {
    id: 'medical-supplies',
    name: 'Medical Supplies',
    stat: 'food',
    bonus: 3,
    description: 'First aid kits and medicine to treat injuries and illness on board.',
  },
];

/**
 * Get a bonus card by its ID
 * @param id - The card's unique identifier
 * @returns The card if found, undefined otherwise
 */
export function getCardById(id: string): BonusCard | undefined {
  return cards.find((card) => card.id === id);
}
