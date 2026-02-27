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
  padding: '1.5rem 1.25rem',
  borderRadius: 'var(--radius-lg, 12px)',
  backgroundColor: 'var(--color-bg-card, rgba(22, 33, 62, 0.8))',
  border: 'var(--border-card, 2px solid rgba(255, 255, 255, 0.1))',
  cursor: 'pointer',
  width: '240px',
  gap: '0.5rem',
  fontFamily: 'monospace',
}

const selectedCardStyles: React.CSSProperties = {
  ...cardStyles,
  border: 'var(--border-card-selected, 2px solid #F7B538)',
  boxShadow: 'var(--shadow-card-selected)',
  backgroundColor: 'var(--color-bg-card-hover, rgba(30, 40, 70, 0.9))',
}

const spriteStyles: React.CSSProperties = {
  fontSize: '3.5rem',
  marginBottom: '0.5rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
}

const nameStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  marginBottom: '0.25rem',
  color: 'var(--color-gold, #F7B538)',
  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
}

const originStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary, #a0b4c8)',
  marginBottom: '0.5rem',
  letterSpacing: '0.05em',
}

const characterStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  fontStyle: 'italic',
  textAlign: 'center',
  marginBottom: '0.75rem',
  color: 'var(--color-text-secondary, #a0b4c8)',
  lineHeight: 1.5,
  minHeight: '3rem',
}

const statsContainerStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  borderTop: 'var(--border-divider, 1px solid rgba(255, 255, 255, 0.08))',
  paddingTop: '0.75rem',
}

const springTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
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
        scale: selected ? 1.03 : 1,
      }}
      whileHover={{
        y: -5,
        boxShadow: 'var(--shadow-card-hover, 0 8px 24px rgba(247, 181, 56, 0.2))',
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
