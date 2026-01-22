import { motion } from 'framer-motion'
import type { CargoItem, CargoReward } from '../../types'
import { PixelButton } from '../common/PixelButton'

export interface CargoOpenModalProps {
  cargoItem: CargoItem
  reward: CargoReward
  onContinue: () => void
}

const RESOURCE_ICONS = {
  money: '💰',
  fuel: '⛽',
  food: '🍞',
  water: '💧',
}

const RARITY_COLORS = {
  common: '#666',
  rare: '#4488ff',
  legendary: '#FFD700',
}

export function CargoOpenModal({ cargoItem, reward, onContinue }: CargoOpenModalProps) {
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
    border: `4px solid ${RARITY_COLORS[cargoItem.rarity]}`,
    borderRadius: '8px',
    padding: '2rem',
    minWidth: '350px',
    maxWidth: '450px',
    textAlign: 'center',
    zIndex: 1000,
  }

  const headerStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    color: RARITY_COLORS[cargoItem.rarity],
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  }

  const iconContainerStyle: React.CSSProperties = {
    fontSize: '4rem',
    marginBottom: '1rem',
  }

  const itemNameStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  }

  const rarityBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: RARITY_COLORS[cargoItem.rarity],
    color: cargoItem.rarity === 'legendary' ? '#1a1a2e' : '#ffffff',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: '1.5rem',
  }

  const rewardContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  }

  const rewardIconStyle: React.CSSProperties = {
    fontSize: '2rem',
  }

  const rewardAmountStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2ecc71',
  }

  return (
    <>
      <div style={overlayStyle} data-testid="cargo-open-overlay" />
      <motion.div
        style={containerStyle}
        data-testid="cargo-open-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div style={headerStyle} data-testid="cargo-open-header">
          Reward!
        </div>

        <motion.div
          style={iconContainerStyle}
          data-testid="cargo-item-icon"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          {cargoItem.icon}
        </motion.div>

        <div style={itemNameStyle}>{cargoItem.name}</div>

        <div style={rarityBadgeStyle} data-testid="cargo-rarity-badge">
          {cargoItem.rarity}
        </div>

        <motion.div
          style={rewardContainerStyle}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span style={rewardIconStyle} data-testid="cargo-reward-icon">
            {RESOURCE_ICONS[reward.rewardType]}
          </span>
          <span style={rewardAmountStyle} data-testid="cargo-reward-amount">
            +{reward.amount}
          </span>
        </motion.div>

        <PixelButton onClick={onContinue} variant="gold">
          Collect
        </PixelButton>
      </motion.div>
    </>
  )
}
