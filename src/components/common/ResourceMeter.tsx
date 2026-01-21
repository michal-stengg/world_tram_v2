import { motion } from 'framer-motion'

export interface ResourceMeterProps {
  icon: string
  label: string
  current: number
  max: number
  color?: string
  showWarning?: boolean
}

export function ResourceMeter({
  icon,
  label,
  current,
  max,
  color = '#F7B538',
  showWarning = true,
}: ResourceMeterProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))
  const isLow = showWarning && percentage < 20

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.5rem',
  }

  const iconLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    minWidth: '80px',
  }

  const iconStyle: React.CSSProperties = {
    fontSize: '1.25rem',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: 'var(--color-text, #ffffff)',
  }

  const barContainerStyle: React.CSSProperties = {
    flex: 1,
    height: '12px',
    backgroundColor: '#333',
    borderRadius: '6px',
    overflow: 'hidden',
    minWidth: '80px',
  }

  const barFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: isLow ? '#DB3A34' : color,
    borderRadius: '6px',
  }

  const valueStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: isLow ? '#DB3A34' : 'var(--color-text-secondary, #b8b8d0)',
    minWidth: '50px',
    textAlign: 'right',
    fontFamily: 'monospace',
  }

  return (
    <div style={containerStyle} data-testid={`resource-meter-${label.toLowerCase()}`}>
      <div style={iconLabelStyle}>
        <span style={iconStyle} role="img" aria-label={label}>
          {icon}
        </span>
        <span style={labelStyle}>{label}</span>
      </div>
      <div style={barContainerStyle} data-testid="bar-container">
        <motion.div
          style={barFillStyle}
          initial={{ width: 0 }}
          animate={{
            width: `${percentage}%`,
            ...(isLow && {
              opacity: [1, 0.6, 1],
            }),
          }}
          transition={{
            width: { type: 'spring', stiffness: 100, damping: 15 },
            opacity: { repeat: Infinity, duration: 0.8 },
          }}
          data-testid="bar-fill"
          data-warning={isLow}
        />
      </div>
      <span style={valueStyle} data-testid="value-text">
        {current}/{max}
      </span>
    </div>
  )
}
