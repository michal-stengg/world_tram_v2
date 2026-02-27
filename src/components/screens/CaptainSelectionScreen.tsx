import { motion } from 'framer-motion'
import { PixelButton } from '../common/PixelButton'
import { CaptainCard } from '../game/CaptainCard'
import { useGameStore } from '../../stores/gameStore'
import { captains } from '../../data/captains'

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1.5rem 2rem',
  background: 'radial-gradient(ellipse at 50% 30%, var(--color-bg-light, #16213e) 0%, var(--color-bg-dark, #1a1a2e) 70%)',
}

const backRowStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '900px',
  display: 'flex',
  justifyContent: 'flex-start',
  marginBottom: '0.75rem',
}

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
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

const cardsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1.5rem',
  justifyContent: 'center',
  flexWrap: 'wrap',
}

export function CaptainSelectionScreen() {
  const goBack = useGameStore((state) => state.goBack)
  const selectCaptain = useGameStore((state) => state.selectCaptain)

  return (
    <div style={containerStyle} data-testid="captain-selection-screen">
      <div style={backRowStyle}>
        <PixelButton variant="secondary" size="small" onClick={goBack}>
          ← Back
        </PixelButton>
      </div>
      <h1 style={titleStyle}>CHOOSE YOUR CAPTAIN</h1>

      <motion.p
        style={subtitleStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Each captain has unique strengths. Choose wisely!
      </motion.p>

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
