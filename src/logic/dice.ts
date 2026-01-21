import { DICE_MIN, DICE_MAX } from '../data/constants'

/**
 * Roll a dice with a specified range
 */
export function rollDice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Roll for movement distance (0-10)
 */
export function rollMovement(): number {
  return rollDice(DICE_MIN, DICE_MAX)
}
