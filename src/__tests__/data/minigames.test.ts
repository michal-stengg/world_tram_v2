import { describe, it, expect } from 'vitest';
import { minigames, getMiniGameByCountryId } from '../../data/minigames';
import type { MiniGame } from '../../types';

describe('minigames data', () => {
  describe('minigames array', () => {
    it('should have exactly 10 mini-games (one per country)', () => {
      expect(minigames).toHaveLength(10);
    });

    it('should have all required fields for each mini-game', () => {
      minigames.forEach((minigame: MiniGame) => {
        // id field
        expect(minigame.id).toBeDefined();
        expect(typeof minigame.id).toBe('string');
        expect(minigame.id.length).toBeGreaterThan(0);

        // name field
        expect(minigame.name).toBeDefined();
        expect(typeof minigame.name).toBe('string');
        expect(minigame.name.length).toBeGreaterThan(0);

        // countryId field
        expect(minigame.countryId).toBeDefined();
        expect(typeof minigame.countryId).toBe('string');
        expect(minigame.countryId.length).toBeGreaterThan(0);

        // type field (must be one of the valid types)
        expect(minigame.type).toBeDefined();
        expect(['catcher', 'memory', 'timing']).toContain(minigame.type);

        // icon field
        expect(minigame.icon).toBeDefined();
        expect(typeof minigame.icon).toBe('string');
        expect(minigame.icon.length).toBeGreaterThan(0);

        // description field
        expect(minigame.description).toBeDefined();
        expect(typeof minigame.description).toBe('string');
        expect(minigame.description.length).toBeGreaterThan(0);

        // rewardType field (must be one of the valid types)
        expect(minigame.rewardType).toBeDefined();
        expect(['food', 'money']).toContain(minigame.rewardType);

        // maxReward field
        expect(minigame.maxReward).toBeDefined();
        expect(typeof minigame.maxReward).toBe('number');
        expect(minigame.maxReward).toBeGreaterThan(0);
      });
    });

    it('should have unique IDs for each mini-game', () => {
      const ids = minigames.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(minigames.length);
    });

    it('should have unique countryIds for each mini-game', () => {
      const countryIds = minigames.map((m) => m.countryId);
      const uniqueCountryIds = new Set(countryIds);
      expect(uniqueCountryIds.size).toBe(minigames.length);
    });

    it('should cover all 10 countries', () => {
      const expectedCountryIds = [
        'france',
        'germany',
        'russia',
        'china',
        'japan',
        'singapore',
        'australia',
        'brazil',
        'canada',
        'usa',
      ];
      const actualCountryIds = minigames.map((m) => m.countryId).sort();
      expect(actualCountryIds).toEqual(expectedCountryIds.sort());
    });

    it('should have correct data for each mini-game', () => {
      const minigameData: Record<string, Partial<MiniGame>> = {
        france: {
          name: 'Croissant Catcher',
          type: 'catcher',
          rewardType: 'money',
          maxReward: 38,
          icon: '🥐',
          description: 'Catch falling croissants!',
        },
        germany: {
          name: 'Beer Stein Balance',
          type: 'timing',
          rewardType: 'money',
          maxReward: 75,
          icon: '🍺',
          description: 'Balance the stein at the right moment!',
        },
        russia: {
          name: 'Matryoshka Match',
          type: 'memory',
          rewardType: 'money',
          maxReward: 60,
          icon: '🪆',
          description: 'Match the nesting dolls!',
        },
        china: {
          name: 'Dumpling Catch',
          type: 'catcher',
          rewardType: 'money',
          maxReward: 38,
          icon: '🥟',
          description: 'Catch the dumplings!',
        },
        japan: {
          name: 'Sushi Sort',
          type: 'timing',
          rewardType: 'money',
          maxReward: 38,
          icon: '🍣',
          description: 'Sort sushi at the perfect time!',
        },
        singapore: {
          name: 'Night Market Grab',
          type: 'catcher',
          rewardType: 'money',
          maxReward: 75,
          icon: '🏮',
          description: 'Grab treats at the night market!',
        },
        australia: {
          name: 'Boomerang Catch',
          type: 'timing',
          rewardType: 'money',
          maxReward: 60,
          icon: '🪃',
          description: 'Time your catch perfectly!',
        },
        brazil: {
          name: 'Carnival Rhythm',
          type: 'timing',
          rewardType: 'money',
          maxReward: 75,
          icon: '🎭',
          description: 'Hit the beat!',
        },
        canada: {
          name: 'Maple Syrup Pour',
          type: 'timing',
          rewardType: 'money',
          maxReward: 38,
          icon: '🍁',
          description: 'Pour the perfect amount!',
        },
        usa: {
          name: 'Hot Dog Stack',
          type: 'catcher',
          rewardType: 'money',
          maxReward: 38,
          icon: '🌭',
          description: 'Stack those hot dogs!',
        },
      };

      minigames.forEach((minigame) => {
        const expected = minigameData[minigame.countryId];
        expect(minigame.name).toBe(expected.name);
        expect(minigame.type).toBe(expected.type);
        expect(minigame.rewardType).toBe(expected.rewardType);
        expect(minigame.maxReward).toBe(expected.maxReward);
        expect(minigame.icon).toBe(expected.icon);
        expect(minigame.description).toBe(expected.description);
      });
    });
  });

  describe('getMiniGameByCountryId', () => {
    it('should return the correct mini-game for France', () => {
      const minigame = getMiniGameByCountryId('france');
      expect(minigame).toBeDefined();
      expect(minigame?.name).toBe('Croissant Catcher');
      expect(minigame?.icon).toBe('🥐');
    });

    it('should return the correct mini-game for USA', () => {
      const minigame = getMiniGameByCountryId('usa');
      expect(minigame).toBeDefined();
      expect(minigame?.name).toBe('Hot Dog Stack');
      expect(minigame?.icon).toBe('🌭');
    });

    it('should return correct mini-game for each valid country ID', () => {
      minigames.forEach((expected) => {
        const actual = getMiniGameByCountryId(expected.countryId);
        expect(actual).toEqual(expected);
      });
    });

    it('should return undefined for invalid country ID', () => {
      expect(getMiniGameByCountryId('invalid')).toBeUndefined();
      expect(getMiniGameByCountryId('')).toBeUndefined();
      expect(getMiniGameByCountryId('FRANCE')).toBeUndefined(); // case sensitive
    });
  });
});
