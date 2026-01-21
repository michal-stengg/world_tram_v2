import { useState, useEffect } from 'react'
import { ResourceBar } from '../game/ResourceBar'
import { JourneyTrack } from '../game/JourneyTrack'
import { CrewPanel } from '../game/CrewPanel'
import { TurnResultDisplay } from '../game/TurnResultDisplay'
import { StationModal } from '../game/StationModal'
import { GoButton } from '../game/GoButton'
import { useGameStore } from '../../stores/gameStore'
import { countries } from '../../data/countries'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: '100vh',
  backgroundColor: 'var(--color-bg-dark, #1a1a2e)',
  color: 'var(--color-text, #ffffff)',
  fontFamily: 'inherit',
}

const selectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
}

const selectionItemStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderRadius: '4px',
  fontSize: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
}

const resourceZoneStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
}

const journeyZoneStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  gap: '1rem',
  overflowX: 'auto',
}

const journeyTitleStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  marginBottom: '0.5rem',
  color: 'var(--color-gold, #F7B538)',
  fontWeight: 'bold',
}

const bottomZoneStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  borderTop: '2px solid rgba(255, 255, 255, 0.1)',
}

const goButtonContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
}

export function DashboardScreen() {
  const selectedCaptain = useGameStore((state) => state.selectedCaptain)
  const selectedTrain = useGameStore((state) => state.selectedTrain)
  const executeTurn = useGameStore((state) => state.executeTurn)
  const clearTurnResult = useGameStore((state) => state.clearTurnResult)
  const lastTurnResult = useGameStore((state) => state.lastTurnResult)
  const currentCountryIndex = useGameStore((state) => state.currentCountryIndex)

  // Track whether we're showing the station modal (before showing turn result)
  const [showStationModal, setShowStationModal] = useState(false)

  // When a new turn result comes in with a stationReward, show the station modal first
  useEffect(() => {
    if (lastTurnResult?.stationReward && lastTurnResult.gameStatus === 'playing') {
      setShowStationModal(true)
    } else {
      setShowStationModal(false)
    }
  }, [lastTurnResult])

  const handleDismissStationModal = () => {
    setShowStationModal(false)
  }

  const handleDismissTurnResult = () => {
    clearTurnResult()
  }

  return (
    <div style={containerStyle} data-testid="dashboard-screen">
      {/* Selection Header - Captain and Train */}
      <div style={selectionHeaderStyle} data-testid="selection-info">
        <div style={selectionItemStyle} data-testid="selected-captain">
          {selectedCaptain ? (
            <>
              <span role="img" aria-label="Captain portrait">{selectedCaptain.portrait}</span>
              <span>Captain: {selectedCaptain.name}</span>
            </>
          ) : (
            <span>Captain: None</span>
          )}
        </div>
        <div style={selectionItemStyle} data-testid="selected-train">
          {selectedTrain ? (
            <>
              <span role="img" aria-label="Train sprite">{selectedTrain.sprite}</span>
              <span>Train: {selectedTrain.name}</span>
            </>
          ) : (
            <span>Train: None</span>
          )}
        </div>
      </div>

      {/* Top Zone - Resources */}
      <div style={resourceZoneStyle} data-testid="resource-zone">
        <ResourceBar />
      </div>

      {/* Center Zone - Journey Track */}
      <div style={journeyZoneStyle} data-testid="journey-zone">
        <h2 style={journeyTitleStyle}>Journey Progress</h2>
        <JourneyTrack />
      </div>

      {/* Bottom Zone - Crew + GO Button */}
      <div style={bottomZoneStyle} data-testid="crew-zone">
        <CrewPanel />
        <div style={goButtonContainerStyle}>
          <GoButton onGo={executeTurn} />
        </div>
      </div>

      {/* Station Modal - shows when arriving at a new country */}
      {showStationModal && lastTurnResult?.stationReward && (
        <StationModal
          country={countries[currentCountryIndex]}
          reward={lastTurnResult.stationReward}
          onContinue={handleDismissStationModal}
        />
      )}

      {/* Turn Result Modal - shows after station modal is dismissed (or immediately if no station) */}
      {lastTurnResult && lastTurnResult.gameStatus === 'playing' && !showStationModal && (
        <TurnResultDisplay
          result={lastTurnResult}
          onDismiss={handleDismissTurnResult}
        />
      )}
    </div>
  )
}
