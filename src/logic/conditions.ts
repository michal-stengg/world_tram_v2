import type { Resources } from '../types'

export type GameOverReason = 'starvation' | 'out_of_fuel' | 'dehydration' | 'broke'

export interface GameOverResult {
  isGameOver: boolean
  reason: GameOverReason | null
}

/**
 * Check if player has reached victory (final country)
 */
export function checkVictory(countryIndex: number, totalCountries: number): boolean {
  return countryIndex >= totalCountries - 1
}

/**
 * Check if game is over due to resource depletion
 */
export function checkGameOver(resources: Resources): GameOverResult {
  if (resources.food <= 0) {
    return { isGameOver: true, reason: 'starvation' }
  }
  if (resources.fuel <= 0) {
    return { isGameOver: true, reason: 'out_of_fuel' }
  }
  if (resources.water <= 0) {
    return { isGameOver: true, reason: 'dehydration' }
  }
  if (resources.money <= 0) {
    return { isGameOver: true, reason: 'broke' }
  }
  return { isGameOver: false, reason: null }
}
