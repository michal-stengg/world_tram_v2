import { motion } from 'framer-motion'
import { CountryMarker } from './CountryMarker'
import type { CountryStatus } from './CountryMarker'
import { countries } from '../../data/countries'
import { useGameStore } from '../../stores/gameStore'

export function JourneyTrack() {
  const currentCountryIndex = useGameStore((state) => state.currentCountryIndex)
  const selectedTrain = useGameStore((state) => state.selectedTrain)
  const progressInCountry = useGameStore((state) => state.progressInCountry)

  const getCountryStatus = (index: number): CountryStatus => {
    if (index < currentCountryIndex) return 'visited'
    if (index === currentCountryIndex) return 'current'
    return 'upcoming'
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    gap: '0.5rem',
  }

  const trackContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    overflowX: 'auto',
    padding: '0.5rem',
    width: '100%',
    position: 'relative',
  }

  const markersContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.25rem',
  }

  const railStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '90px',
    left: '0',
    right: '0',
    height: '12px',
    backgroundColor: '#555',
    borderRadius: '6px',
  }

  const trainStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '75px',
    fontSize: '3.375rem',
    zIndex: 10,
  }

  // Calculate train position based on current country and progress
  const currentCountry = countries[currentCountryIndex]
  const progressRatio = currentCountry ? progressInCountry / currentCountry.distanceRequired : 0
  const markerSpacing = 192 // pixels between country markers
  const basePosition = (currentCountryIndex * markerSpacing) + 90 // Center on current country
  const nextCountryOffset = progressRatio * markerSpacing // Move towards next country based on progress
  const trainPosition = `${basePosition + nextCountryOffset}px`

  return (
    <div style={containerStyle} data-testid="journey-track">
      <div style={trackContainerStyle}>
        <div style={railStyle} data-testid="rail" />
        <motion.div
          style={{ ...trainStyle, left: trainPosition }}
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          data-testid="train-position"
        >
          {selectedTrain?.sprite || '🚂'}
        </motion.div>
        <div style={markersContainerStyle}>
          {countries.map((country, index) => (
            <CountryMarker
              key={country.id}
              country={country}
              status={getCountryStatus(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
