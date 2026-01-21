export interface StatBarProps {
  label: string
  value: number
  maxValue?: number
  color?: string
}

const FILLED_BLOCK = '\u2588' // █
const EMPTY_BLOCK = '\u2591' // ░

const containerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  fontFamily: 'monospace',
}

const labelStyles: React.CSSProperties = {
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
}

const blocksContainerStyles: React.CSSProperties = {
  display: 'flex',
  fontFamily: 'monospace',
  letterSpacing: '2px',
}

const emptyBlockStyles: React.CSSProperties = {
  color: '#4a4a4a',
}

export function StatBar({
  label,
  value,
  maxValue = 6,
  color = '#F7B538',
}: StatBarProps) {
  // Clamp value between 0 and maxValue
  const clampedValue = Math.max(0, Math.min(value, maxValue))
  const emptyCount = maxValue - clampedValue

  const filledBlockStyles: React.CSSProperties = {
    color,
  }

  return (
    <div
      style={containerStyles}
      data-testid="stat-bar"
      aria-label={`${label}: ${clampedValue} out of ${maxValue}`}
    >
      <span style={labelStyles}>{label}</span>
      <span style={blocksContainerStyles}>
        {Array.from({ length: clampedValue }).map((_, i) => (
          <span key={`filled-${i}`} data-testid="block-filled" style={filledBlockStyles}>
            {FILLED_BLOCK}
          </span>
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <span key={`empty-${i}`} data-testid="block-empty" style={emptyBlockStyles}>
            {EMPTY_BLOCK}
          </span>
        ))}
      </span>
    </div>
  )
}
