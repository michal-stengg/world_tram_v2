import { StatBar } from '../common/StatBar'
import type { CaptainStats as CaptainStatsType } from '../../types'

export interface CaptainStatsProps {
  stats: CaptainStatsType
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

export function CaptainStats({ stats, compact = false }: CaptainStatsProps) {
  if (compact) {
    return (
      <div style={compactContainerStyle} data-testid="captain-stats">
        <div style={statItemStyle}>
          <StatBar label="ENG" value={stats.engineering} maxValue={6} color="#4CAF50" />
        </div>
        <div style={statItemStyle}>
          <StatBar label="FOOD" value={stats.food} maxValue={6} color="#FF9800" />
        </div>
        <div style={statItemStyle}>
          <StatBar label="SEC" value={stats.security} maxValue={6} color="#2196F3" />
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle} data-testid="captain-stats">
      <StatBar label="Engineering" value={stats.engineering} maxValue={6} color="#4CAF50" />
      <StatBar label="Food" value={stats.food} maxValue={6} color="#FF9800" />
      <StatBar label="Security" value={stats.security} maxValue={6} color="#2196F3" />
    </div>
  )
}
