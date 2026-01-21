import { DISTANCE_PER_COUNTRY } from '../data/constants'
import { countries } from '../data/countries'

/**
 * Calculate total movement based on dice roll and train speed
 */
export function calculateMovement(diceRoll: number, trainSpeed: number): number {
  return diceRoll + trainSpeed
}

export interface AdvanceResult {
  newProgress: number
  arrivedAtNextCountry: boolean
  newCountryIndex: number
}

/**
 * Advance progress along the journey track
 * Returns new progress, whether we arrived at a new country, and new country index
 */
export function advanceProgress(
  currentProgress: number,
  movement: number,
  countryDistance: number = DISTANCE_PER_COUNTRY,
  currentCountryIndex: number = 0
): AdvanceResult {
  const maxCountryIndex = countries.length - 1
  let totalProgress = currentProgress + movement
  let countryIndex = currentCountryIndex
  let arrivedAtNextCountry = false

  // Process each country crossing
  while (totalProgress >= countryDistance && countryIndex < maxCountryIndex) {
    totalProgress -= countryDistance
    countryIndex++
    arrivedAtNextCountry = true
  }

  // Cap at final country
  if (countryIndex >= maxCountryIndex) {
    countryIndex = maxCountryIndex
  }

  return {
    newProgress: totalProgress,
    arrivedAtNextCountry,
    newCountryIndex: countryIndex,
  }
}
