import { PixelButton } from '../common/PixelButton'
import type { Country } from '../../types'
import type { StationReward } from '../../logic/station'

interface StationModalProps {
  country: Country
  reward: StationReward
  onContinue: () => void
}

export function StationModal({ country, reward, onContinue }: StationModalProps) {
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
    border: '4px solid var(--color-gold, #F7B538)',
    borderRadius: '8px',
    padding: '1.5rem',
    minWidth: '320px',
    textAlign: 'center',
    zIndex: 1000,
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  }

  const headerStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: 'var(--color-gold, #F7B538)',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  }

  const rewardsContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  }

  const rewardRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
  }

  const rewardLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const waterValueStyle: React.CSSProperties = {
    color: 'var(--color-water, #3498db)',
    fontWeight: 'bold',
  }

  const moneyValueStyle: React.CSSProperties = {
    color: 'var(--color-money, #f1c40f)',
    fontWeight: 'bold',
  }

  return (
    <>
      <div
        style={overlayStyle}
        onClick={onContinue}
        data-testid="station-modal-overlay"
      />
      <div style={containerStyle} data-testid="station-modal">
        <div style={iconStyle}>
          <span>{country.icon}</span>
        </div>
        <div style={headerStyle}>
          Welcome to {country.name}!
        </div>

        <div style={rewardsContainerStyle}>
          <div style={rewardRowStyle}>
            <span style={rewardLabelStyle}>
              <span role="img" aria-label="Water">💧</span>
              <span>Water</span>
            </span>
            <span style={waterValueStyle} data-testid="water-reward">
              +{reward.waterRefill}
            </span>
          </div>
          <div style={rewardRowStyle}>
            <span style={rewardLabelStyle}>
              <span role="img" aria-label="Money">💰</span>
              <span>Money</span>
            </span>
            <span style={moneyValueStyle} data-testid="money-reward">
              +${reward.moneyEarned}
            </span>
          </div>
        </div>

        <PixelButton onClick={onContinue} variant="gold">
          Continue
        </PixelButton>
      </div>
    </>
  )
}
