import { useGameStore } from '../../stores/gameStore'
import { countries } from '../../data/countries'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontSize: '1.1rem',
  color: 'var(--color-text, #ffffff)',
  padding: '0.5rem',
}

const countryStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
}

const arrowStyle: React.CSSProperties = {
  margin: '0 0.5rem',
  color: 'var(--color-gold, #F7B538)',
}

const finalDestinationStyle: React.CSSProperties = {
  marginLeft: '0.5rem',
  color: 'var(--color-gold, #F7B538)',
  fontWeight: 'bold',
}

export function LocationIndicator() {
  const currentCountryIndex = useGameStore((state) => state.currentCountryIndex)

  const currentCountry = countries[currentCountryIndex]
  const isAtFinalDestination = currentCountryIndex === 9 // USA
  const nextCountry = !isAtFinalDestination ? countries[currentCountryIndex + 1] : null

  return (
    <div style={containerStyle} data-testid="location-indicator">
      <span style={countryStyle}>
        <span>{currentCountry.icon}</span>
        <span>{currentCountry.name}</span>
      </span>

      {nextCountry && (
        <>
          <span style={arrowStyle}>&rarr;</span>
          <span style={countryStyle}>
            <span>{nextCountry.icon}</span>
            <span>{nextCountry.name}</span>
          </span>
        </>
      )}

      {isAtFinalDestination && (
        <span style={finalDestinationStyle}>
          <span role="img" aria-label="finish flag">🏁</span> Final Destination!
        </span>
      )}
    </div>
  )
}
