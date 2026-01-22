import type { CargoDiscovery } from '../../types'

export interface CargoInventoryProps {
  carriedCargo: CargoDiscovery[]
}

const RARITY_COLORS = {
  common: '#666',
  rare: '#4488ff',
  legendary: '#FFD700',
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
  padding: '0.5rem',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '8px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#aaa',
}

const itemStyle = (rarity: keyof typeof RARITY_COLORS): React.CSSProperties => ({
  fontSize: '1.5rem',
  padding: '0.25rem',
  borderRadius: '4px',
  borderWidth: '2px',
  borderStyle: 'solid',
  borderColor: RARITY_COLORS[rarity],
  cursor: 'default',
})

export function CargoInventory({ carriedCargo }: CargoInventoryProps) {
  if (carriedCargo.length === 0) {
    return null
  }

  return (
    <div style={containerStyle} data-testid="cargo-inventory">
      <span style={labelStyle} data-testid="cargo-label">📦</span>
      {carriedCargo.map((discovery, index) => (
        <span
          key={`${discovery.item.id}-${index}`}
          style={itemStyle(discovery.item.rarity)}
          title={discovery.item.name}
          data-testid={`cargo-item-${index}`}
        >
          {discovery.item.icon}
        </span>
      ))}
    </div>
  )
}
