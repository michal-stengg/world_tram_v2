import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PixelButton } from '../common/PixelButton'
import { CardHand } from './CardHand'
import type { GameEvent } from '../../data/events'
import type { BonusCard } from '../../data/cards'
import type { EventResult } from '../../logic/events'
import type { CrewMember } from '../../types'
import { calculateCrewEventBonus } from '../../logic/crew'

export interface EventModalProps {
  event: GameEvent
  cardHand: BonusCard[]
  selectedCardIds: string[]
  onSelectCard: (cardId: string) => void
  onRoll: () => void
  result?: EventResult
  onContinue: () => void
  isRolling?: boolean
  diceValue?: number
  captainStats?: { engineering: number; food: number; security: number }
  crew?: CrewMember[]
}

export function EventModal({
  event,
  cardHand,
  selectedCardIds,
  onSelectCard,
  onRoll,
  result,
  onContinue,
  isRolling = false,
  diceValue,
  captainStats,
  crew,
}: EventModalProps) {
  // State for the animated dice display during rolling
  const [displayedDice, setDisplayedDice] = useState(diceValue || 1)

  // Calculate bonuses (updates dynamically when cards are selected)
  const captainBonus = captainStats?.[event.statTested] ?? 0
  const crewBonus = crew ? calculateCrewEventBonus(crew, event.statTested) : 0

  // Calculate card bonus from selected cards that match the event stat
  const selectedCards = cardHand.filter(card => selectedCardIds.includes(card.id))
  const cardBonus = selectedCards
    .filter(card => card.stat === event.statTested)
    .reduce((sum, card) => sum + card.bonus, 0)

  const totalBonus = captainBonus + crewBonus + cardBonus
  const effectiveRollNeeded = Math.max(1, event.difficulty - totalBonus)

  // Animate through dice values during rolling
  useEffect(() => {
    if (!isRolling) {
      if (diceValue !== undefined) {
        setDisplayedDice(diceValue)
      }
      return
    }

    // Cycle through dice values rapidly while rolling
    const interval = setInterval(() => {
      setDisplayedDice((prev) => (prev % 6) + 1)
    }, 100)

    return () => clearInterval(interval)
  }, [isRolling, diceValue])
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  }

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '4px solid var(--color-danger, #DB3A34)',
    borderRadius: '8px',
    padding: '1.5rem',
    minWidth: '400px',
    maxWidth: '500px',
    textAlign: 'center',
    zIndex: 1000,
  }

  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: 'var(--color-danger, #DB3A34)',
    fontWeight: 'bold',
    marginBottom: '1rem',
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: '#ffffff',
    marginBottom: '1.5rem',
    lineHeight: 1.4,
  }

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  }

  const labelStyle: React.CSSProperties = {
    color: '#aaaaaa',
    fontSize: '0.9rem',
  }

  const valueStyle: React.CSSProperties = {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  }

  const cardSectionStyle: React.CSSProperties = {
    margin: '1.5rem 0',
  }

  const cardSectionLabelStyle: React.CSSProperties = {
    color: '#aaaaaa',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
  }

  const resultContainerStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: result?.success
      ? 'rgba(46, 204, 113, 0.2)'
      : 'rgba(231, 76, 60, 0.2)',
    border: `2px solid ${result?.success ? '#2ecc71' : '#e74c3c'}`,
    borderRadius: '8px',
    marginBottom: '1.5rem',
  }

  const resultTextStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: result?.success ? '#2ecc71' : '#e74c3c',
    marginBottom: '0.5rem',
  }

  const totalStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    color: '#ffffff',
  }

  const penaltyAppliedStyle: React.CSSProperties = {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    borderRadius: '4px',
    color: '#e74c3c',
    fontWeight: 'bold',
  }

  const diceContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    margin: '1.5rem 0',
  }

  const diceBoxStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#1a1a2e',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    border: '4px solid var(--color-gold, #F7B538)',
  }

  const rollingTextStyle: React.CSSProperties = {
    marginTop: '1rem',
    fontSize: '1.25rem',
    color: 'var(--color-gold, #F7B538)',
    fontWeight: 'bold',
  }

  const formatPenalty = (penalty: GameEvent['penalty']) => {
    if (penalty.type === 'progress') {
      return `${penalty.amount} progress`
    }
    return `${penalty.amount} ${penalty.resource}`
  }

  const hasResult = result !== undefined

  return (
    <>
      <div style={overlayStyle} data-testid="event-modal-overlay" />
      <div style={containerStyle} data-testid="event-modal">
        <div style={headerStyle}>{event.name}</div>
        <div style={descriptionStyle}>{event.description}</div>

        <div style={infoRowStyle}>
          <span style={labelStyle}>Stat Tested:</span>
          <span style={valueStyle} data-testid="event-stat-tested">{event.statTested}</span>
        </div>

        <div style={infoRowStyle}>
          <span style={labelStyle}>Difficulty:</span>
          <span style={valueStyle} data-testid="event-difficulty">{event.difficulty}</span>
        </div>

        <div style={infoRowStyle}>
          <span style={labelStyle}>Penalty if Failed:</span>
          <span style={valueStyle} data-testid="event-penalty">{formatPenalty(event.penalty)}</span>
        </div>

        {/* Bonuses and effective roll display - only show before result */}
        {!hasResult && captainStats && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px' }} data-testid="event-bonuses">
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#4CAF50' }} data-testid="captain-bonus">+{captainBonus} Captain</span>
              {crewBonus > 0 && (
                <span style={{ color: '#2196F3' }} data-testid="crew-bonus">+{crewBonus} Crew</span>
              )}
              {cardBonus > 0 && (
                <span style={{ color: '#FF9800' }} data-testid="card-bonus">+{cardBonus} Cards</span>
              )}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-gold, #F7B538)' }} data-testid="effective-roll">
              Need to Roll: {effectiveRollNeeded}+
            </div>
          </div>
        )}

        {!hasResult && !isRolling && (
          <>
            <div style={cardSectionStyle}>
              <div style={cardSectionLabelStyle}>Select cards to boost your roll:</div>
              <CardHand
                cards={cardHand}
                selectedCardIds={selectedCardIds}
                onSelectCard={onSelectCard}
              />
            </div>

            <PixelButton onClick={onRoll} variant="danger">
              Roll
            </PixelButton>
          </>
        )}

        <AnimatePresence>
          {isRolling && (
            <div style={diceContainerStyle} data-testid="dice-rolling">
              <motion.div
                style={diceBoxStyle}
                initial={{ rotate: 0, scale: 0.8 }}
                animate={{
                  rotate: [0, -15, 15, -10, 10, 0],
                  scale: [0.8, 1.1, 0.9, 1.05, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <span data-testid="dice-value">{displayedDice}</span>
              </motion.div>
              <motion.div
                style={rollingTextStyle}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                Rolling...
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {hasResult && (
          <>
            <div style={resultContainerStyle}>
              <div style={resultTextStyle} data-testid="event-result">
                {result.success ? 'Success!' : 'Failed!'}
              </div>
              <div style={totalStyle}>
                Total: <span data-testid="event-total">{result.total}</span> vs Difficulty: {event.difficulty}
              </div>

              {!result.success && result.penalty && (
                <div style={penaltyAppliedStyle} data-testid="event-penalty-applied">
                  Penalty: -{result.penalty.amount} {result.penalty.resource || result.penalty.type}
                </div>
              )}
            </div>

            <PixelButton onClick={onContinue} variant="gold">
              Continue
            </PixelButton>
          </>
        )}
      </div>
    </>
  )
}
