import { motion } from 'framer-motion'
import type { CargoItem, CargoRarity } from '../../types'
import { PixelButton } from '../common/PixelButton'

export interface CargoDiscoveryModalProps {
  cargoItem: CargoItem
  onContinue: () => void
}

const rarityColors: Record<CargoRarity, string> = {
  common: '#666',
  rare: '#4488ff',
  legendary: '#FFD700',
}

export function CargoDiscoveryModal({ cargoItem, onContinue }: CargoDiscoveryModalProps) {
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

  const headerStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: 'var(--color-gold, #F7B538)',
    fontWeight: 'bold',
    marginBottom: '1rem',
  }

  const iconContainerStyle: React.CSSProperties = {
    fontSize: '4rem',
    marginBottom: '1rem',
  }

  const itemNameStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
  }

  const rarityBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: rarityColors[cargoItem.rarity],
    borderRadius: '4px',
    color: cargoItem.rarity === 'legendary' ? '#000' : '#fff',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    textTransform: 'uppercase',
    marginBottom: '1rem',
  }

  const noteStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#aaaaaa',
    marginBottom: '1.5rem',
    fontStyle: 'italic',
  }

  return (
    <>
      <div style={overlayStyle} data-testid="cargo-discovery-overlay" />
      <motion.div
        style={containerStyle}
        data-testid="cargo-discovery-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <div style={headerStyle} data-testid="cargo-discovery-header">
          You found a crate! 📦
        </div>

        <motion.div
          style={iconContainerStyle}
          data-testid="cargo-item-icon"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', duration: 0.5 }}
        >
          {cargoItem.icon}
        </motion.div>

        <div style={itemNameStyle} data-testid="cargo-item-name">
          {cargoItem.name}
        </div>

        <div style={rarityBadgeStyle} data-testid="cargo-rarity-badge">
          {cargoItem.rarity}
        </div>

        <div style={noteStyle}>
          Will open at next station
        </div>

        <PixelButton onClick={onContinue} variant="gold">
          Continue
        </PixelButton>
      </motion.div>
    </>
  )
}
