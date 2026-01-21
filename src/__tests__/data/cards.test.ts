import { describe, it, expect } from 'vitest';
import { cards, getCardById } from '../../data/cards';

describe('cards data', () => {
  describe('cards array', () => {
    it('should have at least 6 cards', () => {
      expect(cards.length).toBeGreaterThanOrEqual(6);
    });

    it('should have all required properties for each card', () => {
      cards.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('stat');
        expect(card).toHaveProperty('bonus');
        expect(card).toHaveProperty('description');
      });
    });

    it('should have valid stat types for each card', () => {
      const validStats = ['engineering', 'food', 'security'];
      cards.forEach((card) => {
        expect(validStats).toContain(card.stat);
      });
    });

    it('should have bonus values in valid range (2-4)', () => {
      cards.forEach((card) => {
        expect(card.bonus).toBeGreaterThanOrEqual(2);
        expect(card.bonus).toBeLessThanOrEqual(4);
      });
    });

    it('should have unique ids for each card', () => {
      const ids = cards.map((card) => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('stat coverage', () => {
    it('should have at least 2 cards for engineering stat', () => {
      const engineeringCards = cards.filter((card) => card.stat === 'engineering');
      expect(engineeringCards.length).toBeGreaterThanOrEqual(2);
    });

    it('should have at least 2 cards for food stat', () => {
      const foodCards = cards.filter((card) => card.stat === 'food');
      expect(foodCards.length).toBeGreaterThanOrEqual(2);
    });

    it('should have at least 2 cards for security stat', () => {
      const securityCards = cards.filter((card) => card.stat === 'security');
      expect(securityCards.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Security Patrol card', () => {
    it('should have correct data', () => {
      const card = cards.find((c) => c.id === 'security-patrol');
      expect(card).toBeDefined();
      expect(card!.name).toBe('Security Patrol');
      expect(card!.stat).toBe('security');
      expect(card!.bonus).toBeGreaterThanOrEqual(2);
      expect(card!.description).toBeTruthy();
    });
  });

  describe('Quick Repairs card', () => {
    it('should have correct data', () => {
      const card = cards.find((c) => c.id === 'quick-repairs');
      expect(card).toBeDefined();
      expect(card!.name).toBe('Quick Repairs');
      expect(card!.stat).toBe('engineering');
      expect(card!.bonus).toBeGreaterThanOrEqual(2);
      expect(card!.description).toBeTruthy();
    });
  });

  describe('Emergency Rations card', () => {
    it('should have correct data', () => {
      const card = cards.find((c) => c.id === 'emergency-rations');
      expect(card).toBeDefined();
      expect(card!.name).toBe('Emergency Rations');
      expect(card!.stat).toBe('food');
      expect(card!.bonus).toBeGreaterThanOrEqual(2);
      expect(card!.description).toBeTruthy();
    });
  });

  describe('Armed Guard card', () => {
    it('should have correct data', () => {
      const card = cards.find((c) => c.id === 'armed-guard');
      expect(card).toBeDefined();
      expect(card!.name).toBe('Armed Guard');
      expect(card!.stat).toBe('security');
      expect(card!.bonus).toBeGreaterThanOrEqual(2);
      expect(card!.description).toBeTruthy();
    });
  });

  describe('Backup Generator card', () => {
    it('should have correct data', () => {
      const card = cards.find((c) => c.id === 'backup-generator');
      expect(card).toBeDefined();
      expect(card!.name).toBe('Backup Generator');
      expect(card!.stat).toBe('engineering');
      expect(card!.bonus).toBeGreaterThanOrEqual(2);
      expect(card!.description).toBeTruthy();
    });
  });

  describe('Medical Supplies card', () => {
    it('should have correct data', () => {
      const card = cards.find((c) => c.id === 'medical-supplies');
      expect(card).toBeDefined();
      expect(card!.name).toBe('Medical Supplies');
      expect(card!.stat).toBe('food');
      expect(card!.bonus).toBeGreaterThanOrEqual(2);
      expect(card!.description).toBeTruthy();
    });
  });

  describe('getCardById', () => {
    it('should return correct card for valid id', () => {
      const securityPatrol = getCardById('security-patrol');
      expect(securityPatrol).toBeDefined();
      expect(securityPatrol!.name).toBe('Security Patrol');

      const quickRepairs = getCardById('quick-repairs');
      expect(quickRepairs).toBeDefined();
      expect(quickRepairs!.name).toBe('Quick Repairs');

      const emergencyRations = getCardById('emergency-rations');
      expect(emergencyRations).toBeDefined();
      expect(emergencyRations!.name).toBe('Emergency Rations');
    });

    it('should return undefined for invalid id', () => {
      expect(getCardById('invalid')).toBeUndefined();
      expect(getCardById('')).toBeUndefined();
      expect(getCardById('SECURITY-PATROL')).toBeUndefined(); // case sensitive
    });
  });
});
