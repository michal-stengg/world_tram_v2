import { PixelButton } from '../common/PixelButton'
import { CaptainCard } from '../game/CaptainCard'
import { useGameStore } from '../../stores/gameStore'
import { captains } from '../../data/captains'

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  backgroundColor: '#1a1a2e',
  color: '#ffffff',
}

const headerContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  alignItems: 'center',
  marginBottom: '3rem',
}

const backButtonContainerStyle: React.CSSProperties = {
  flex: '0 0 auto',
}

const titleStyle: React.CSSProperties = {
  flex: '1',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  margin: 0,
  paddingRight: '80px', // offset for back button to center title
}

const cardsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
}

export function CaptainSelectionScreen() {
  const goBack = useGameStore((state) => state.goBack)
  const selectCaptain = useGameStore((state) => state.selectCaptain)

  return (
    <div style={containerStyle} data-testid="captain-selection-screen">
      <div style={headerContainerStyle}>
        <div style={backButtonContainerStyle}>
          <PixelButton variant="secondary" size="small" onClick={goBack}>
            ← Back
          </PixelButton>
        </div>
        <h1 style={titleStyle}>CHOOSE YOUR CAPTAIN</h1>
      </div>

      <div style={cardsContainerStyle}>
        {captains.map((captain) => (
          <CaptainCard
            key={captain.id}
            captain={captain}
            onSelect={() => selectCaptain(captain)}
          />
        ))}
      </div>
    </div>
  )
}
