/**
 * Crew management logic for World Tram
 */

import { ENGINEER_FUEL_SAVINGS } from '../data/constants'
import type { CrewRole } from '../types'

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
