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
  padding: '1.5rem',
  borderRadius: '12px',
  backgroundColor: '#1a1a2e',
  border: '3px solid #333',
  cursor: 'pointer',
  width: '220px',
  gap: '0.5rem',
  fontFamily: 'monospace',
}

const selectedCardStyles: React.CSSProperties = {
  ...cardStyles,
  border: '3px solid #F7B538',
  boxShadow: '0 0 20px rgba(247, 181, 56, 0.4)',
}

const portraitStyles: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: '0.5rem',
}

const nameStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#F7B538',
  margin: 0,
}

const originStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#888',
  margin: 0,
}

const descriptionStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#aaa',
  textAlign: 'center',
  marginTop: '0.5rem',
  marginBottom: '0.75rem',
  lineHeight: 1.4,
  minHeight: '3rem',
}

const statsContainerStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
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
