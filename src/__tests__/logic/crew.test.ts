import { describe, it, expect } from 'vitest'
import { cycleRole, calculateEngineerBonus, calculateSecurityBonus, calculateCrewEventBonus } from '../../logic/crew'
import type { CrewRole, CrewMember } from '../../types'

describe('crew logic', () => {
  describe('cycleRole', () => {
    it('should cycle engineer to cook', () => {
      const result = cycleRole('engineer')
      expect(result).toBe('cook')
    })

    it('should cycle cook to security', () => {
      const result = cycleRole('cook')
      expect(result).toBe('security')
    })

    it('should cycle security to free', () => {
      const result = cycleRole('security')
      expect(result).toBe('free')
    })

    it('should cycle free back to engineer', () => {
      const result = cycleRole('free')
      expect(result).toBe('engineer')
    })

    it('should complete a full cycle back to the starting role', () => {
      const startRole: CrewRole = 'engineer'
      let role: CrewRole = startRole

      // Cycle through all four roles
      role = cycleRole(role) // engineer -> cook
      role = cycleRole(role) // cook -> security
      role = cycleRole(role) // security -> free
      role = cycleRole(role) // free -> engineer

      expect(role).toBe(startRole)
    })
  })

  describe('calculateEngineerBonus', () => {
    it('should return 0 fuel savings with 0 engineers', () => {
      const result = calculateEngineerBonus(0)
      expect(result).toBe(0)
    })

    it('should return 2 fuel savings with 1 engineer', () => {
      const result = calculateEngineerBonus(1)
      expect(result).toBe(2)
    })

    it('should return 4 fuel savings with 2 engineers', () => {
      const result = calculateEngineerBonus(2)
      expect(result).toBe(4)
    })

    it('should return 6 fuel savings with 3 engineers', () => {
      const result = calculateEngineerBonus(3)
      expect(result).toBe(6)
    })

    it('should handle negative engineer count as 0', () => {
      const result = calculateEngineerBonus(-1)
      expect(result).toBe(0)
    })

    it('should scale linearly with engineer count', () => {
      const bonus1 = calculateEngineerBonus(1)
      const bonus2 = calculateEngineerBonus(2)
      const bonus4 = calculateEngineerBonus(4)

      expect(bonus2).toBe(bonus1 * 2)
      expect(bonus4).toBe(bonus1 * 4)
    })
  })

  describe('calculateSecurityBonus', () => {
    it('should return 1.0 (full penalty) with 0 security crew', () => {
      const result = calculateSecurityBonus(0)
      expect(result).toBe(1.0)
    })

    it('should return 0.85 with 1 security crew', () => {
      const result = calculateSecurityBonus(1)
      expect(result).toBe(0.85)
    })

    it('should return 0.70 with 2 security crew', () => {
      const result = calculateSecurityBonus(2)
      expect(result).toBe(0.70)
    })

    it('should return 0.55 with 3 security crew', () => {
      const result = calculateSecurityBonus(3)
      expect(result).toBe(0.55)
    })

    it('should return 0.40 with 4 security crew', () => {
      const result = calculateSecurityBonus(4)
      expect(result).toBe(0.40)
    })

    it('should cap at 4 security crew (0.40 multiplier)', () => {
      const result = calculateSecurityBonus(5)
      expect(result).toBe(0.40)
    })

    it('should handle negative security count as 0', () => {
      const result = calculateSecurityBonus(-1)
      expect(result).toBe(1.0)
    })

    it('should never return below 0.40', () => {
      const result = calculateSecurityBonus(10)
      expect(result).toBeGreaterThanOrEqual(0.40)
    })
  })

  describe('calculateCrewEventBonus', () => {
    const createCrew = (roles: CrewRole[]): CrewMember[] => {
      return roles.map((role, i) => ({
        id: `crew-${i}`,
        name: `Crew ${i}`,
        role,
        avatar: '👤',
      }))
    }

    it('should return 0 with empty crew', () => {
      const result = calculateCrewEventBonus([], 'engineering')
      expect(result).toBe(0)
    })

    it('should return 0 when no crew match the stat', () => {
      const crew = createCrew(['cook', 'cook', 'free'])
      const result = calculateCrewEventBonus(crew, 'engineering')
      expect(result).toBe(0)
    })

    it('should return 1 for one engineer on engineering event', () => {
      const crew = createCrew(['engineer', 'cook', 'security'])
      const result = calculateCrewEventBonus(crew, 'engineering')
      expect(result).toBe(1)
    })

    it('should return 2 for two engineers on engineering event', () => {
      const crew = createCrew(['engineer', 'engineer', 'cook', 'security'])
      const result = calculateCrewEventBonus(crew, 'engineering')
      expect(result).toBe(2)
    })

    it('should return 1 for one cook on food event', () => {
      const crew = createCrew(['engineer', 'cook', 'security'])
      const result = calculateCrewEventBonus(crew, 'food')
      expect(result).toBe(1)
    })

    it('should return 3 for three cooks on food event', () => {
      const crew = createCrew(['cook', 'cook', 'cook', 'security'])
      const result = calculateCrewEventBonus(crew, 'food')
      expect(result).toBe(3)
    })

    it('should return 1 for one security on security event', () => {
      const crew = createCrew(['engineer', 'cook', 'security'])
      const result = calculateCrewEventBonus(crew, 'security')
      expect(result).toBe(1)
    })

    it('should return 2 for two security on security event', () => {
      const crew = createCrew(['security', 'security', 'cook', 'engineer'])
      const result = calculateCrewEventBonus(crew, 'security')
      expect(result).toBe(2)
    })

    it('should not count free crew members', () => {
      const crew = createCrew(['free', 'free', 'free', 'engineer'])
      const result = calculateCrewEventBonus(crew, 'engineering')
      expect(result).toBe(1)
    })

    it('should count only matching roles for the stat', () => {
      const crew = createCrew(['engineer', 'engineer', 'cook', 'security'])
      expect(calculateCrewEventBonus(crew, 'engineering')).toBe(2)
      expect(calculateCrewEventBonus(crew, 'food')).toBe(1)
      expect(calculateCrewEventBonus(crew, 'security')).toBe(1)
    })
  })
})
