/**
 * Resource preview calculations for World Tram
 * Shows predicted resource changes for the next turn
 */

import {
  calculateFuelConsumption,
  calculateFoodConsumption,
  calculateWaterConsumption,
  calculateWages,
  calculateFoodProduction,
  getCrewCountByRole,
} from './resources'
import { calculateFuelEfficiencyBonus } from './carts'
import type { CrewMember, Captain, Train, Cart } from '../types'

export interface ResourcePreview {
  food: number
  fuel: number
  water: number
  money: number
}

/**
 * Calculate the predicted resource changes for the next turn
 * Based on current crew assignments, captain, and train
 */
export function calculateResourcePreview(
  crew: CrewMember[],
  captain: Captain | null,
  train: Train | null,
  ownedCarts: Cart[] = []
): ResourcePreview {
  // If no captain or train selected, return zeros
  if (!captain || !train) {
    return { food: 0, fuel: 0, water: 0, money: 0 }
  }

  const crewCount = crew.length
  const engineerCount = getCrewCountByRole(crew, 'engineer')
  const fuelEfficiencyBonus = calculateFuelEfficiencyBonus(ownedCarts)

  // Calculate consumption (negative values)
  const fuelConsumption = calculateFuelConsumption(0, train.stats.power, engineerCount, fuelEfficiencyBonus)
  const foodConsumption = calculateFoodConsumption(crewCount)
  const waterConsumption = calculateWaterConsumption(crewCount)
  const wages = calculateWages(crew)

  // Calculate production (positive values)
  const foodProduction = calculateFoodProduction(crew, captain.stats.food)

  // Return net changes (use || 0 to avoid -0)
  return {
    food: foodProduction - foodConsumption,
    fuel: -fuelConsumption || 0,
    water: -waterConsumption || 0,
    money: -wages || 0,
  }
}
