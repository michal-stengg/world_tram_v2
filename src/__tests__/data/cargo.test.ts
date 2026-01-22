import { cargoItems, getCargoByRarity, getCargoById } from '../../data/cargo';
import type { CargoItem, CargoRarity } from '../../types';

describe('Cargo Data', () => {
  describe('cargoItems', () => {
    it('should have exactly 12 cargo items', () => {
      expect(cargoItems).toHaveLength(12);
    });

    it('should have 4 common items', () => {
      const commonItems = cargoItems.filter(item => item.rarity === 'common');
      expect(commonItems).toHaveLength(4);
    });

    it('should have 4 rare items', () => {
      const rareItems = cargoItems.filter(item => item.rarity === 'rare');
      expect(rareItems).toHaveLength(4);
    });

    it('should have 4 legendary items', () => {
      const legendaryItems = cargoItems.filter(item => item.rarity === 'legendary');
      expect(legendaryItems).toHaveLength(4);
    });

    it('should have all required fields for each item', () => {
      cargoItems.forEach((item: CargoItem) => {
        expect(item.id).toBeDefined();
        expect(typeof item.id).toBe('string');
        expect(item.id.length).toBeGreaterThan(0);

        expect(item.name).toBeDefined();
        expect(typeof item.name).toBe('string');
        expect(item.name.length).toBeGreaterThan(0);

        expect(item.icon).toBeDefined();
        expect(typeof item.icon).toBe('string');
        expect(item.icon.length).toBeGreaterThan(0);

        expect(item.rarity).toBeDefined();
        expect(['common', 'rare', 'legendary']).toContain(item.rarity);

        expect(item.rewardType).toBeDefined();
        expect(['money', 'fuel', 'food', 'water']).toContain(item.rewardType);

        expect(item.rewardAmount).toBeDefined();
        expect(typeof item.rewardAmount).toBe('number');
        expect(item.rewardAmount).toBeGreaterThan(0);

        expect(item.description).toBeDefined();
        expect(typeof item.description).toBe('string');
        expect(item.description.length).toBeGreaterThan(0);
      });
    });

    it('should have unique ids for all items', () => {
      const ids = cargoItems.map(item => item.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    describe('common items', () => {
      it('should include Old Toolbox with correct properties', () => {
        const toolbox = cargoItems.find(item => item.id === 'old-toolbox');
        expect(toolbox).toBeDefined();
        expect(toolbox?.name).toBe('Old Toolbox');
        expect(toolbox?.icon).toBe('🧰');
        expect(toolbox?.rarity).toBe('common');
        expect(toolbox?.rewardType).toBe('money');
        expect(toolbox?.rewardAmount).toBe(20);
      });

      it('should include Rusty Parts with correct properties', () => {
        const parts = cargoItems.find(item => item.id === 'rusty-parts');
        expect(parts).toBeDefined();
        expect(parts?.name).toBe('Rusty Parts');
        expect(parts?.icon).toBe('⚙️');
        expect(parts?.rarity).toBe('common');
        expect(parts?.rewardType).toBe('fuel');
        expect(parts?.rewardAmount).toBe(10);
      });

      it('should include Dried Rations with correct properties', () => {
        const rations = cargoItems.find(item => item.id === 'dried-rations');
        expect(rations).toBeDefined();
        expect(rations?.name).toBe('Dried Rations');
        expect(rations?.icon).toBe('🥫');
        expect(rations?.rarity).toBe('common');
        expect(rations?.rewardType).toBe('food');
        expect(rations?.rewardAmount).toBe(15);
      });

      it('should include Water Canteen with correct properties', () => {
        const canteen = cargoItems.find(item => item.id === 'water-canteen');
        expect(canteen).toBeDefined();
        expect(canteen?.name).toBe('Water Canteen');
        expect(canteen?.icon).toBe('🫗');
        expect(canteen?.rarity).toBe('common');
        expect(canteen?.rewardType).toBe('water');
        expect(canteen?.rewardAmount).toBe(20);
      });
    });

    describe('rare items', () => {
      it('should include Antique Clock with correct properties', () => {
        const clock = cargoItems.find(item => item.id === 'antique-clock');
        expect(clock).toBeDefined();
        expect(clock?.name).toBe('Antique Clock');
        expect(clock?.icon).toBe('⏰');
        expect(clock?.rarity).toBe('rare');
        expect(clock?.rewardType).toBe('money');
        expect(clock?.rewardAmount).toBe(75);
      });

      it('should include Fuel Reserves with correct properties', () => {
        const fuel = cargoItems.find(item => item.id === 'fuel-reserves');
        expect(fuel).toBeDefined();
        expect(fuel?.name).toBe('Fuel Reserves');
        expect(fuel?.icon).toBe('🛢️');
        expect(fuel?.rarity).toBe('rare');
        expect(fuel?.rewardType).toBe('fuel');
        expect(fuel?.rewardAmount).toBe(40);
      });

      it('should include Preserved Feast with correct properties', () => {
        const feast = cargoItems.find(item => item.id === 'preserved-feast');
        expect(feast).toBeDefined();
        expect(feast?.name).toBe('Preserved Feast');
        expect(feast?.icon).toBe('🍱');
        expect(feast?.rarity).toBe('rare');
        expect(feast?.rewardType).toBe('food');
        expect(feast?.rewardAmount).toBe(50);
      });

      it('should include Spring Water with correct properties', () => {
        const water = cargoItems.find(item => item.id === 'spring-water');
        expect(water).toBeDefined();
        expect(water?.name).toBe('Spring Water');
        expect(water?.icon).toBe('💧');
        expect(water?.rarity).toBe('rare');
        expect(water?.rewardType).toBe('water');
        expect(water?.rewardAmount).toBe(50);
      });
    });

    describe('legendary items', () => {
      it('should include Golden Artifact with correct properties', () => {
        const artifact = cargoItems.find(item => item.id === 'golden-artifact');
        expect(artifact).toBeDefined();
        expect(artifact?.name).toBe('Golden Artifact');
        expect(artifact?.icon).toBe('🏆');
        expect(artifact?.rarity).toBe('legendary');
        expect(artifact?.rewardType).toBe('money');
        expect(artifact?.rewardAmount).toBe(200);
      });

      it('should include Engine Core with correct properties', () => {
        const core = cargoItems.find(item => item.id === 'engine-core');
        expect(core).toBeDefined();
        expect(core?.name).toBe('Engine Core');
        expect(core?.icon).toBe('⚡');
        expect(core?.rarity).toBe('legendary');
        expect(core?.rewardType).toBe('fuel');
        expect(core?.rewardAmount).toBe(100);
      });

      it('should include Royal Banquet with correct properties', () => {
        const banquet = cargoItems.find(item => item.id === 'royal-banquet');
        expect(banquet).toBeDefined();
        expect(banquet?.name).toBe('Royal Banquet');
        expect(banquet?.icon).toBe('👑');
        expect(banquet?.rarity).toBe('legendary');
        expect(banquet?.rewardType).toBe('food');
        expect(banquet?.rewardAmount).toBe(100);
      });

      it('should include Crystal Spring with correct properties', () => {
        const crystal = cargoItems.find(item => item.id === 'crystal-spring');
        expect(crystal).toBeDefined();
        expect(crystal?.name).toBe('Crystal Spring');
        expect(crystal?.icon).toBe('💎');
        expect(crystal?.rarity).toBe('legendary');
        expect(crystal?.rewardType).toBe('water');
        expect(crystal?.rewardAmount).toBe(100);
      });
    });
  });

  describe('getCargoByRarity', () => {
    it('should return all common items', () => {
      const commonItems = getCargoByRarity('common');
      expect(commonItems).toHaveLength(4);
      commonItems.forEach(item => {
        expect(item.rarity).toBe('common');
      });
    });

    it('should return all rare items', () => {
      const rareItems = getCargoByRarity('rare');
      expect(rareItems).toHaveLength(4);
      rareItems.forEach(item => {
        expect(item.rarity).toBe('rare');
      });
    });

    it('should return all legendary items', () => {
      const legendaryItems = getCargoByRarity('legendary');
      expect(legendaryItems).toHaveLength(4);
      legendaryItems.forEach(item => {
        expect(item.rarity).toBe('legendary');
      });
    });
  });

  describe('getCargoById', () => {
    it('should return correct item for valid id', () => {
      const toolbox = getCargoById('old-toolbox');
      expect(toolbox).toBeDefined();
      expect(toolbox?.name).toBe('Old Toolbox');
    });

    it('should return undefined for invalid id', () => {
      const notFound = getCargoById('non-existent-cargo');
      expect(notFound).toBeUndefined();
    });

    it('should return correct item for each cargo id', () => {
      cargoItems.forEach(item => {
        const found = getCargoById(item.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(item.id);
        expect(found?.name).toBe(item.name);
      });
    });
  });
});
