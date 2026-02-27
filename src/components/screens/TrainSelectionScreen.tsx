import { motion } from 'framer-motion'
import { PixelButton } from '../common/PixelButton'
import { useGameStore } from '../../stores/gameStore'
import { trains } from '../../data/trains'
import { TrainCard } from '../game/TrainCard'

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1.5rem 2rem',
  minHeight: '100vh',
  background: 'radial-gradient(ellipse at 50% 30%, var(--color-bg-light, #16213e) 0%, var(--color-bg-dark, #1a1a2e) 70%)',
}

const backRowStyles: React.CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  display: 'flex',
  justifyContent: 'flex-start',
  marginBottom: '0.75rem',
}

const titleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: 0,
  color: 'var(--color-gold, #F7B538)',
  textShadow: '2px 2px 0px rgba(196, 132, 29, 0.5)',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'var(--color-text-secondary, #a0b4c8)',
  textAlign: 'center',
  marginBottom: '1.5rem',
  letterSpacing: '0.1em',
}

const cardsContainerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1.5rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
}

export function TrainSelectionScreen() {
  const goBack = useGameStore((state) => state.goBack)
  const selectTrain = useGameStore((state) => state.selectTrain)

  return (
    <div style={containerStyles} data-testid="train-selection-screen">
      <div style={backRowStyles}>
        <PixelButton variant="secondary" size="small" onClick={goBack}>
          ← Back
        </PixelButton>
      </div>
      <h1 style={titleStyles}>CHOOSE YOUR TRAIN</h1>

      <motion.p
        style={subtitleStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Your train determines speed, reliability and power.
      </motion.p>

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
