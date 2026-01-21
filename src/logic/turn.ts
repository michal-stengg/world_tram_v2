import { rollMovement } from './dice'
import { calculateMovement, advanceProgress } from './movement'
import {
  calculateFuelConsumption,
  calculateFoodConsumption,
  calculateWaterConsumption,
  calculateWages,
  calculateFoodProduction,
  getCrewCountByRole,
  applyResourceChanges,
} from './resources'
import { checkVictory, checkGameOver } from './conditions'
import type { GameOverReason } from './conditions'
import { countries } from '../data/countries'
import type { Captain, Train, CrewMember, Resources } from '../types'

export interface GameState {
  captain: Captain
  train: Train
  crew: CrewMember[]
  resources: Resources
  currentCountryIndex: number
  progressInCountry: number
  turnCount: number
}

export type GameStatus = 'playing' | 'victory' | 'gameOver'

export interface TurnResult {
  diceRoll: number
  movement: number
  resourceChanges: Resources
  newResources: Resources
  newCountryIndex: number
  newProgress: number
  arrivedAtCountry: boolean
  gameStatus: GameStatus
  gameOverReason?: GameOverReason
  newTurnCount: number
}

/**
 * Process a complete game turn
 */
export function processTurn(state: GameState): TurnResult {
  // 1. Roll dice
  const diceRoll = rollMovement()

  // 2. Calculate movement
  const movement = calculateMovement(diceRoll, state.train.stats.speed)

  // 3. Advance progress
  const advanceResult = advanceProgress(
    state.progressInCountry,
    movement,
    undefined, // Use default distance
    state.currentCountryIndex
  )

  // 4. Calculate resource consumption
  const engineerCount = getCrewCountByRole(state.crew, 'engineer')
  const fuelConsumption = calculateFuelConsumption(movement, state.train.stats.power, engineerCount)
  const foodConsumption = calculateFoodConsumption(state.crew.length)
  const waterConsumption = calculateWaterConsumption(state.crew.length)
  const wages = calculateWages(state.crew)

  // 5. Calculate resource production
  const foodProduction = calculateFoodProduction(state.crew, state.captain.stats.food)

  // 6. Calculate net resource changes
  const resourceChanges: Resources = {
    food: foodProduction - foodConsumption,
    fuel: -fuelConsumption,
    water: -waterConsumption,
    money: -wages,
  }

  // 7. Apply changes
  const newResources = applyResourceChanges(state.resources, resourceChanges)

  // 8. Increment turn count
  const newTurnCount = state.turnCount + 1

  // 9. Check game end conditions
  let gameStatus: GameStatus = 'playing'
  let gameOverReason: GameOverReason | undefined

  // Check victory first
  if (checkVictory(advanceResult.newCountryIndex, countries.length)) {
    gameStatus = 'victory'
  } else {
    // Check game over
    const gameOverResult = checkGameOver(newResources)
    if (gameOverResult.isGameOver) {
      gameStatus = 'gameOver'
      gameOverReason = gameOverResult.reason ?? undefined
    }
  }

  return {
    diceRoll,
    movement,
    resourceChanges,
    newResources,
    newCountryIndex: advanceResult.newCountryIndex,
    newProgress: advanceResult.newProgress,
    arrivedAtCountry: advanceResult.arrivedAtNextCountry,
    gameStatus,
    gameOverReason,
    newTurnCount,
  }
}
