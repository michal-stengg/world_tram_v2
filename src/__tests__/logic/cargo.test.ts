import { shouldDiscoverCargo, selectRandomCargo, openCargo, applyCargoReward } from '../../logic/cargo';
import type { CargoItem, CargoReward, Resources } from '../../types';
import { cargoItems, getCargoByRarity } from '../../data/cargo';

describe('Cargo System', () => {
  describe('shouldDiscoverCargo', () => {
    it('should return a boolean', () => {
      const result = shouldDiscoverCargo();
      expect(typeof result).toBe('boolean');
    });

    it('should return true roughly 15% of time over many iterations', () => {
      const iterations = 1000;
      let trueCount = 0;

      for (let i = 0; i < iterations; i++) {
        if (shouldDiscoverCargo()) {
          trueCount++;
        }
      }

      // Expect between 10% and 20% (100-200 out of 1000)
      expect(trueCount).toBeGreaterThanOrEqual(100);
      expect(trueCount).toBeLessThanOrEqual(200);
    });
  });

  describe('selectRandomCargo', () => {
    it('should return a valid CargoItem', () => {
      const cargo = selectRandomCargo();

      expect(cargo).toHaveProperty('id');
      expect(cargo).toHaveProperty('name');
      expect(cargo).toHaveProperty('icon');
      expect(cargo).toHaveProperty('rarity');
      expect(cargo).toHaveProperty('rewardType');
      expect(cargo).toHaveProperty('rewardAmount');
      expect(cargo).toHaveProperty('description');
    });

    it('should return cargo items that exist in cargoItems', () => {
      for (let i = 0; i < 100; i++) {
        const cargo = selectRandomCargo();
        const exists = cargoItems.some(item => item.id === cargo.id);
        expect(exists).toBe(true);
      }
    });

    it('should have weighted distribution: ~70% common, ~25% rare, ~5% legendary', () => {
      const iterations = 1000;
      const counts = { common: 0, rare: 0, legendary: 0 };

      for (let i = 0; i < iterations; i++) {
        const cargo = selectRandomCargo();
        counts[cargo.rarity]++;
      }

      // Common: expect 60-80% (600-800)
      expect(counts.common).toBeGreaterThanOrEqual(600);
      expect(counts.common).toBeLessThanOrEqual(800);

      // Rare: expect 15-35% (150-350)
      expect(counts.rare).toBeGreaterThanOrEqual(150);
      expect(counts.rare).toBeLessThanOrEqual(350);

      // Legendary: expect 1-10% (10-100)
      expect(counts.legendary).toBeGreaterThanOrEqual(10);
      expect(counts.legendary).toBeLessThanOrEqual(100);
    });
  });

  describe('openCargo', () => {
    it('should return correct reward for a money cargo item', () => {
      const moneyItem: CargoItem = {
        id: 'test-money',
        name: 'Test Money',
        icon: '$',
        rarity: 'common',
        rewardType: 'money',
        rewardAmount: 50,
        description: 'Test item',
      };

      const reward = openCargo(moneyItem);

      expect(reward.rewardType).toBe('money');
      expect(reward.amount).toBe(50);
    });

    it('should return correct reward for a fuel cargo item', () => {
      const fuelItem: CargoItem = {
        id: 'test-fuel',
        name: 'Test Fuel',
        icon: 'F',
        rarity: 'rare',
        rewardType: 'fuel',
        rewardAmount: 30,
        description: 'Test item',
      };

      const reward = openCargo(fuelItem);

      expect(reward.rewardType).toBe('fuel');
      expect(reward.amount).toBe(30);
    });

    it('should return correct reward for a food cargo item', () => {
      const foodItem: CargoItem = {
        id: 'test-food',
        name: 'Test Food',
        icon: '🍎',
        rarity: 'legendary',
        rewardType: 'food',
        rewardAmount: 100,
        description: 'Test item',
      };

      const reward = openCargo(foodItem);

      expect(reward.rewardType).toBe('food');
      expect(reward.amount).toBe(100);
    });

    it('should return correct reward for a water cargo item', () => {
      const waterItem: CargoItem = {
        id: 'test-water',
        name: 'Test Water',
        icon: '💧',
        rarity: 'common',
        rewardType: 'water',
        rewardAmount: 25,
        description: 'Test item',
      };

      const reward = openCargo(waterItem);

      expect(reward.rewardType).toBe('water');
      expect(reward.amount).toBe(25);
    });

    it('should work with actual cargo items from data', () => {
      const commonItems = getCargoByRarity('common');
      const item = commonItems[0];
      const reward = openCargo(item);

      expect(reward.rewardType).toBe(item.rewardType);
      expect(reward.amount).toBe(item.rewardAmount);
    });
  });

  describe('applyCargoReward', () => {
    const baseResources: Resources = {
      food: 50,
      fuel: 50,
      water: 50,
      money: 100,
    };

    it('should add money reward to resources', () => {
      const reward: CargoReward = { rewardType: 'money', amount: 25 };
      const result = applyCargoReward(baseResources, reward);

      expect(result.money).toBe(125);
      expect(result.food).toBe(50);
      expect(result.fuel).toBe(50);
      expect(result.water).toBe(50);
    });

    it('should add fuel reward to resources', () => {
      const reward: CargoReward = { rewardType: 'fuel', amount: 15 };
      const result = applyCargoReward(baseResources, reward);

      expect(result.fuel).toBe(65);
      expect(result.food).toBe(50);
      expect(result.money).toBe(100);
      expect(result.water).toBe(50);
    });

    it('should add food reward to resources', () => {
      const reward: CargoReward = { rewardType: 'food', amount: 30 };
      const result = applyCargoReward(baseResources, reward);

      expect(result.food).toBe(80);
      expect(result.fuel).toBe(50);
      expect(result.money).toBe(100);
      expect(result.water).toBe(50);
    });

    it('should add water reward to resources', () => {
      const reward: CargoReward = { rewardType: 'water', amount: 20 };
      const result = applyCargoReward(baseResources, reward);

      expect(result.water).toBe(70);
      expect(result.food).toBe(50);
      expect(result.fuel).toBe(50);
      expect(result.money).toBe(100);
    });

    it('should not mutate the original resources object', () => {
      const original: Resources = { food: 50, fuel: 50, water: 50, money: 100 };
      const reward: CargoReward = { rewardType: 'money', amount: 25 };
      const result = applyCargoReward(original, reward);

      expect(original.money).toBe(100);
      expect(result.money).toBe(125);
      expect(result).not.toBe(original);
    });

    it('should handle zero amount rewards', () => {
      const reward: CargoReward = { rewardType: 'food', amount: 0 };
      const result = applyCargoReward(baseResources, reward);

      expect(result.food).toBe(50);
    });

    it('should handle large rewards', () => {
      const reward: CargoReward = { rewardType: 'money', amount: 1000 };
      const result = applyCargoReward(baseResources, reward);

      expect(result.money).toBe(1100);
    });
  });
});
