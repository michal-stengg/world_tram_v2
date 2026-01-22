import { motion } from 'framer-motion'
import type { Country } from '../../types'

export type CountryStatus = 'visited' | 'current' | 'upcoming'

export interface CountryMarkerProps {
  country: Country
  status: CountryStatus
}

export function CountryMarker({ country, status }: CountryMarkerProps) {
  const isVisited = status === 'visited'
  const isCurrent = status === 'current'

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem',
    minWidth: '180px',
    position: 'relative',
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '4.5rem',
    opacity: isVisited ? 0.5 : 1,
    filter: isVisited ? 'grayscale(50%)' : 'none',
  }

  const nameStyle: React.CSSProperties = {
    fontSize: '1.875rem',
    fontWeight: isCurrent ? 'bold' : 'normal',
    color: isCurrent ? 'var(--color-gold, #F7B538)' : isVisited ? 'var(--color-text-secondary, #b8b8d0)' : 'var(--color-text, #ffffff)',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  }

  const checkmarkStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    right: '0',
    fontSize: '2.25rem',
    color: 'var(--color-success, #3E8914)',
  }

  const currentIndicatorStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-gold, #F7B538)',
    marginTop: '0.25rem',
  }

  return (
    <div style={containerStyle} data-testid={`country-marker-${country.id}`} data-status={status}>
      {isVisited && (
        <span style={checkmarkStyle} role="img" aria-label="visited" data-testid="checkmark">
          ✓
        </span>
      )}
      <motion.span
        style={iconStyle}
        role="img"
        aria-label={country.name}
        animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {country.icon}
      </motion.span>
      <span style={nameStyle}>{country.name}</span>
      {isCurrent && (
        <motion.div
          style={currentIndicatorStyle}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          data-testid="current-indicator"
        />
      )}
    </div>
  )
}
