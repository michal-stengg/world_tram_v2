import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResourceBar } from '../game/ResourceBar'
import { JourneyTrack } from '../game/JourneyTrack'
import { LocationIndicator } from '../game/LocationIndicator'
import { CrewPanel } from '../game/CrewPanel'
import { TurnResultDisplay } from '../game/TurnResultDisplay'
import { StationModal } from '../game/StationModal'
import { EventModal } from '../game/EventModal'
import { StationShop } from '../game/StationShop'
import { GoButton } from '../game/GoButton'
import { CargoDiscoveryModal } from '../game/CargoDiscoveryModal'
import { CargoOpenModal } from '../game/CargoOpenModal'
import { CargoInventory } from '../game/CargoInventory'
import { MiniGameModal } from '../game/MiniGameModal'
import { QuizModal } from '../game/QuizModal'
import { CaptainStats } from '../game/CaptainStats'
import { TrainStats } from '../game/TrainStats'
import { useGameStore } from '../../stores/gameStore'
import { countries } from '../../data/countries'
import { getPricesForCountry } from '../../data/shopPrices'
import { MAX_RESOURCES } from '../../data/constants'
import { resolveEvent } from '../../logic/events'
import { rollDice } from '../../logic/dice'
import type { EventResult } from '../../logic/events'
import type { CargoItem, CargoReward } from '../../types'

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
  flexDirection: 'column',
  gap: '0.25rem',
}

const selectionNameStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

const resourceZoneStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
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

  // Shop state
  const shopCart = useGameStore((state) => state.shopCart)
  const updateShopCart = useGameStore((state) => state.updateShopCart)
  const purchaseResources = useGameStore((state) => state.purchaseResources)
  const clearShopCart = useGameStore((state) => state.clearShopCart)

  // Activity tracking
  const playedMiniGames = useGameStore((state) => state.playedMiniGames)
  const takenQuizzes = useGameStore((state) => state.takenQuizzes)

  // Cargo related state
  const carriedCargo = useGameStore((state) => state.carriedCargo)
  const pendingCargoOpen = useGameStore((state) => state.pendingCargoOpen)
  const addCargo = useGameStore((state) => state.addCargo)
  const openCargoAtStation = useGameStore((state) => state.openCargoAtStation)
  const clearPendingCargo = useGameStore((state) => state.clearPendingCargo)

  // Mini-game related state
  const startMiniGame = useGameStore((state) => state.startMiniGame)
  const completeMiniGame = useGameStore((state) => state.completeMiniGame)
  const skipMiniGame = useGameStore((state) => state.skipMiniGame)
  const currentMiniGame = useGameStore((state) => state.currentMiniGame)

  // Quiz related state
  const currentQuiz = useGameStore((state) => state.currentQuiz)
  const startQuiz = useGameStore((state) => state.startQuiz)
  const completeQuiz = useGameStore((state) => state.completeQuiz)
  const skipQuiz = useGameStore((state) => state.skipQuiz)

  // Track whether we're showing the station modal (before showing turn result)
  const [showStationModal, setShowStationModal] = useState(false)

  // Track whether we're showing the cart shop
  const [showCartShop, setShowCartShop] = useState(false)

  // Track event resolution result
  const [eventResult, setEventResult] = useState<EventResult | undefined>(undefined)

  // Track dice rolling animation state
  const [isRolling, setIsRolling] = useState(false)
  const [diceValue, setDiceValue] = useState<number | undefined>(undefined)

  // Cargo discovery state
  const [showCargoDiscovery, setShowCargoDiscovery] = useState(false)
  const [discoveredCargo, setDiscoveredCargo] = useState<CargoItem | null>(null)
  const [currentCargoReward, setCurrentCargoReward] = useState<CargoReward | null>(null)

  // Quiz state
  const [showQuizModal, setShowQuizModal] = useState(false)

  // Turn dice rolling animation state
  const [isTurnRolling, setIsTurnRolling] = useState(false)
  const [turnDiceDisplayed, setTurnDiceDisplayed] = useState(1)
  const [showFinalRoll, setShowFinalRoll] = useState(false)

  // When a new turn result comes in with an event, set it in the store
  useEffect(() => {
    if (lastTurnResult?.eventTriggered && lastTurnResult.event) {
      setCurrentEvent(lastTurnResult.event)
      // Reset event result for new event - intentional state update in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEventResult(undefined)
    }
  }, [lastTurnResult, setCurrentEvent])

  // When turn result has cargo discovered, show the modal (after event is resolved)
  useEffect(() => {
    if (lastTurnResult?.cargoDiscovered && !currentEvent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDiscoveredCargo(lastTurnResult.cargoDiscovered)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowCargoDiscovery(true)
    }
  }, [lastTurnResult, currentEvent])

  // When a new turn result comes in with a stationReward and no event pending, show the station modal
  // But wait for cargo discovery modal to be dismissed first
  useEffect(() => {
    if (lastTurnResult?.stationReward && lastTurnResult.gameStatus === 'playing' && !currentEvent && !showCargoDiscovery) {
      // Show station modal after event and cargo discovery are resolved - intentional state update in effect
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowStationModal(true)
    } else if (!currentEvent && !showCargoDiscovery) {
      setShowStationModal(false)
    }
  }, [lastTurnResult, currentEvent, showCargoDiscovery])

  // Animate turn dice while rolling (but not when showing final result)
  useEffect(() => {
    if (!isTurnRolling || showFinalRoll) return

    const interval = setInterval(() => {
      setTurnDiceDisplayed((prev) => (prev % 6) + 1)
    }, 100)

    return () => clearInterval(interval)
  }, [isTurnRolling, showFinalRoll])

  // When arriving at station with cargo, open cargo before showing station modal
  useEffect(() => {
    if (
      lastTurnResult?.stationReward &&
      !currentEvent &&
      !showCargoDiscovery &&
      carriedCargo.length > 0 &&
      !pendingCargoOpen
    ) {
      // Open first cargo
      const reward = openCargoAtStation()
      if (reward) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentCargoReward(reward)
      }
    }
  }, [lastTurnResult, currentEvent, showCargoDiscovery, carriedCargo.length, pendingCargoOpen, openCargoAtStation])

  const handleGoClick = () => {
    // Start the dice rolling animation
    setIsTurnRolling(true)
    setShowFinalRoll(false)

    // After animation delay, execute the turn and show final value
    setTimeout(() => {
      executeTurn()
      // Get the final dice value from the turn result
      const result = useGameStore.getState().lastTurnResult
      if (result) {
        setTurnDiceDisplayed(result.diceRoll)
        setShowFinalRoll(true)
      }

      // After showing final value, dismiss the overlay
      setTimeout(() => {
        setIsTurnRolling(false)
        setShowFinalRoll(false)
      }, 800)
    }, 800)
  }

  const handleDismissStationModal = () => {
    setShowStationModal(false)
  }

  const handleVisitShop = () => {
    clearShopCart()  // Reset cart when opening shop
    setShowStationModal(false)
    setShowCartShop(true)
  }

  const handleCloseCartShop = () => {
    clearShopCart()  // Clear cart on close
    setShowCartShop(false)
    // Station modal was already dismissed, so just continue to turn result
  }

  const handlePurchaseCart = (cartId: string) => {
    purchaseCart(cartId)
  }

  const handlePurchaseResources = () => {
    const currentCountry = countries[currentCountryIndex]
    const countryPrices = getPricesForCountry(currentCountry.id)
    if (countryPrices) {
      purchaseResources(countryPrices.prices)
    }
  }

  const handleUpdateShopCart = (resource: 'food' | 'fuel' | 'water', amount: number) => {
    updateShopCart(resource, amount)
  }

  const handleDismissTurnResult = () => {
    clearTurnResult()
  }

  const handleCargoDiscoveryContinue = () => {
    if (discoveredCargo) {
      // Add cargo to inventory
      const currentCountry = countries[currentCountryIndex]
      addCargo(discoveredCargo, currentCountry.id, lastTurnResult?.newTurnCount || 0)
    }
    setShowCargoDiscovery(false)
    setDiscoveredCargo(null)
  }

  const handleCargoOpenContinue = () => {
    clearPendingCargo()
    setCurrentCargoReward(null)
    // The useEffect will try to open next cargo if any are remaining
  }

  const handlePlayMiniGame = () => {
    const currentCountry = countries[currentCountryIndex]
    startMiniGame(currentCountry.id)
    setShowStationModal(false)
  }

  const handleMiniGameComplete = (score: number, maxScore: number) => {
    completeMiniGame(score, maxScore)
    setShowStationModal(true)  // Return to station modal to allow shop access
  }

  const handleMiniGameSkip = () => {
    skipMiniGame()
    // Return to station modal
    setShowStationModal(true)
  }

  const handleTakeQuiz = () => {
    const currentCountry = countries[currentCountryIndex]
    startQuiz(currentCountry.id)
    setShowQuizModal(true)
    setShowStationModal(false)  // Hide station modal while taking quiz
  }

  const handleQuizComplete = () => {
    completeQuiz()  // This applies the reward in the store
    setShowQuizModal(false)
    setShowStationModal(true)  // Return to station modal
  }

  const handleQuizSkip = () => {
    skipQuiz()
    setShowQuizModal(false)
    setShowStationModal(true)  // Return to station modal
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
    }, 1000)
  }

  const handleEventContinue = () => {
    // Clear the event and resolve it (removes played cards, replenishes hand)
    resolveCurrentEvent(eventResult)
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
              <div style={selectionNameStyle}>
                <span role="img" aria-label="Captain portrait">{selectedCaptain.portrait}</span>
                <span>Captain: {selectedCaptain.name}</span>
              </div>
              <CaptainStats stats={selectedCaptain.stats} compact />
            </>
          ) : (
            <span>Captain: None</span>
          )}
        </div>
        <div style={selectionItemStyle} data-testid="selected-train">
          {selectedTrain ? (
            <>
              <div style={selectionNameStyle}>
                <span role="img" aria-label="Train sprite">{selectedTrain.sprite}</span>
                <span>Train: {selectedTrain.name}</span>
              </div>
              <TrainStats stats={selectedTrain.stats} compact />
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
        <LocationIndicator />
        <JourneyTrack />
      </div>

      {/* Bottom Zone - Crew + GO Button + Cargo Inventory */}
      <div style={bottomZoneStyle} data-testid="crew-zone">
        <CrewPanel />
        <CargoInventory carriedCargo={carriedCargo} />
        <div style={goButtonContainerStyle}>
          <GoButton onGo={handleGoClick} disabled={isTurnRolling} />
        </div>
      </div>

      {/* Turn Dice Rolling Overlay - shows when GO button is pressed */}
      <AnimatePresence>
        {isTurnRolling && (
          <>
            <motion.div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: 999,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-testid="turn-dice-overlay"
            />
            <motion.div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.div
                style={{
                  width: '120px',
                  height: '120px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  fontWeight: 'bold',
                  color: '#1a1a2e',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  border: '4px solid var(--color-gold, #F7B538)',
                }}
                animate={showFinalRoll ? {
                  scale: [1, 1.2, 1],
                } : {
                  rotate: [0, -15, 15, -10, 10, 0],
                  scale: [1, 1.1, 0.95, 1.05, 1],
                }}
                transition={showFinalRoll ? {
                  duration: 0.3,
                } : {
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                data-testid="turn-dice-box"
              >
                <span data-testid="turn-dice-value">{turnDiceDisplayed}</span>
              </motion.div>
              <motion.div
                style={{
                  marginTop: '1.5rem',
                  fontSize: '1.5rem',
                  color: showFinalRoll ? '#4CAF50' : 'var(--color-gold, #F7B538)',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
                animate={showFinalRoll ? { opacity: 1, scale: [0.8, 1.1, 1] } : { opacity: [0.5, 1, 0.5] }}
                transition={showFinalRoll ? { duration: 0.3 } : { duration: 0.8, repeat: Infinity }}
              >
                {showFinalRoll ? `Rolled ${turnDiceDisplayed}!` : 'Rolling...'}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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

      {/* Cargo Discovery Modal - shows when cargo is found during travel (after event resolved) */}
      {showCargoDiscovery && discoveredCargo && (
        <CargoDiscoveryModal
          cargoItem={discoveredCargo}
          onContinue={handleCargoDiscoveryContinue}
        />
      )}

      {/* Cargo Open Modal - shows at station when player has cargo (before station modal) */}
      {pendingCargoOpen && currentCargoReward && (
        <CargoOpenModal
          cargoItem={pendingCargoOpen}
          reward={currentCargoReward}
          onContinue={handleCargoOpenContinue}
        />
      )}

      {/* Station Modal - shows when arriving at a new country (after event and cargo opening are resolved) */}
      {!currentEvent && !showCargoDiscovery && !pendingCargoOpen && showStationModal && lastTurnResult?.stationReward && !currentMiniGame && !currentQuiz && (
        <StationModal
          country={countries[currentCountryIndex]}
          reward={lastTurnResult.stationReward}
          onContinue={handleDismissStationModal}
          onVisitShop={handleVisitShop}
          onPlayMiniGame={handlePlayMiniGame}
          onTakeQuiz={handleTakeQuiz}
          miniGamePlayed={playedMiniGames.has(countries[currentCountryIndex].id)}
          quizTaken={takenQuizzes.has(countries[currentCountryIndex].id)}
        />
      )}

      {/* Mini-Game Modal - shows when playing mini-game from station */}
      {currentMiniGame && (
        <MiniGameModal
          miniGame={currentMiniGame}
          onComplete={handleMiniGameComplete}
          onSkip={handleMiniGameSkip}
        />
      )}

      {/* Quiz Modal - shows when taking quiz from station */}
      {currentQuiz && showQuizModal && (
        <QuizModal
          quiz={currentQuiz}
          onComplete={handleQuizComplete}
          onSkip={handleQuizSkip}
        />
      )}

      {/* Station Shop Modal - shows when visiting shop from station */}
      {showCartShop && (() => {
        const currentCountry = countries[currentCountryIndex]
        const countryPrices = getPricesForCountry(currentCountry.id)
        return countryPrices ? (
          <StationShop
            money={resources.money}
            ownedCarts={ownedCarts}
            prices={countryPrices.prices}
            shopCart={shopCart}
            maxResources={MAX_RESOURCES}
            currentResources={resources}
            countryTheme={countryPrices.theme}
            onPurchaseCart={handlePurchaseCart}
            onUpdateShopCart={handleUpdateShopCart}
            onPurchaseResources={handlePurchaseResources}
            onClose={handleCloseCartShop}
          />
        ) : null
      })()}

      {/* Turn Result Modal - shows after station modal is dismissed (or immediately if no station) */}
      {lastTurnResult && lastTurnResult.gameStatus === 'playing' && !showStationModal && !showCartShop && !currentEvent && !showCargoDiscovery && !pendingCargoOpen && !currentMiniGame && !showQuizModal && (
        <TurnResultDisplay
          result={lastTurnResult}
          onDismiss={handleDismissTurnResult}
        />
      )}
    </div>
  )
}
