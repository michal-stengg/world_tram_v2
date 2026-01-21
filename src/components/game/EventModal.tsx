import { PixelButton } from '../common/PixelButton'
import { CardHand } from './CardHand'
import type { GameEvent } from '../../data/events'
import type { BonusCard } from '../../data/cards'
import type { EventResult } from '../../logic/events'

export interface EventModalProps {
  event: GameEvent
  cardHand: BonusCard[]
  selectedCardIds: string[]
  onSelectCard: (cardId: string) => void
  onRoll: () => void
  result?: EventResult
  onContinue: () => void
}

export function EventModal({
  event,
  cardHand,
  selectedCardIds,
  onSelectCard,
  onRoll,
  result,
  onContinue,
}: EventModalProps) {
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

        {!hasResult && (
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
