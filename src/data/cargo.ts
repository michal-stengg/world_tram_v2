import type { CargoItem, CargoRarity } from '../types';

export const cargoItems: CargoItem[] = [
  // Common items
  {
    id: 'old-toolbox',
    name: 'Old Toolbox',
    icon: '🧰',
    rarity: 'common',
    rewardType: 'money',
    rewardAmount: 20,
    description: 'A weathered toolbox with valuable tools inside',
  },
  {
    id: 'rusty-parts',
    name: 'Rusty Parts',
    icon: '⚙️',
    rarity: 'common',
    rewardType: 'fuel',
    rewardAmount: 10,
    description: 'Salvageable engine parts',
  },
  {
    id: 'dried-rations',
    name: 'Dried Rations',
    icon: '🥫',
    rarity: 'common',
    rewardType: 'food',
    rewardAmount: 15,
    description: 'Emergency food supplies',
  },
  {
    id: 'water-canteen',
    name: 'Water Canteen',
    icon: '🫗',
    rarity: 'common',
    rewardType: 'water',
    rewardAmount: 20,
    description: 'A canteen filled with fresh water',
  },

  // Rare items
  {
    id: 'antique-clock',
    name: 'Antique Clock',
    icon: '⏰',
    rarity: 'rare',
    rewardType: 'money',
    rewardAmount: 75,
    description: 'A valuable antique timepiece',
  },
  {
    id: 'fuel-reserves',
    name: 'Fuel Reserves',
    icon: '🛢️',
    rarity: 'rare',
    rewardType: 'fuel',
    rewardAmount: 40,
    description: 'A container of premium fuel',
  },
  {
    id: 'preserved-feast',
    name: 'Preserved Feast',
    icon: '🍱',
    rarity: 'rare',
    rewardType: 'food',
    rewardAmount: 50,
    description: 'A well-preserved gourmet meal',
  },
  {
    id: 'spring-water',
    name: 'Spring Water',
    icon: '💧',
    rarity: 'rare',
    rewardType: 'water',
    rewardAmount: 50,
    description: 'Pure natural spring water',
  },

  // Legendary items
  {
    id: 'golden-artifact',
    name: 'Golden Artifact',
    icon: '🏆',
    rarity: 'legendary',
    rewardType: 'money',
    rewardAmount: 200,
    description: 'An ancient golden treasure',
  },
  {
    id: 'engine-core',
    name: 'Engine Core',
    icon: '⚡',
    rarity: 'legendary',
    rewardType: 'fuel',
    rewardAmount: 100,
    description: 'A high-efficiency power core',
  },
  {
    id: 'royal-banquet',
    name: 'Royal Banquet',
    icon: '👑',
    rarity: 'legendary',
    rewardType: 'food',
    rewardAmount: 100,
    description: 'A feast fit for royalty',
  },
  {
    id: 'crystal-spring',
    name: 'Crystal Spring',
    icon: '💎',
    rarity: 'legendary',
    rewardType: 'water',
    rewardAmount: 100,
    description: 'Magically pure crystal water',
  },
];

export function getCargoByRarity(rarity: CargoRarity): CargoItem[] {
  return cargoItems.filter(item => item.rarity === rarity);
}

export function getCargoById(id: string): CargoItem | undefined {
  return cargoItems.find(item => item.id === id);
}
