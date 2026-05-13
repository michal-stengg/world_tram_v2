import { ResourceMeter } from '../common/ResourceMeter'
import { useGameStore } from '../../stores/gameStore'
import { calculateResourcePreview } from '../../logic/resourcePreview'
import { getEffectiveMaxResources } from '../../logic/carts'

export function ResourceBar() {
  const resources = useGameStore((state) => state.resources)
  const turnCount = useGameStore((state) => state.turnCount)
  const crew = useGameStore((state) => state.crew)
  const captain = useGameStore((state) => state.selectedCaptain)
  const train = useGameStore((state) => state.selectedTrain)
  const ownedCarts = useGameStore((state) => state.ownedCarts)

  const preview = calculateResourcePreview(crew, captain, train, ownedCarts)
  const maxResources = getEffectiveMaxResources(ownedCarts)

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    gap: '1.5rem',
    flexWrap: 'wrap',
  }

  const metersContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  }

  const turnCounterStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.25rem 0.75rem',
    backgroundColor: 'var(--color-primary, #2D1B69)',
    borderRadius: '4px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    color: 'var(--color-gold, #F7B538)',
  }

  return (
    <div style={containerStyle} data-testid="resource-bar">
      <div style={metersContainerStyle}>
        <ResourceMeter
          icon="🍞"
          label="Food"
          current={resources.food}
          max={maxResources.food}
          color="#3E8914"
          previewDelta={preview.food}
        />
        <ResourceMeter
          icon="⛽"
          label="Fuel"
          current={resources.fuel}
          max={maxResources.fuel}
          color="#1B4B8C"
          previewDelta={preview.fuel}
        />
        <ResourceMeter
          icon="💧"
          label="Water"
          current={resources.water}
          max={maxResources.water}
          color="#4A90D9"
          previewDelta={preview.water}
        />
        <ResourceMeter
          icon="💰"
          label="Money"
          current={resources.money}
          max={maxResources.money}
          color="#F7B538"
          previewDelta={preview.money}
        />
      </div>
      <div style={turnCounterStyle} data-testid="turn-counter">
        <span>Turn</span>
        <span data-testid="turn-number">{turnCount}</span>
      </div>
    </div>
  )
}
