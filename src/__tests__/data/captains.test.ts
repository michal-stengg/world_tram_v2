import { describe, it, expect } from 'vitest';
import { captains, getCaptainById } from '../../data/captains';

describe('captains data', () => {
  describe('captains array', () => {
    it('should have 3 captains', () => {
      expect(captains).toHaveLength(3);
    });

    it('should have all required properties for each captain', () => {
      captains.forEach((captain) => {
        expect(captain).toHaveProperty('id');
        expect(captain).toHaveProperty('name');
        expect(captain).toHaveProperty('origin');
        expect(captain).toHaveProperty('description');
        expect(captain).toHaveProperty('portrait');
        expect(captain).toHaveProperty('stats');
        expect(captain.stats).toHaveProperty('engineering');
        expect(captain.stats).toHaveProperty('food');
        expect(captain.stats).toHaveProperty('security');
      });
    });
  });

  describe('Renji', () => {
    it('should have correct data', () => {
      const renji = captains.find((c) => c.id === 'renji');
      expect(renji).toBeDefined();
      expect(renji!.name).toBe('Renji');
      expect(renji!.origin).toBe('Japan');
      expect(renji!.portrait).toBe('🧑‍✈️');
      expect(renji!.description).toBe(
        'A precise and disciplined engineer from Tokyo who keeps trains running on time.'
      );
    });

    it('should have correct stats', () => {
      const renji = captains.find((c) => c.id === 'renji');
      expect(renji!.stats.engineering).toBe(5);
      expect(renji!.stats.food).toBe(2);
      expect(renji!.stats.security).toBe(3);
    });
  });

  describe('Luca', () => {
    it('should have correct data', () => {
      const luca = captains.find((c) => c.id === 'luca');
      expect(luca).toBeDefined();
      expect(luca!.name).toBe('Luca');
      expect(luca!.origin).toBe('Italy');
      expect(luca!.portrait).toBe('👨‍🍳');
      expect(luca!.description).toBe(
        'A passionate chef from Rome who believes good food makes happy passengers.'
      );
    });

    it('should have correct stats', () => {
      const luca = captains.find((c) => c.id === 'luca');
      expect(luca!.stats.engineering).toBe(2);
      expect(luca!.stats.food).toBe(5);
      expect(luca!.stats.security).toBe(3);
    });
  });

  describe('Cooper', () => {
    it('should have correct data', () => {
      const cooper = captains.find((c) => c.id === 'cooper');
      expect(cooper).toBeDefined();
      expect(cooper!.name).toBe('Cooper');
      expect(cooper!.origin).toBe('USA');
      expect(cooper!.portrait).toBe('🤠');
      expect(cooper!.description).toBe(
        'A tough frontier guard from Texas who keeps everyone safe on the rails.'
      );
    });

    it('should have correct stats', () => {
      const cooper = captains.find((c) => c.id === 'cooper');
      expect(cooper!.stats.engineering).toBe(3);
      expect(cooper!.stats.food).toBe(2);
      expect(cooper!.stats.security).toBe(5);
    });
  });

  describe('getCaptainById', () => {
    it('should return correct captain for valid id', () => {
      const renji = getCaptainById('renji');
      expect(renji).toBeDefined();
      expect(renji!.name).toBe('Renji');

      const luca = getCaptainById('luca');
      expect(luca).toBeDefined();
      expect(luca!.name).toBe('Luca');

      const cooper = getCaptainById('cooper');
      expect(cooper).toBeDefined();
      expect(cooper!.name).toBe('Cooper');
    });

    it('should return undefined for invalid id', () => {
      expect(getCaptainById('invalid')).toBeUndefined();
      expect(getCaptainById('')).toBeUndefined();
      expect(getCaptainById('RENJI')).toBeUndefined(); // case sensitive
    });
  });
});
