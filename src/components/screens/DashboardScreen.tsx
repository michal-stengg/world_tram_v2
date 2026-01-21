import { useState, useEffect } from 'react'
import { ResourceBar } from '../game/ResourceBar'
import { JourneyTrack } from '../game/JourneyTrack'
import { CrewPanel } from '../game/CrewPanel'
import { TurnResultDisplay } from '../game/TurnResultDisplay'
import { StationModal } from '../game/StationModal'
import { EventModal } from '../game/EventModal'
import { CartShop } from '../game/CartShop'
import { GoButton } from '../game/GoButton'
import { useGameStore } from '../../stores/gameStore'
import { countries } from '../../data/countries'
import { resolveEvent } from '../../logic/events'
import { rollDice } from '../../logic/dice'
import type { EventResult } from '../../logic/events'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '100vh',
  backgroundColor: 'var(--color-bg-dark, #1a1a2e)',
  color: 'var(--color-text, #ffffff)',
  fontFamily: 'inherit',
}

const selectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
}

const selectionItemStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '4px',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

const resourceZoneStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
}

const journeyZoneStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  gap: '1rem',
  overflowX: 'auto',
}

const journeyTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  marginBottom: '0.5rem',
  color: 'var(--color-gold, #F7B538)',
  fontWeight: 'bold',
}

const bottomZoneStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderTop: '2px solid rgba(255, 255, 255, 0.1)',
}

const goButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}

export function DashboardScreen() {
  const selectedCaptain = useGameStore((state) => state.selectedCaptain)
  const selectedTrain = useGameStore((state) => state.selectedTrain)
  const executeTurn = useGameStore((state) => state.executeTurn)
  const clearTurnResult = useGameStore((state) => state.clearTurnResult)
  const lastTurnResult = useGameStore((state) => state.lastTurnResult)
  const currentCountryIndex = useGameStore((state) => state.currentCountryIndex)

  // Event-related store state
  const currentEvent = useGameStore((state) => state.currentEvent)
  const cardHand = useGameStore((state) => state.cardHand)
  const selectedCards = useGameStore((state) => state.selectedCards)
  const selectCard = useGameStore((state) => state.selectCard)
  const setCurrentEvent = useGameStore((state) => state.setCurrentEvent)
  const resolveCurrentEvent = useGameStore((state) => state.resolveCurrentEvent)

  // Cart shop related state
  const resources = useGameStore((state) => state.resources)
  const ownedCarts = useGameStore((state) => state.ownedCarts)
  const purchaseCart = useGameStore((state) => state.purchaseCart)

  // Track whether we're showing the station modal (before showing turn result)
  const [showStationModal, setShowStationModal] = useState(false)

  // Track whether we're showing the cart shop
  const [showCartShop, setShowCartShop] = useState(false)

  // Track event resolution result
  const [eventResult, setEventResult] = useState<EventResult | undefined>(undefined)

  // Track dice rolling animation state
  const [isRolling, setIsRolling] = useState(false)
  const [diceValue, setDiceValue] = useState<number | undefined>(undefined)

  // When a new turn result comes in with an event, set it in the store
  useEffect(() => {
    if (lastTurnResult?.eventTriggered && lastTurnResult.event) {
      setCurrentEvent(lastTurnResult.event)
      // Reset event result for new event - intentional state update in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEventResult(undefined)
    }
  }, [lastTurnResult, setCurrentEvent])

  // When a new turn result comes in with a stationReward and no event pending, show the station modal
  useEffect(() => {
    if (lastTurnResult?.stationReward && lastTurnResult.gameStatus === 'playing' && !currentEvent) {
      // Show station modal after event is resolved - intentional state update in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowStationModal(true)
    } else if (!currentEvent) {
      setShowStationModal(false)
    }
  }, [lastTurnResult, currentEvent])

  const handleDismissStationModal = () => {
    setShowStationModal(false)
  }

  const handleVisitShop = () => {
    setShowStationModal(false)
    setShowCartShop(true)
  }

  const handleCloseCartShop = () => {
    setShowCartShop(false)
    // Station modal was already dismissed, so just continue to turn result
  }

  const handlePurchaseCart = (cartId: string) => {
    purchaseCart(cartId)
  }

  const handleDismissTurnResult = () => {
    clearTurnResult()
  }

  const handleSelectCard = (cardId: string) => {
    selectCard(cardId)
  }

  const handleEventRoll = () => {
    if (!currentEvent || !selectedCaptain) return

    // Start the rolling animation
    setIsRolling(true)

    // Get the selected cards from the hand
    const playedCards = cardHand.filter(card => selectedCards.includes(card.id))

    // Roll the dice immediately (but don't show result yet)
    const diceRoll = rollDice(1, 6)
    setDiceValue(diceRoll)

    // After animation delay, show the result
    setTimeout(() => {
      // Resolve the event
      const result = resolveEvent(
        currentEvent,
        playedCards,
        selectedCaptain.stats,
        diceRoll
      )

      setEventResult(result)
      setIsRolling(false)
    }, 1500)
  }

  const handleEventContinue = () => {
    // Clear the event and resolve it (removes played cards, replenishes hand)
    resolveCurrentEvent()
    setEventResult(undefined)
    setDiceValue(undefined)

    // After event is resolved, show station modal if applicable
    if (lastTurnResult?.stationReward && lastTurnResult.gameStatus === 'playing') {
      setShowStationModal(true)
    }
  }

  return (
    <div style={containerStyle} data-testid="dashboard-screen">
      {/* Selection Header - Captain and Train */}
      <div style={selectionHeaderStyle} data-testid="selection-info">
        <div style={selectionItemStyle} data-testid="selected-captain">
          {selectedCaptain ? (
            <>
              <span role="img" aria-label="Captain portrait">{selectedCaptain.portrait}</span>
              <span>Captain: {selectedCaptain.name}</span>
            </>
          ) : (
            <span>Captain: None</span>
          )}
        </div>
        <div style={selectionItemStyle} data-testid="selected-train">
          {selectedTrain ? (
            <>
              <span role="img" aria-label="Train sprite">{selectedTrain.sprite}</span>
              <span>Train: {selectedTrain.name}</span>
            </>
          ) : (
            <span>Train: None</span>
          )}
        </div>
      </div>

      {/* Top Zone - Resources */}
      <div style={resourceZoneStyle} data-testid="resource-zone">
        <ResourceBar />
      </div>

      {/* Center Zone - Journey Track */}
      <div style={journeyZoneStyle} data-testid="journey-zone">
        <h2 style={journeyTitleStyle}>Journey Progress</h2>
        <JourneyTrack />
      </div>

      {/* Bottom Zone - Crew + GO Button */}
      <div style={bottomZoneStyle} data-testid="crew-zone">
        <CrewPanel />
        <div style={goButtonContainerStyle}>
          <GoButton onGo={executeTurn} />
        </div>
      </div>

      {/* Event Modal - shows when an event is triggered (before station/turn result) */}
      {currentEvent && (
        <EventModal
          event={currentEvent}
          cardHand={cardHand}
          selectedCardIds={selectedCards}
          onSelectCard={handleSelectCard}
          onRoll={handleEventRoll}
          result={eventResult}
          onContinue={handleEventContinue}
          isRolling={isRolling}
          diceValue={diceValue}
        />
      )}

      {/* Station Modal - shows when arriving at a new country (after event is resolved) */}
      {!currentEvent && showStationModal && lastTurnResult?.stationReward && (
        <StationModal
          country={countries[currentCountryIndex]}
          reward={lastTurnResult.stationReward}
          onContinue={handleDismissStationModal}
          onVisitShop={handleVisitShop}
        />
      )}

      {/* Cart Shop Modal - shows when visiting shop from station */}
      {showCartShop && (
        <CartShop
          money={resources.money}
          ownedCarts={ownedCarts}
          onPurchase={handlePurchaseCart}
          onClose={handleCloseCartShop}
        />
      )}

      {/* Turn Result Modal - shows after station modal is dismissed (or immediately if no station) */}
      {lastTurnResult && lastTurnResult.gameStatus === 'playing' && !showStationModal && !showCartShop && !currentEvent && (
        <TurnResultDisplay
          result={lastTurnResult}
          onDismiss={handleDismissTurnResult}
        />
      )}
    </div>
  )
}
