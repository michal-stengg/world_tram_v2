import { PixelButton } from '../common/PixelButton'
import type { TurnResult } from '../../logic/turn'

interface TurnResultDisplayProps {
  result: TurnResult
  onDismiss: () => void
}

export function TurnResultDisplay({ result, onDismiss }: TurnResultDisplayProps) {
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '4px solid var(--color-gold, #F7B538)',
    borderRadius: '8px',
    padding: '1.5rem',
    minWidth: '300px',
    textAlign: 'center',
    zIndex: 1000,
  }

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  }

  const diceStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
  }

  const rollTextStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: 'var(--color-gold, #F7B538)',
    fontWeight: 'bold',
    marginBottom: '1rem',
  }

  const changesGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  }

  const changeItemStyle = (value: number): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.25rem 0.5rem',
    color: value > 0 ? '#3E8914' : value < 0 ? '#DB3A34' : '#ffffff',
  })

  const arrivalStyle: React.CSSProperties = {
    color: '#3E8914',
    fontWeight: 'bold',
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(62, 137, 20, 0.2)',
    borderRadius: '4px',
  }

  const formatChange = (value: number): string => {
    if (value > 0) return `+${value}`
    return value.toString()
  }

  return (
    <>
      <div style={overlayStyle} onClick={onDismiss} />
      <div style={containerStyle} data-testid="turn-result-display">
        <div style={diceStyle}>
          <span role="img" aria-label="Dice">🎲</span>
        </div>
        <div style={rollTextStyle}>
          Rolled {result.diceRoll}! Moved {result.movement} distance
        </div>

        <div style={changesGridStyle}>
          <div style={changeItemStyle(result.resourceChanges.food)}>
            <span>🍞 Food</span>
            <span data-testid="resource-change-food">
              {formatChange(result.resourceChanges.food)}
            </span>
          </div>
          <div style={changeItemStyle(result.resourceChanges.fuel)}>
            <span>⛽ Fuel</span>
            <span data-testid="resource-change-fuel">
              {formatChange(result.resourceChanges.fuel)}
            </span>
          </div>
          <div style={changeItemStyle(result.resourceChanges.water)}>
            <span>💧 Water</span>
            <span data-testid="resource-change-water">
              {formatChange(result.resourceChanges.water)}
            </span>
          </div>
          <div style={changeItemStyle(result.resourceChanges.money)}>
            <span>💰 Money</span>
            <span data-testid="resource-change-money">
              {formatChange(result.resourceChanges.money)}
            </span>
          </div>
        </div>

        {result.arrivedAtCountry && (
          <div style={arrivalStyle}>
            🚉 Arrived at new station!
          </div>
        )}

        <PixelButton onClick={onDismiss} variant="gold">
          Continue
        </PixelButton>
      </div>
    </>
  )
}
