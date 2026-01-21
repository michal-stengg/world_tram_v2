import { describe, it, expect } from 'vitest'
import { startingCrew, getCrewMemberById } from '../../data/crew'

describe('crew data', () => {
  describe('startingCrew array', () => {
    it('should have 4 crew members', () => {
      expect(startingCrew).toHaveLength(4);
    });

    it('should have all required properties for each crew member', () => {
      startingCrew.forEach((member) => {
        expect(member).toHaveProperty('id');
        expect(member).toHaveProperty('name');
        expect(member).toHaveProperty('role');
        expect(member).toHaveProperty('avatar');
      });
    });

    it('should have one of each role (engineer, cook, security, free)', () => {
      const roles = startingCrew.map((member) => member.role);
      expect(roles).toContain('engineer');
      expect(roles).toContain('cook');
      expect(roles).toContain('security');
      expect(roles).toContain('free');
    });
  });

  describe('Tom', () => {
    it('should have correct data', () => {
      const tom = startingCrew.find((c) => c.id === 'tom');
      expect(tom).toBeDefined();
      expect(tom!.name).toBe('Tom');
      expect(tom!.role).toBe('engineer');
      expect(tom!.avatar).toBe('👨‍🔧');
    });
  });

  describe('Maria', () => {
    it('should have correct data', () => {
      const maria = startingCrew.find((c) => c.id === 'maria');
      expect(maria).toBeDefined();
      expect(maria!.name).toBe('Maria');
      expect(maria!.role).toBe('cook');
      expect(maria!.avatar).toBe('👩‍🍳');
    });
  });

  describe('Jack', () => {
    it('should have correct data', () => {
      const jack = startingCrew.find((c) => c.id === 'jack');
      expect(jack).toBeDefined();
      expect(jack!.name).toBe('Jack');
      expect(jack!.role).toBe('security');
      expect(jack!.avatar).toBe('💂');
    });
  });

  describe('Sam', () => {
    it('should have correct data', () => {
      const sam = startingCrew.find((c) => c.id === 'sam');
      expect(sam).toBeDefined();
      expect(sam!.name).toBe('Sam');
      expect(sam!.role).toBe('free');
      expect(sam!.avatar).toBe('👤');
    });
  });

  describe('getCrewMemberById', () => {
    it('should return correct crew member for valid id', () => {
      const tom = getCrewMemberById('tom');
      expect(tom).toBeDefined();
      expect(tom!.name).toBe('Tom');

      const maria = getCrewMemberById('maria');
      expect(maria).toBeDefined();
      expect(maria!.name).toBe('Maria');

      const jack = getCrewMemberById('jack');
      expect(jack).toBeDefined();
      expect(jack!.name).toBe('Jack');

      const sam = getCrewMemberById('sam');
      expect(sam).toBeDefined();
      expect(sam!.name).toBe('Sam');
    });

    it('should return undefined for invalid id', () => {
      expect(getCrewMemberById('invalid')).toBeUndefined();
      expect(getCrewMemberById('')).toBeUndefined();
      expect(getCrewMemberById('TOM')).toBeUndefined(); // case sensitive
    });
  });
});
