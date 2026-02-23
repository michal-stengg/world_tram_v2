import { useCallback, useRef, useState } from 'react'
import type { ModalData, ModalItem, ModalType, OrchestratorState } from '../types/modals'

/** Priority mapping: lower number = shown first */
const MODAL_PRIORITY: Record<ModalType, number> = {
  'turn-dice': 0,
  'event': 1,
  'cargo-discovery': 2,
  'cargo-open': 3,
  'station': 4,
  'mini-game': 5,
  'quiz': 5,
  'shop': 5,
  'turn-result': 10,
}

/** Sort comparator for modal items by priority (ascending) */
function byPriority(a: ModalItem, b: ModalItem): number {
  return a.priority - b.priority
}

/** Create a ModalItem from type and data */
function createModalItem(type: ModalType, data: ModalData): ModalItem {
  return { type, data, priority: MODAL_PRIORITY[type] }
}

/** Return type of the useModalOrchestrator hook */
export interface ModalOrchestrator {
  /** The currently displayed modal, or null if none */
  currentModal: ModalItem | null
  /** Remaining modals waiting to be shown, sorted by priority */
  queue: ModalItem[]
  /** Whether a modal transition is in progress */
  isTransitioning: boolean
  /** Add a modal to the queue. If no modal is showing, or the new modal has higher priority, it becomes current. */
  enqueueModal: (type: ModalType, data: ModalData) => void
  /** Dismiss the current modal and show the next one in the queue */
  dismissCurrentModal: () => void
  /** Replace the current modal with a new one (e.g., station -> shop). Stores previous for returnToPreviousModal. */
  transitionToModal: (type: ModalType, data: ModalData) => void
  /** Return to the previous modal before a transition, with optionally updated data */
  returnToPreviousModal: (type: ModalType, data: ModalData) => void
  /** Check if a specific modal type is currently being shown */
  isModalActive: (type: ModalType) => boolean
  /** Get the data payload of the current modal, cast to the expected type */
  getModalData: <T extends ModalData>() => T | null
  /** Clear all modals from the queue and dismiss the current modal */
  clearQueue: () => void
}

/**
 * Hook that manages a priority-based queue of modals.
 * Modals are shown one at a time, ordered by priority (lowest number first).
 */
export function useModalOrchestrator(): ModalOrchestrator {
  const [state, setState] = useState<OrchestratorState>({
    queue: [],
    currentModal: null,
    isTransitioning: false,
  })

  // Store previous modal for transition return
  const previousModalRef = useRef<ModalItem | null>(null)

  const enqueueModal = useCallback((type: ModalType, data: ModalData) => {
    const item = createModalItem(type, data)

    setState(prev => {
      // No current modal - show immediately
      if (!prev.currentModal) {
        return { ...prev, currentModal: item }
      }

      // New modal has higher priority (lower number) than current
      if (item.priority < prev.currentModal.priority) {
        const newQueue = [...prev.queue, prev.currentModal].sort(byPriority)
        return { ...prev, currentModal: item, queue: newQueue }
      }

      // New modal has same or lower priority - add to queue
      const newQueue = [...prev.queue, item].sort(byPriority)
      return { ...prev, queue: newQueue }
    })
  }, [])

  const dismissCurrentModal = useCallback(() => {
    setState(prev => {
      if (!prev.currentModal) return prev

      if (prev.queue.length === 0) {
        return { ...prev, currentModal: null }
      }

      const [next, ...rest] = prev.queue
      return { ...prev, currentModal: next, queue: rest }
    })
  }, [])

  const transitionToModal = useCallback((type: ModalType, data: ModalData) => {
    const item = createModalItem(type, data)

    setState(prev => {
      previousModalRef.current = prev.currentModal
      return { ...prev, currentModal: item }
    })
  }, [])

  const returnToPreviousModal = useCallback((type: ModalType, data: ModalData) => {
    const item = createModalItem(type, data)

    setState(prev => {
      previousModalRef.current = null
      return { ...prev, currentModal: item }
    })
  }, [])

  const isModalActive = useCallback((type: ModalType): boolean => {
    return state.currentModal?.type === type
  }, [state.currentModal])

  const getModalData = useCallback(<T extends ModalData>(): T | null => {
    if (!state.currentModal) return null
    return state.currentModal.data as T
  }, [state.currentModal])

  const clearQueue = useCallback(() => {
    setState({ queue: [], currentModal: null, isTransitioning: false })
  }, [])

  return {
    currentModal: state.currentModal,
    queue: state.queue,
    isTransitioning: state.isTransitioning,
    enqueueModal,
    dismissCurrentModal,
    transitionToModal,
    returnToPreviousModal,
    isModalActive,
    getModalData,
    clearQueue,
  }
}
