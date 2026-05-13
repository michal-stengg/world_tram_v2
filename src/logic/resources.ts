import {
  BASE_FUEL_CONSUMPTION,
  BASE_FOOD_CONSUMPTION,
  BASE_WATER_CONSUMPTION,
  BASE_MONEY_WAGES,
  COOK_FOOD_PRODUCTION,
  MAX_RESOURCES,
} from '../data/constants'
import { calculateEngineerBonus } from './crew'
import type { CrewMember, CrewRole, Resources, MaxResources } from '../types'

/**
 * Calculate fuel consumption for a turn
 * Higher train power = more fuel efficient
 * Engineers reduce fuel consumption via calculateEngineerBonus
 */
export function calculateFuelConsumption(
  _distance: number,
  trainPower: number,
  engineerCount: number = 0,
  fuelEfficiencyBonus: number = 0
): number {
  // Base consumption reduced by train power (higher power = more efficient)
  const efficiency = Math.max(0.5, 1 - (trainPower - 3) * 0.1)
  const baseConsumption = Math.round(BASE_FUEL_CONSUMPTION * efficiency)

  // Apply engineer bonus (reduces fuel consumption)
  const engineerBonus = calculateEngineerBonus(engineerCount)
  const validCartBonus = Math.max(0, fuelEfficiencyBonus)
  const consumption = baseConsumption - engineerBonus - validCartBonus

  // Ensure fuel consumption never goes below 0
  return Math.max(0, consumption)
}

/**
 * Calculate food consumption for a turn
 */
export function calculateFoodConsumption(crewCount: number): number {
  return BASE_FOOD_CONSUMPTION * crewCount
}

/**
 * Calculate water consumption for a turn
 */
export function calculateWaterConsumption(crewCount: number): number {
  return BASE_WATER_CONSUMPTION * crewCount
}

/**
 * Calculate wages for all crew
 */
export function calculateWages(crew: CrewMember[]): number {
  return BASE_MONEY_WAGES * crew.length
}

/**
 * Calculate food production for a turn
 * Based on number of cooks + captain's food stat
 */
export function calculateFoodProduction(crew: CrewMember[], captainFoodStat: number): number {
  const cookCount = getCrewCountByRole(crew, 'cook')
  return COOK_FOOD_PRODUCTION * cookCount + captainFoodStat
}

/**
 * Count crew members with a specific role
 */
export function getCrewCountByRole(crew: CrewMember[], role: CrewRole): number {
  return crew.filter((member) => member.role === role).length
}

/**
 * Apply resource changes with min/max bounds
 */
export function applyResourceChanges(
  current: Resources,
  changes: Resources,
  maxResources: MaxResources = MAX_RESOURCES
): Resources {
  return {
    food: Math.min(maxResources.food, Math.max(0, current.food + changes.food)),
    fuel: Math.min(maxResources.fuel, Math.max(0, current.fuel + changes.fuel)),
    water: Math.min(maxResources.water, Math.max(0, current.water + changes.water)),
    money: Math.min(maxResources.money, Math.max(0, current.money + changes.money)),
  }
}
