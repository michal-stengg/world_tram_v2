/**
 * Tests for event trigger logic
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shouldTriggerEvent, selectRandomEvent, resolveEvent } from '../../logic/events';
import { events } from '../../data/events';
import type { GameEvent } from '../../data/events';
import type { BonusCard } from '../../data/cards';
import type { CrewMember, CrewRole } from '../../types';

describe('Event Trigger Logic', () => {
  describe('shouldTriggerEvent', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return a boolean', () => {
      const result = shouldTriggerEvent();
      expect(typeof result).toBe('boolean');
    });

    it('should return true when random value is less than 0.4', () => {
      vi.mocked(Math.random).mockReturnValue(0.39);
      expect(shouldTriggerEvent()).toBe(true);
    });

    it('should return false when random value is 0.4 or greater', () => {
      vi.mocked(Math.random).mockReturnValue(0.4);
      expect(shouldTriggerEvent()).toBe(false);

      vi.mocked(Math.random).mockReturnValue(0.5);
      expect(shouldTriggerEvent()).toBe(false);
    });

    it('should trigger approximately 40% of the time (statistical test)', () => {
      vi.restoreAllMocks(); // Use real random for statistical test

      const iterations = 1000;
      let triggerCount = 0;

      for (let i = 0; i < iterations; i++) {
        if (shouldTriggerEvent()) {
          triggerCount++;
        }
      }

      const triggerRate = triggerCount / iterations;
      // Allow for statistical variance (30% to 50%)
      expect(triggerRate).toBeGreaterThan(0.30);
      expect(triggerRate).toBeLessThan(0.50);
    });
  });

  describe('selectRandomEvent', () => {
    beforeEach(() => {
      vi.spyOn(Math, 'random');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should return a valid GameEvent', () => {
      const event = selectRandomEvent();

      expect(event).toBeDefined();
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('statTested');
      expect(event).toHaveProperty('difficulty');
      expect(event).toHaveProperty('penalty');
    });

    it('should return an event from the events array', () => {
      const event = selectRandomEvent();

      const foundEvent = events.find(e => e.id === event.id);
      expect(foundEvent).toBeDefined();
    });

    it('should return the first event when random returns 0', () => {
      vi.mocked(Math.random).mockReturnValue(0);
      const event = selectRandomEvent();

      expect(event.id).toBe(events[0].id);
    });

    it('should return the last event when random returns value close to 1', () => {
      vi.mocked(Math.random).mockReturnValue(0.999);
      const event = selectRandomEvent();

      expect(event.id).toBe(events[events.length - 1].id);
    });

    it('should return different events over multiple calls (distribution test)', () => {
      vi.restoreAllMocks(); // Use real random for distribution test

      const selectedIds = new Set<string>();
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const event = selectRandomEvent();
        selectedIds.add(event.id);
      }

      // With 5 events and 100 iterations, we should see at least 3 different events
      expect(selectedIds.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('resolveEvent', () => {
    const mockEvent: GameEvent = {
      id: 'test-event',
      name: 'Test Event',
      description: 'A test event',
      statTested: 'engineering',
      difficulty: 10,
      penalty: {
        type: 'resource',
        resource: 'fuel',
        amount: 20,
      },
    };

    const mockCaptainStats = {
      engineering: 3,
      food: 2,
      security: 1,
    };

    it('should calculate total correctly with dice roll and captain stat only', () => {
      const result = resolveEvent(mockEvent, [], mockCaptainStats, 5);

      // Total = dice (5) + captain engineering (3) = 8
      expect(result.total).toBe(8);
    });

    it('should return success when total >= difficulty', () => {
      // dice (7) + captain engineering (3) = 10 >= difficulty (10)
      const result = resolveEvent(mockEvent, [], mockCaptainStats, 7);

      expect(result.success).toBe(true);
      expect(result.total).toBe(10);
    });

    it('should return failure when total < difficulty', () => {
      // dice (5) + captain engineering (3) = 8 < difficulty (10)
      const result = resolveEvent(mockEvent, [], mockCaptainStats, 5);

      expect(result.success).toBe(false);
      expect(result.total).toBe(8);
    });

    it('should include penalty when event fails', () => {
      const result = resolveEvent(mockEvent, [], mockCaptainStats, 5);

      expect(result.success).toBe(false);
      expect(result.penalty).toEqual({
        type: 'resource',
        resource: 'fuel',
        amount: 20,
      });
    });

    it('should not include penalty when event succeeds', () => {
      const result = resolveEvent(mockEvent, [], mockCaptainStats, 7);

      expect(result.success).toBe(true);
      expect(result.penalty).toBeUndefined();
    });

    it('should add matching card bonuses to total', () => {
      const matchingCard: BonusCard = {
        id: 'test-card',
        name: 'Engineering Card',
        stat: 'engineering',
        bonus: 4,
        description: 'Test card',
      };

      // dice (5) + captain engineering (3) + card bonus (4) = 12
      const result = resolveEvent(mockEvent, [matchingCard], mockCaptainStats, 5);

      expect(result.total).toBe(12);
      expect(result.success).toBe(true);
    });

    it('should not add card bonuses when stat does not match event', () => {
      const nonMatchingCard: BonusCard = {
        id: 'test-card',
        name: 'Security Card',
        stat: 'security',
        bonus: 4,
        description: 'Test card',
      };

      // dice (5) + captain engineering (3) + card bonus (0, no match) = 8
      const result = resolveEvent(mockEvent, [nonMatchingCard], mockCaptainStats, 5);

      expect(result.total).toBe(8);
      expect(result.success).toBe(false);
    });

    it('should add multiple matching card bonuses', () => {
      const card1: BonusCard = {
        id: 'card-1',
        name: 'Engineering Card 1',
        stat: 'engineering',
        bonus: 3,
        description: 'Test card 1',
      };
      const card2: BonusCard = {
        id: 'card-2',
        name: 'Engineering Card 2',
        stat: 'engineering',
        bonus: 2,
        description: 'Test card 2',
      };

      // dice (5) + captain engineering (3) + card1 (3) + card2 (2) = 13
      const result = resolveEvent(mockEvent, [card1, card2], mockCaptainStats, 5);

      expect(result.total).toBe(13);
      expect(result.success).toBe(true);
    });

    it('should only add bonuses from cards with matching stat', () => {
      const matchingCard: BonusCard = {
        id: 'card-1',
        name: 'Engineering Card',
        stat: 'engineering',
        bonus: 3,
        description: 'Test card',
      };
      const nonMatchingCard: BonusCard = {
        id: 'card-2',
        name: 'Food Card',
        stat: 'food',
        bonus: 4,
        description: 'Test card',
      };

      // dice (5) + captain engineering (3) + matching card (3) = 11
      const result = resolveEvent(mockEvent, [matchingCard, nonMatchingCard], mockCaptainStats, 5);

      expect(result.total).toBe(11);
      expect(result.success).toBe(true);
    });

    it('should use the correct captain stat based on event statTested', () => {
      const securityEvent: GameEvent = {
        id: 'security-event',
        name: 'Security Event',
        description: 'A security test event',
        statTested: 'security',
        difficulty: 8,
        penalty: {
          type: 'resource',
          resource: 'money',
          amount: 50,
        },
      };

      // dice (5) + captain security (1) = 6
      const result = resolveEvent(securityEvent, [], mockCaptainStats, 5);

      expect(result.total).toBe(6);
      expect(result.success).toBe(false);
    });

    it('should handle food stat events correctly', () => {
      const foodEvent: GameEvent = {
        id: 'food-event',
        name: 'Food Event',
        description: 'A food test event',
        statTested: 'food',
        difficulty: 6,
        penalty: {
          type: 'resource',
          resource: 'food',
          amount: 25,
        },
      };

      // dice (5) + captain food (2) = 7
      const result = resolveEvent(foodEvent, [], mockCaptainStats, 5);

      expect(result.total).toBe(7);
      expect(result.success).toBe(true);
    });

    it('should handle progress penalty type', () => {
      const progressEvent: GameEvent = {
        id: 'progress-event',
        name: 'Progress Event',
        description: 'A progress penalty event',
        statTested: 'engineering',
        difficulty: 15,
        penalty: {
          type: 'progress',
          amount: 5,
        },
      };

      const result = resolveEvent(progressEvent, [], mockCaptainStats, 5);

      expect(result.success).toBe(false);
      expect(result.penalty).toEqual({
        type: 'progress',
        amount: 5,
      });
    });

    describe('crew bonus', () => {
      const createCrew = (roles: CrewRole[]): CrewMember[] => {
        return roles.map((role, i) => ({
          id: `crew-${i}`,
          name: `Crew ${i}`,
          role,
          avatar: '👤',
        }));
      };

      it('should not include crew bonus when crew is not provided', () => {
        // dice (5) + captain engineering (3) = 8
        const result = resolveEvent(mockEvent, [], mockCaptainStats, 5);
        expect(result.total).toBe(8);
      });

      it('should not include crew bonus when crew is empty', () => {
        // dice (5) + captain engineering (3) + crew (0) = 8
        const result = resolveEvent(mockEvent, [], mockCaptainStats, 5, []);
        expect(result.total).toBe(8);
      });

      it('should add crew bonus for matching role (engineer -> engineering)', () => {
        const crew = createCrew(['engineer', 'cook', 'security']);
        // dice (5) + captain engineering (3) + crew bonus (1) = 9
        const result = resolveEvent(mockEvent, [], mockCaptainStats, 5, crew);
        expect(result.total).toBe(9);
      });

      it('should add crew bonus for multiple matching roles', () => {
        const crew = createCrew(['engineer', 'engineer', 'cook', 'security']);
        // dice (5) + captain engineering (3) + crew bonus (2) = 10
        const result = resolveEvent(mockEvent, [], mockCaptainStats, 5, crew);
        expect(result.total).toBe(10);
        expect(result.success).toBe(true); // exactly meets difficulty of 10
      });

      it('should add cook bonus for food events', () => {
        const foodEvent: GameEvent = {
          id: 'food-event',
          name: 'Food Event',
          description: 'A food test event',
          statTested: 'food',
          difficulty: 10,
          penalty: { type: 'resource', resource: 'food', amount: 25 },
        };
        const crew = createCrew(['engineer', 'cook', 'cook', 'security']);
        // dice (5) + captain food (2) + crew bonus (2) = 9
        const result = resolveEvent(foodEvent, [], mockCaptainStats, 5, crew);
        expect(result.total).toBe(9);
      });

      it('should add security bonus for security events', () => {
        const securityEvent: GameEvent = {
          id: 'security-event',
          name: 'Security Event',
          description: 'A security test event',
          statTested: 'security',
          difficulty: 8,
          penalty: { type: 'resource', resource: 'money', amount: 50 },
        };
        const crew = createCrew(['engineer', 'cook', 'security', 'security']);
        // dice (5) + captain security (1) + crew bonus (2) = 8
        const result = resolveEvent(securityEvent, [], mockCaptainStats, 5, crew);
        expect(result.total).toBe(8);
        expect(result.success).toBe(true); // exactly meets difficulty
      });

      it('should combine all bonuses: dice + captain + cards + crew', () => {
        const matchingCard: BonusCard = {
          id: 'test-card',
          name: 'Engineering Card',
          stat: 'engineering',
          bonus: 2,
          description: 'Test card',
        };
        const crew = createCrew(['engineer', 'engineer', 'cook', 'security']);
        // dice (5) + captain engineering (3) + card bonus (2) + crew bonus (2) = 12
        const result = resolveEvent(mockEvent, [matchingCard], mockCaptainStats, 5, crew);
        expect(result.total).toBe(12);
        expect(result.success).toBe(true);
      });

      it('should not count free crew members', () => {
        const crew = createCrew(['free', 'free', 'free', 'engineer']);
        // dice (5) + captain engineering (3) + crew bonus (1) = 9
        const result = resolveEvent(mockEvent, [], mockCaptainStats, 5, crew);
        expect(result.total).toBe(9);
      });
    });
  });
});
