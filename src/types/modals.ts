/**
 * Type definitions for the modal orchestration system.
 * Manages a priority-based queue of modals displayed on the DashboardScreen.
 */

import type { CargoItem, CargoReward, Country, CountryQuiz, MiniGame } from './index'
import type { GameEvent } from '../data/events'
import type { StationReward } from '../logic/station'
import type { TurnResult } from '../logic/turn'

/** All supported modal types, ordered by display priority (lower = shown first) */
export type ModalType =
  | 'turn-dice'       // priority 0
  | 'event'           // priority 1
  | 'cargo-discovery' // priority 2
  | 'cargo-open'      // priority 3
  | 'station'         // priority 4
  | 'mini-game'       // priority 5
  | 'quiz'            // priority 5
  | 'shop'            // priority 5
  | 'turn-result'     // priority 10

/** Data payload for the dice roll modal */
export interface TurnDiceData {
  diceValue: number
  isRolling: boolean
  showFinal?: boolean
}

/** Data payload for the random event modal */
export interface EventData {
  event: GameEvent
}

/** Data payload for cargo discovery notification */
export interface CargoDiscoveryData {
  cargo: CargoItem
}

/** Data payload for opening a cargo item */
export interface CargoOpenData {
  cargo: CargoItem
  reward: CargoReward
}

/** Data payload for station arrival */
export interface StationData {
  country: Country
  reward: StationReward
}

/** Data payload for mini-game modal */
export interface MiniGameData {
  miniGame: MiniGame
}

/** Data payload for quiz modal */
export interface QuizData {
  quiz: CountryQuiz
}

/** Data payload for resource shop modal */
export interface ShopData {
  countryIndex: number
}

/** Data payload for turn result summary */
export interface TurnResultData {
  turnResult: TurnResult
}

/** Union of all modal data payloads */
export type ModalData =
  | TurnDiceData
  | EventData
  | CargoDiscoveryData
  | CargoOpenData
  | StationData
  | MiniGameData
  | QuizData
  | ShopData
  | TurnResultData

/** A single item in the modal queue */
export interface ModalItem {
  type: ModalType
  data: ModalData
  priority: number
}

/** Internal state of the modal orchestrator hook */
export interface OrchestratorState {
  queue: ModalItem[]
  currentModal: ModalItem | null
  isTransitioning: boolean
}
