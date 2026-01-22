import type { CargoItem, CargoReward, Resources } from '../types';
import { getCargoByRarity } from '../data/cargo';

const DISCOVERY_CHANCE = 0.15; // 15% chance per turn

// Rarity weights (must sum to 1.0)
const RARITY_WEIGHTS = {
  common: 0.70,
  rare: 0.25,
  legendary: 0.05,
};

export function shouldDiscoverCargo(): boolean {
  return Math.random() < DISCOVERY_CHANCE;
}

export function selectRandomCargo(): CargoItem {
  const roll = Math.random();
  let rarity: 'common' | 'rare' | 'legendary';

  if (roll < RARITY_WEIGHTS.common) {
    rarity = 'common';
  } else if (roll < RARITY_WEIGHTS.common + RARITY_WEIGHTS.rare) {
    rarity = 'rare';
  } else {
    rarity = 'legendary';
  }

  const itemsOfRarity = getCargoByRarity(rarity);
  return itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
}

export function openCargo(item: CargoItem): CargoReward {
  return {
    rewardType: item.rewardType,
    amount: item.rewardAmount,
  };
}

export function applyCargoReward(resources: Resources, reward: CargoReward): Resources {
  return {
    ...resources,
    [reward.rewardType]: resources[reward.rewardType] + reward.amount,
  };
}
