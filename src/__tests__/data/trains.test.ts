import { describe, it, expect } from 'vitest';
import { trains, getTrainById } from '../../data/trains';

describe('trains data', () => {
  describe('trains array', () => {
    it('should have exactly 3 trains', () => {
      expect(trains).toHaveLength(3);
    });

    it('should have trains with required properties', () => {
      trains.forEach((train) => {
        expect(train).toHaveProperty('id');
        expect(train).toHaveProperty('name');
        expect(train).toHaveProperty('origin');
        expect(train).toHaveProperty('character');
        expect(train).toHaveProperty('sprite');
        expect(train).toHaveProperty('stats');
        expect(train.stats).toHaveProperty('speed');
        expect(train.stats).toHaveProperty('reliability');
        expect(train.stats).toHaveProperty('power');
      });
    });
  });

  describe('Blitzzug', () => {
    it('should have correct properties', () => {
      const blitzzug = trains.find((t) => t.id === 'blitzzug');
      expect(blitzzug).toBeDefined();
      expect(blitzzug!.name).toBe('Blitzzug');
      expect(blitzzug!.origin).toBe('Germany');
      expect(blitzzug!.sprite).toBe('🚄');
    });

    it('should have correct stats (speed 3, reliability 5, power 3)', () => {
      const blitzzug = trains.find((t) => t.id === 'blitzzug');
      expect(blitzzug!.stats.speed).toBe(3);
      expect(blitzzug!.stats.reliability).toBe(5);
      expect(blitzzug!.stats.power).toBe(3);
    });
  });

  describe('Kitsune', () => {
    it('should have correct properties', () => {
      const kitsune = trains.find((t) => t.id === 'kitsune');
      expect(kitsune).toBeDefined();
      expect(kitsune!.name).toBe('Kitsune');
      expect(kitsune!.origin).toBe('Japan');
      expect(kitsune!.sprite).toBe('🦊');
    });

    it('should have correct stats (speed 5, reliability 3, power 3)', () => {
      const kitsune = trains.find((t) => t.id === 'kitsune');
      expect(kitsune!.stats.speed).toBe(5);
      expect(kitsune!.stats.reliability).toBe(3);
      expect(kitsune!.stats.power).toBe(3);
    });
  });

  describe('Ironhorse', () => {
    it('should have correct properties', () => {
      const ironhorse = trains.find((t) => t.id === 'ironhorse');
      expect(ironhorse).toBeDefined();
      expect(ironhorse!.name).toBe('Ironhorse');
      expect(ironhorse!.origin).toBe('USA');
      expect(ironhorse!.sprite).toBe('🚂');
    });

    it('should have correct stats (speed 3, reliability 3, power 5)', () => {
      const ironhorse = trains.find((t) => t.id === 'ironhorse');
      expect(ironhorse!.stats.speed).toBe(3);
      expect(ironhorse!.stats.reliability).toBe(3);
      expect(ironhorse!.stats.power).toBe(5);
    });
  });

  describe('getTrainById', () => {
    it('should return correct train for valid id', () => {
      const blitzzug = getTrainById('blitzzug');
      expect(blitzzug).toBeDefined();
      expect(blitzzug!.name).toBe('Blitzzug');

      const kitsune = getTrainById('kitsune');
      expect(kitsune).toBeDefined();
      expect(kitsune!.name).toBe('Kitsune');

      const ironhorse = getTrainById('ironhorse');
      expect(ironhorse).toBeDefined();
      expect(ironhorse!.name).toBe('Ironhorse');
    });

    it('should return undefined for invalid id', () => {
      expect(getTrainById('nonexistent')).toBeUndefined();
      expect(getTrainById('')).toBeUndefined();
      expect(getTrainById('BLITZZUG')).toBeUndefined(); // case sensitive
    });
  });
});
