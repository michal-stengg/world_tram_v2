import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useModalOrchestrator } from '../useModalOrchestrator'
import type { TurnDiceData, EventData, StationData, ShopData, TurnResultData, CargoOpenData } from '../../types/modals'

// Reusable mock data factories
function makeDiceData(overrides: Partial<TurnDiceData> = {}): TurnDiceData {
  return { diceValue: 4, isRolling: false, ...overrides }
}

function makeEventData(): EventData {
  return {
    event: {
      id: 'e1',
      name: 'Bandits',
      description: 'Bandits attack',
      statTested: 'security',
      difficulty: 10,
      penalty: { type: 'resource', resource: 'money', amount: 20 },
    },
  }
}

function makeTurnResultData(): TurnResultData {
  return {
    turnResult: {
      diceRoll: 3,
      movement: 3,
      resourceChanges: { food: 0, fuel: -1, water: -1, money: 0 },
      newResources: { food: 50, fuel: 49, water: 49, money: 100 },
      newCountryIndex: 1,
      newProgress: 3,
      arrivedAtCountry: false,
      gameStatus: 'playing',
      newTurnCount: 2,
      eventTriggered: false,
    },
  }
}

function makeStationData(): StationData {
  return {
    country: { id: 'fr', name: 'France', icon: '\u{1F5FC}', landmark: 'Eiffel Tower', distanceRequired: 10 },
    reward: { waterRefill: 50, moneyEarned: 20 },
  }
}

describe('useModalOrchestrator', () => {
  it('initializes with no current modal', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    expect(result.current.currentModal).toBeNull()
    expect(result.current.queue).toEqual([])
    expect(result.current.isTransitioning).toBe(false)
  })

  it('enqueues modal and shows it immediately when queue is empty', () => {
    const { result } = renderHook(() => useModalOrchestrator())
    const data = makeDiceData()

    act(() => {
      result.current.enqueueModal('turn-dice', data)
    })

    expect(result.current.currentModal).not.toBeNull()
    expect(result.current.currentModal!.type).toBe('turn-dice')
    expect(result.current.currentModal!.data).toEqual(data)
  })

  it('enqueues modals in priority order', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-result', makeTurnResultData())
      result.current.enqueueModal('event', makeEventData())
      result.current.enqueueModal('turn-dice', makeDiceData({ diceValue: 5 }))
    })

    // turn-dice has priority 0 (lowest number = shown first)
    expect(result.current.currentModal!.type).toBe('turn-dice')
  })

  it('dismissCurrentModal shows next modal in queue', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-dice', makeDiceData())
      result.current.enqueueModal('event', makeEventData())
      result.current.enqueueModal('turn-result', makeTurnResultData())
    })

    // Current should be turn-dice (priority 0)
    expect(result.current.currentModal!.type).toBe('turn-dice')

    act(() => {
      result.current.dismissCurrentModal()
    })

    // Next should be event (priority 1)
    expect(result.current.currentModal!.type).toBe('event')

    act(() => {
      result.current.dismissCurrentModal()
    })

    // Next should be turn-result (priority 10)
    expect(result.current.currentModal!.type).toBe('turn-result')
  })

  it('dismissCurrentModal clears when queue is empty', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-dice', makeDiceData())
    })

    expect(result.current.currentModal).not.toBeNull()

    act(() => {
      result.current.dismissCurrentModal()
    })

    expect(result.current.currentModal).toBeNull()
    expect(result.current.queue).toEqual([])
  })

  it('transitionToModal replaces current modal', () => {
    const { result } = renderHook(() => useModalOrchestrator())
    const shopData: ShopData = { countryIndex: 2 }

    act(() => {
      result.current.enqueueModal('station', makeStationData())
    })

    expect(result.current.currentModal!.type).toBe('station')

    act(() => {
      result.current.transitionToModal('shop', shopData)
    })

    expect(result.current.currentModal!.type).toBe('shop')
    expect(result.current.currentModal!.data).toEqual(shopData)
  })

  it('returnToPreviousModal restores previous modal', () => {
    const { result } = renderHook(() => useModalOrchestrator())
    const shopData: ShopData = { countryIndex: 2 }
    const updatedStationData: StationData = {
      country: { id: 'fr', name: 'France', icon: '\u{1F5FC}', landmark: 'Eiffel Tower', distanceRequired: 10 },
      reward: { waterRefill: 30, moneyEarned: 20 },
    }

    act(() => {
      result.current.enqueueModal('station', makeStationData())
    })

    act(() => {
      result.current.transitionToModal('shop', shopData)
    })

    expect(result.current.currentModal!.type).toBe('shop')

    act(() => {
      result.current.returnToPreviousModal('station', updatedStationData)
    })

    expect(result.current.currentModal!.type).toBe('station')
    expect(result.current.currentModal!.data).toEqual(updatedStationData)
  })

  it('isModalActive returns true for current modal type', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-dice', makeDiceData({ diceValue: 6, isRolling: true }))
    })

    expect(result.current.isModalActive('turn-dice')).toBe(true)
    expect(result.current.isModalActive('event')).toBe(false)
    expect(result.current.isModalActive('station')).toBe(false)
  })

  it('isModalActive returns false when no modal is active', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    expect(result.current.isModalActive('turn-dice')).toBe(false)
    expect(result.current.isModalActive('event')).toBe(false)
  })

  it('getModalData returns typed data for current modal', () => {
    const { result } = renderHook(() => useModalOrchestrator())
    const diceData = makeDiceData({ diceValue: 4, isRolling: true, showFinal: false })

    act(() => {
      result.current.enqueueModal('turn-dice', diceData)
    })

    const data = result.current.getModalData<TurnDiceData>()
    expect(data).toEqual(diceData)
    expect(data!.diceValue).toBe(4)
    expect(data!.isRolling).toBe(true)
  })

  it('getModalData returns null when no modal is active', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    const data = result.current.getModalData<TurnDiceData>()
    expect(data).toBeNull()
  })

  it('clearQueue removes all modals', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-dice', makeDiceData())
      result.current.enqueueModal('event', makeEventData())
      result.current.enqueueModal('turn-result', makeTurnResultData())
    })

    expect(result.current.currentModal).not.toBeNull()

    act(() => {
      result.current.clearQueue()
    })

    expect(result.current.currentModal).toBeNull()
    expect(result.current.queue).toEqual([])
  })

  it('handles multiple cargo-open modals in sequence', () => {
    const { result } = renderHook(() => useModalOrchestrator())
    const cargoOpen1: CargoOpenData = {
      cargo: { id: 'c1', name: 'Cargo 1', icon: '\u{1F4E6}', rarity: 'common', rewardType: 'money', rewardAmount: 10, description: 'A crate' },
      reward: { rewardType: 'money', amount: 10 },
    }
    const cargoOpen2: CargoOpenData = {
      cargo: { id: 'c2', name: 'Cargo 2', icon: '\u{1F4E6}', rarity: 'rare', rewardType: 'fuel', rewardAmount: 20, description: 'A barrel' },
      reward: { rewardType: 'fuel', amount: 20 },
    }

    act(() => {
      result.current.enqueueModal('cargo-open', cargoOpen1)
      result.current.enqueueModal('cargo-open', cargoOpen2)
    })

    // First cargo-open should be showing
    expect(result.current.currentModal!.type).toBe('cargo-open')
    expect(result.current.currentModal!.data).toEqual(cargoOpen1)

    act(() => {
      result.current.dismissCurrentModal()
    })

    // Second cargo-open should now be showing
    expect(result.current.currentModal!.type).toBe('cargo-open')
    expect(result.current.currentModal!.data).toEqual(cargoOpen2)

    act(() => {
      result.current.dismissCurrentModal()
    })

    expect(result.current.currentModal).toBeNull()
  })

  it('enqueuing a lower-priority modal while another is shown does not replace current', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-dice', makeDiceData())
    })

    expect(result.current.currentModal!.type).toBe('turn-dice')

    act(() => {
      result.current.enqueueModal('turn-result', makeTurnResultData())
    })

    // Should still show turn-dice (priority 0), not turn-result (priority 10)
    expect(result.current.currentModal!.type).toBe('turn-dice')
    // turn-result should be in the queue
    expect(result.current.queue.length).toBe(1)
    expect(result.current.queue[0].type).toBe('turn-result')
  })

  it('enqueuing a higher-priority modal while another is shown replaces current', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-result', makeTurnResultData())
    })

    expect(result.current.currentModal!.type).toBe('turn-result')

    act(() => {
      result.current.enqueueModal('turn-dice', makeDiceData())
    })

    // turn-dice (priority 0) should replace turn-result (priority 10)
    expect(result.current.currentModal!.type).toBe('turn-dice')
    // turn-result should be back in the queue
    expect(result.current.queue.length).toBe(1)
    expect(result.current.queue[0].type).toBe('turn-result')
  })

  it('queue remains sorted by priority after multiple enqueue operations', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.enqueueModal('turn-result', makeTurnResultData()) // priority 10
      result.current.enqueueModal('station', makeStationData())         // priority 4
      result.current.enqueueModal('event', makeEventData())             // priority 1
      result.current.enqueueModal('turn-dice', makeDiceData())          // priority 0
    })

    // turn-dice (priority 0) should be current
    expect(result.current.currentModal!.type).toBe('turn-dice')

    // Queue should be sorted: event(1), station(4), turn-result(10)
    expect(result.current.queue.length).toBe(3)
    expect(result.current.queue[0].type).toBe('event')
    expect(result.current.queue[1].type).toBe('station')
    expect(result.current.queue[2].type).toBe('turn-result')
  })

  it('dismissCurrentModal does nothing when no modal is active', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    // Should not throw
    act(() => {
      result.current.dismissCurrentModal()
    })

    expect(result.current.currentModal).toBeNull()
    expect(result.current.queue).toEqual([])
  })

  it('returnToPreviousModal sets modal even without a previous transition', () => {
    const { result } = renderHook(() => useModalOrchestrator())

    act(() => {
      result.current.returnToPreviousModal('station', makeStationData())
    })

    expect(result.current.currentModal!.type).toBe('station')
    expect(result.current.currentModal!.data).toEqual(makeStationData())
  })
})
