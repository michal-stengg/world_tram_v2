import { MAX_RESOURCES } from '../data/constants'
import type { Country } from '../types'

/**
 * Station reward returned when arriving at a station
 */
export type StationReward = {
  waterRefill: number
  moneyEarned: number
}

// Station reward constants
const BASE_STATION_MONEY = 10
const SECURITY_MONEY_MULTIPLIER = 5

/**
 * Process arrival at a station and calculate rewards
 *
 * @param _country - The country where the station is located (reserved for future country-specific bonuses)
 * @param captainSecurityStat - The captain's security stat (1-6)
 * @param currentWater - The current water level before refill
 * @returns StationReward with water refill amount and money earned
 */
export function processStationArrival(
  _country: Country,
  captainSecurityStat: number,
  currentWater: number
): StationReward {
  // Water refills to max - calculate how much needs to be added
  const waterRefill = Math.max(0, MAX_RESOURCES.water - currentWater)

  // Money earned is based on captain's security stat
  // Higher security = better negotiation/protection = more money
  const moneyEarned = BASE_STATION_MONEY + captainSecurityStat * SECURITY_MONEY_MULTIPLIER

  return {
    waterRefill,
    moneyEarned,
  }
}
