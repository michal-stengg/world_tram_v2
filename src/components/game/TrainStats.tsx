import { StatBar } from '../common/StatBar'
import type { TrainStats as TrainStatsType } from '../../types'

export interface TrainStatsProps {
  stats: TrainStatsType
  compact?: boolean
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
}

const compactContainerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  fontSize: '0.75rem',
}

const statItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
}

export function TrainStats({ stats, compact = false }: TrainStatsProps) {
  if (compact) {
    return (
      <div style={compactContainerStyle} data-testid="train-stats">
        <div style={statItemStyle}>
          <StatBar label="SPD" value={stats.speed} maxValue={6} color="#E91E63" />
        </div>
        <div style={statItemStyle}>
          <StatBar label="REL" value={stats.reliability} maxValue={6} color="#9C27B0" />
        </div>
        <div style={statItemStyle}>
          <StatBar label="PWR" value={stats.power} maxValue={6} color="#FF5722" />
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle} data-testid="train-stats">
      <StatBar label="Speed" value={stats.speed} maxValue={6} color="#E91E63" />
      <StatBar label="Reliability" value={stats.reliability} maxValue={6} color="#9C27B0" />
      <StatBar label="Power" value={stats.power} maxValue={6} color="#FF5722" />
    </div>
  )
}
