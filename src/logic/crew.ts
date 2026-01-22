/**
 * Crew management logic for World Tram
 */

import { ENGINEER_FUEL_SAVINGS, SECURITY_PENALTY_REDUCTION } from '../data/constants'
import type { CrewRole, CrewMember } from '../types'

/**
 * Role cycle order: engineer -> cook -> security -> free -> engineer
 */
const ROLE_CYCLE: CrewRole[] = ['engineer', 'cook', 'security', 'free']

/**
 * Cycles a crew member's role to the next role in the cycle.
 * Order: engineer -> cook -> security -> free -> engineer
 *
 * @param role - The current role
 * @returns The next role in the cycle
 */
export function cycleRole(role: CrewRole): CrewRole {
  const currentIndex = ROLE_CYCLE.indexOf(role)
  const nextIndex = (currentIndex + 1) % ROLE_CYCLE.length
  return ROLE_CYCLE[nextIndex]
}

/**
 * Calculate fuel savings from engineers.
 * Each engineer reduces fuel consumption by ENGINEER_FUEL_SAVINGS (2) per turn.
 *
 * @param engineerCount - The number of engineers on the crew
 * @returns The fuel savings (reduction in fuel consumption)
 */
export function calculateEngineerBonus(engineerCount: number): number {
  const validCount = Math.max(0, engineerCount)
  return ENGINEER_FUEL_SAVINGS * validCount
}

/**
 * Calculate penalty multiplier from security crew.
 * Each security crew reduces penalties by SECURITY_PENALTY_REDUCTION (15%) per turn.
 * Caps at 4 security crew (60% total reduction, 0.40 multiplier).
 *
 * @param securityCount - The number of security crew members
 * @returns The penalty multiplier (1.0 = full penalty, 0.40 = minimum with 4 security)
 */
export function calculateSecurityBonus(securityCount: number): number {
  const validCount = Math.max(0, Math.min(4, securityCount))
  return Math.max(0, 1 - SECURITY_PENALTY_REDUCTION * validCount)
}

/**
 * Calculate crew event bonus for a specific stat.
 * Each crew member with a matching role adds +1 to event rolls.
 * - engineer crew → +1 to engineering events
 * - cook crew → +1 to food events
 * - security crew → +1 to security events
 *
 * @param crew - The crew members
 * @param stat - The event stat being tested (engineering, food, security)
 * @returns The bonus from crew members matching the stat
 */
export function calculateCrewEventBonus(
  crew: CrewMember[],
  stat: 'engineering' | 'food' | 'security'
): number {
  const roleMap: Record<string, CrewRole> = {
    engineering: 'engineer',
    food: 'cook',
    security: 'security',
  }
  const targetRole = roleMap[stat]
  return crew.filter((c) => c.role === targetRole).length
}
