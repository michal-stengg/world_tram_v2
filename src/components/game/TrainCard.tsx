import { motion, type Transition } from 'framer-motion'
import type { Train } from '../../types'
import { StatBar } from '../common/StatBar'

export interface TrainCardProps {
  train: Train
  selected?: boolean
  onSelect?: () => void
}

const cardStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1.5rem',
  border: '3px solid #ffffff',
  borderRadius: '12px',
  cursor: 'pointer',
  backgroundColor: 'rgba(45, 27, 105, 0.5)',
  minWidth: '220px',
  maxWidth: '280px',
}

const selectedCardStyles: React.CSSProperties = {
  ...cardStyles,
  borderColor: '#F7B538',
  boxShadow: '0 0 20px rgba(247, 181, 56, 0.5)',
}

const spriteStyles: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: '0.5rem',
}

const nameStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  marginBottom: '0.25rem',
  color: '#ffffff',
}

const originStyles: React.CSSProperties = {
  fontSize: '1rem',
  opacity: 0.8,
  marginBottom: '1rem',
  color: '#ffffff',
}

const characterStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  fontStyle: 'italic',
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#cccccc',
  lineHeight: 1.4,
}

const statsContainerStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 17,
}

// Stat colors
const SPEED_COLOR = '#F7B538' // gold
const RELIABILITY_COLOR = '#1B4B8C' // blue
const POWER_COLOR = '#DB3A34' // red

export function TrainCard({ train, selected = false, onSelect }: TrainCardProps) {
  const handleClick = () => {
    onSelect?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.()
    }
  }

  return (
    <motion.div
      data-testid="train-card"
      data-selected={selected ? 'true' : undefined}
      style={selected ? selectedCardStyles : cardStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Select ${train.name} train from ${train.origin}`}
      aria-pressed={selected}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: selected ? 1.05 : 1,
      }}
      whileHover={{
        scale: selected ? 1.05 : 1.02,
        y: -5,
        borderColor: '#F7B538',
      }}
      whileTap={{ scale: 0.98 }}
      transition={springTransition}
    >
      <span style={spriteStyles} role="img" aria-hidden="true">
        {train.sprite}
      </span>
      <span style={nameStyles}>{train.name}</span>
      <span style={originStyles}>{train.origin}</span>
      <span style={characterStyles}>{train.character}</span>
      <div style={statsContainerStyles}>
        <StatBar label="Speed" value={train.stats.speed} color={SPEED_COLOR} />
        <StatBar label="Reliability" value={train.stats.reliability} color={RELIABILITY_COLOR} />
        <StatBar label="Power" value={train.stats.power} color={POWER_COLOR} />
      </div>
    </motion.div>
  )
}
