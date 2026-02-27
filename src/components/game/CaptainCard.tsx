import { motion } from 'framer-motion'
import type { Captain } from '../../types'
import { StatBar } from '../common/StatBar'

export interface CaptainCardProps {
  captain: Captain
  selected?: boolean
  onSelect?: () => void
}

// Stat colors
const STAT_COLORS = {
  engineering: '#1B4B8C', // blue
  food: '#3E8914',        // green
  security: '#DB3A34',    // red
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

const portraitStyles: React.CSSProperties = {
  fontSize: '3.5rem',
  marginBottom: '0.5rem',
  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
}

const nameStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: 'var(--color-gold, #F7B538)',
  margin: 0,
  textShadow: '0 1px 3px rgba(0,0,0,0.4)',
}

const originStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--color-text-secondary, #a0b4c8)',
  margin: 0,
  letterSpacing: '0.05em',
}

const descriptionStyles: React.CSSProperties = {
  fontSize: '0.7rem',
  color: 'var(--color-text-secondary, #a0b4c8)',
  textAlign: 'center',
  marginTop: '0.5rem',
  marginBottom: '0.75rem',
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

export function CaptainCard({ captain, selected = false, onSelect }: CaptainCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <motion.div
      data-testid={`captain-card-${captain.id}`}
      data-selected={selected}
      role="button"
      tabIndex={0}
      aria-label={`Select captain ${captain.name}`}
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
      <div data-testid="captain-portrait" style={portraitStyles}>
        {captain.portrait}
      </div>

      <h3 style={nameStyles}>{captain.name}</h3>
      <p style={originStyles}>{captain.origin}</p>

      <p style={descriptionStyles}>{captain.description}</p>

      <div style={statsContainerStyles}>
        <StatBar
          label="Eng"
          value={captain.stats.engineering}
          color={STAT_COLORS.engineering}
        />
        <StatBar
          label="Food"
          value={captain.stats.food}
          color={STAT_COLORS.food}
        />
        <StatBar
          label="Sec"
          value={captain.stats.security}
          color={STAT_COLORS.security}
        />
      </div>
    </motion.div>
  )
}
