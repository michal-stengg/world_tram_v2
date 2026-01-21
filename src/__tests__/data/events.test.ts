import { describe, it, expect } from 'vitest';
import { events, getEventById } from '../../data/events';

describe('events data', () => {
  describe('events array', () => {
    it('should have at least 5 events', () => {
      expect(events.length).toBeGreaterThanOrEqual(5);
    });

    it('should have all required properties for each event', () => {
      events.forEach((event) => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('name');
        expect(event).toHaveProperty('description');
        expect(event).toHaveProperty('statTested');
        expect(event).toHaveProperty('difficulty');
        expect(event).toHaveProperty('penalty');
      });
    });

    it('should have valid statTested values', () => {
      const validStats = ['engineering', 'food', 'security'];
      events.forEach((event) => {
        expect(validStats).toContain(event.statTested);
      });
    });

    it('should have difficulty in valid range (8-12)', () => {
      events.forEach((event) => {
        expect(event.difficulty).toBeGreaterThanOrEqual(8);
        expect(event.difficulty).toBeLessThanOrEqual(12);
      });
    });

    it('should have valid penalty structure', () => {
      const validPenaltyTypes = ['resource', 'progress'];
      const validResources = ['food', 'fuel', 'water', 'money'];

      events.forEach((event) => {
        expect(validPenaltyTypes).toContain(event.penalty.type);
        expect(event.penalty.amount).toBeGreaterThan(0);

        if (event.penalty.type === 'resource') {
          expect(event.penalty.resource).toBeDefined();
          expect(validResources).toContain(event.penalty.resource);
        }
      });
    });

    it('should have unique event ids', () => {
      const ids = events.map((e) => e.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Bandit Attack', () => {
    it('should exist and test security stat', () => {
      const banditAttack = events.find((e) => e.id === 'bandit-attack');
      expect(banditAttack).toBeDefined();
      expect(banditAttack!.name).toBe('Bandit Attack');
      expect(banditAttack!.statTested).toBe('security');
    });
  });

  describe('Engine Failure', () => {
    it('should exist and test engineering stat', () => {
      const engineFailure = events.find((e) => e.id === 'engine-failure');
      expect(engineFailure).toBeDefined();
      expect(engineFailure!.name).toBe('Engine Failure');
      expect(engineFailure!.statTested).toBe('engineering');
    });
  });

  describe('Food Spoilage', () => {
    it('should exist and test food stat', () => {
      const foodSpoilage = events.find((e) => e.id === 'food-spoilage');
      expect(foodSpoilage).toBeDefined();
      expect(foodSpoilage!.name).toBe('Food Spoilage');
      expect(foodSpoilage!.statTested).toBe('food');
    });
  });

  describe('Storm', () => {
    it('should exist and test engineering stat', () => {
      const storm = events.find((e) => e.id === 'storm');
      expect(storm).toBeDefined();
      expect(storm!.name).toBe('Storm');
      expect(storm!.statTested).toBe('engineering');
    });
  });

  describe('Crew Sickness', () => {
    it('should exist and test food stat', () => {
      const crewSickness = events.find((e) => e.id === 'crew-sickness');
      expect(crewSickness).toBeDefined();
      expect(crewSickness!.name).toBe('Crew Sickness');
      expect(crewSickness!.statTested).toBe('food');
    });
  });

  describe('getEventById', () => {
    it('should return correct event for valid id', () => {
      const banditAttack = getEventById('bandit-attack');
      expect(banditAttack).toBeDefined();
      expect(banditAttack!.name).toBe('Bandit Attack');

      const engineFailure = getEventById('engine-failure');
      expect(engineFailure).toBeDefined();
      expect(engineFailure!.name).toBe('Engine Failure');

      const storm = getEventById('storm');
      expect(storm).toBeDefined();
      expect(storm!.name).toBe('Storm');
    });

    it('should return undefined for invalid id', () => {
      expect(getEventById('invalid')).toBeUndefined();
      expect(getEventById('')).toBeUndefined();
      expect(getEventById('BANDIT-ATTACK')).toBeUndefined(); // case sensitive
    });
  });
});
