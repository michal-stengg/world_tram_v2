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
import { checkGameOver } from './conditions'
import type { GameOverReason } from './conditions'
import { processStationArrival } from './station'
import type { StationReward } from './station'
import { shouldTriggerEvent, selectRandomEvent } from './events'
import { shouldDiscoverCargo, selectRandomCargo } from './cargo'
import { countries } from '../data/countries'
import type { GameEvent } from '../data/events'
import type { Captain, Train, CrewMember, Resources, CargoItem } from '../types'

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
  stationReward?: StationReward
  eventTriggered: boolean
  event?: GameEvent
  cargoDiscovered?: CargoItem
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
  let newResources = applyResourceChanges(state.resources, resourceChanges)

  // 8. Process station arrival if we reached a new country
  let stationReward: StationReward | undefined
  if (advanceResult.arrivedAtNextCountry) {
    const arrivedCountry = countries[advanceResult.newCountryIndex]
    stationReward = processStationArrival(
      arrivedCountry,
      state.captain.stats.security,
      newResources.water
    )
    // Apply station rewards to resources
    newResources = {
      ...newResources,
      water: newResources.water + stationReward.waterRefill,
      money: newResources.money + stationReward.moneyEarned,
    }
    // Update resourceChanges to include station rewards for accurate display
    resourceChanges.water += stationReward.waterRefill
    resourceChanges.money += stationReward.moneyEarned
  }

  // 9. Increment turn count
  const newTurnCount = state.turnCount + 1

  // 10. Check for random events after movement
  const eventTriggered = shouldTriggerEvent()
  const event = eventTriggered ? selectRandomEvent() : undefined

  // 11. Check for cargo discovery (only during travel, not when arriving at station)
  let cargoDiscovered: CargoItem | undefined
  if (!advanceResult.arrivedAtNextCountry && shouldDiscoverCargo()) {
    cargoDiscovered = selectRandomCargo()
  }

  // 12. Check game end conditions
  let gameStatus: GameStatus = 'playing'
  let gameOverReason: GameOverReason | undefined

  // Victory is now triggered manually via FINISH button at final destination
  // Only check for game over conditions here
  const gameOverResult = checkGameOver(newResources)
  if (gameOverResult.isGameOver) {
    gameStatus = 'gameOver'
    gameOverReason = gameOverResult.reason ?? undefined
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
    stationReward,
    eventTriggered,
    event,
    cargoDiscovered,
  }
}
