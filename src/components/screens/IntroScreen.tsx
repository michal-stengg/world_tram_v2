import { motion } from 'framer-motion'
import { PixelButton } from '../common/PixelButton'
import { useGameStore } from '../../stores/gameStore'

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
  textAlign: 'center',
  background: 'radial-gradient(ellipse at 50% 40%, #16213e 0%, #1a1a2e 60%, #0f0f1e 100%)',
  overflow: 'hidden',
  position: 'relative',
}

const titleStyles: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
  color: '#F7B538',
  margin: 0,
  fontWeight: 'bold',
  textShadow: '3px 3px 0px #c4841d, 0 0 40px rgba(247, 181, 56, 0.3)',
  letterSpacing: '0.05em',
}

const trainEmojiStyles: React.CSSProperties = {
  display: 'block',
  fontSize: '3rem',
  marginBottom: '0.75rem',
}

const subtitleStyles: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#a0b4c8',
  marginTop: '0.5rem',
  marginBottom: '0.5rem',
  opacity: 0.9,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
}

const dividerStyles: React.CSSProperties = {
  width: '200px',
  height: '2px',
  background: 'linear-gradient(90deg, transparent, #F7B538, transparent)',
  margin: '1rem auto',
}

const buttonContainerStyles: React.CSSProperties = {
  marginTop: '1.5rem',
}

const trackLineStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '60px',
  left: 0,
  right: 0,
  height: '4px',
  background: 'linear-gradient(90deg, transparent 0%, rgba(247, 181, 56, 0.15) 20%, rgba(247, 181, 56, 0.3) 50%, rgba(247, 181, 56, 0.15) 80%, transparent 100%)',
}

const tiesContainerStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '55px',
  left: 0,
  right: 0,
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
}

const tieStyles: React.CSSProperties = {
  width: '12px',
  height: '14px',
  backgroundColor: 'rgba(247, 181, 56, 0.08)',
  borderRadius: '1px',
}

const versionStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '16px',
  fontSize: '0.6rem',
  color: 'rgba(255, 255, 255, 0.2)',
  letterSpacing: '0.1em',
}

export function IntroScreen() {
  const setScreen = useGameStore((state) => state.setScreen)

  const handleStartGame = () => {
    setScreen('captainSelect')
  }

  return (
    <div style={containerStyles} data-testid="intro-screen">
      {/* Decorative rail track at bottom */}
      <div style={trackLineStyles} />
      <div style={tiesContainerStyles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={tieStyles} />
        ))}
      </div>

      <motion.div
        style={trainEmojiStyles}
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.2 }}
      >
        <span role="img" aria-label="train">🚂</span>
      </motion.div>

      <motion.h1
        style={titleStyles}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        WORLD TRAM
      </motion.h1>

      <motion.div
        style={dividerStyles}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />

      <motion.p
        style={subtitleStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        A Turn-Based Railway Adventure
      </motion.p>

      <motion.div
        style={buttonContainerStyles}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <PixelButton onClick={handleStartGame} variant="gold" size="large" glow>
          START GAME
        </PixelButton>
      </motion.div>

      <span style={versionStyles}>v1.0</span>
    </div>
  )
}
