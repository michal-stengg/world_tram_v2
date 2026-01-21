import { PixelButton } from '../common/PixelButton'
import { useGameStore } from '../../stores/gameStore'
import { trains } from '../../data/trains'
import { TrainCard } from '../game/TrainCard'

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  minHeight: '100vh',
  color: '#ffffff',
}

const headerRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  marginBottom: '3rem',
}

const backButtonContainerStyles: React.CSSProperties = {
  position: 'absolute',
  left: 0,
}

const titleStyles: React.CSSProperties = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: 0,
}

const cardsContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '2rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
}

export function TrainSelectionScreen() {
  const goBack = useGameStore((state) => state.goBack)
  const selectTrain = useGameStore((state) => state.selectTrain)

  return (
    <div style={containerStyles} data-testid="train-selection-screen">
      <div style={headerRowStyles}>
        <div style={backButtonContainerStyles}>
          <PixelButton variant="secondary" size="small" onClick={goBack}>
            ← Back
          </PixelButton>
        </div>
        <h1 style={titleStyles}>CHOOSE YOUR TRAIN</h1>
      </div>

      <div style={cardsContainerStyles}>
        {trains.map((train) => (
          <TrainCard
            key={train.id}
            train={train}
            onSelect={() => selectTrain(train)}
          />
        ))}
      </div>
    </div>
  )
}
