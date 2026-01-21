import { motion } from 'framer-motion'
import type { BonusCard } from '../../data/cards'

export interface CardDisplayProps {
  card: BonusCard
  selected: boolean
  onSelect: () => void
}

// Stat colors matching the design system
const STAT_COLORS = {
  engineering: '#1B4B8C', // blue
  food: '#3E8914',        // green
  security: '#DB3A34',    // red
}

const cardStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
  borderRadius: '12px',
  backgroundColor: '#1a1a2e',
  border: '3px solid #333',
  cursor: 'pointer',
  width: '180px',
  gap: '0.5rem',
  fontFamily: 'monospace',
}

const selectedCardStyles: React.CSSProperties = {
  ...cardStyles,
  border: '3px solid #F7B538',
  boxShadow: '0 0 20px rgba(247, 181, 56, 0.4)',
}

const nameStyles: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 'bold',
  color: '#F7B538',
  margin: 0,
  textAlign: 'center',
}

const statContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  marginTop: '0.25rem',
}

const statIndicatorStyles = (color: string): React.CSSProperties => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: color,
})

const statTypeStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#aaa',
  textTransform: 'capitalize',
}

const bonusStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#4ade80',
  margin: '0.25rem 0',
}

const descriptionStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#888',
  textAlign: 'center',
  lineHeight: 1.3,
  minHeight: '2.5rem',
}

export function CardDisplay({ card, selected, onSelect }: CardDisplayProps) {
  const handleClick = () => {
    onSelect()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  const statColor = STAT_COLORS[card.stat]

  return (
    <motion.div
      data-testid={`card-display-${card.id}`}
      data-selected={selected}
      role="button"
      tabIndex={0}
      aria-label={`Select card ${card.name}`}
      style={selected ? selectedCardStyles : cardStyles}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: selected ? 1.05 : 1,
      }}
      whileHover={{
        y: -5,
        boxShadow: '0 8px 25px rgba(247, 181, 56, 0.3)',
        borderColor: '#F7B538',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
    >
      <h3 style={nameStyles}>{card.name}</h3>

      <div style={statContainerStyles}>
        <div
          data-testid="stat-indicator"
          style={statIndicatorStyles(statColor)}
        />
        <span data-testid="stat-type" style={statTypeStyles}>{card.stat}</span>
      </div>

      <div style={bonusStyles}>+{card.bonus}</div>

      <p style={descriptionStyles}>{card.description}</p>
    </motion.div>
  )
}
