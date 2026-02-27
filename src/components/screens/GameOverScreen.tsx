import { motion } from 'framer-motion'
import { PixelButton } from '../common/PixelButton'
import { useGameStore } from '../../stores/gameStore'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
  textAlign: 'center',
  background: 'radial-gradient(ellipse at 50% 40%, #4d1a1a 0%, #2a0e0e 40%, #1a1a2e 100%)',
  color: '#ffffff',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
}

const skullStyle: React.CSSProperties = {
  fontSize: '4rem',
  marginBottom: '1rem',
}

const titleStyle: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 'bold',
  color: 'var(--color-danger, #e74c3c)',
  marginBottom: '1.5rem',
  textShadow: '3px 3px 0 #800000, 0 0 30px rgba(219, 58, 52, 0.3)',
  fontFamily: 'inherit',
}

const reasonStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--color-text-secondary, #a0b4c8)',
  marginBottom: '2.5rem',
  lineHeight: 1.6,
}

const REASON_MESSAGES: Record<string, string> = {
  starvation: 'You ran out of food!',
  out_of_fuel: 'You ran out of fuel!',
  dehydration: 'You ran out of water!',
  broke: 'You ran out of money!',
}

export function GameOverScreen() {
  const setScreen = useGameStore((state) => state.setScreen)
  const gameOverReason = useGameStore((state) => state.gameOverReason)

  const handleTryAgain = () => {
    setScreen('captainSelect')
  }

  const reasonMessage = gameOverReason
    ? REASON_MESSAGES[gameOverReason] || 'Game Over!'
    : 'Game Over!'

  return (
    <div style={containerStyle} data-testid="game-over-screen">
      <div style={contentStyle}>
        <motion.div
          style={skullStyle}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          aria-hidden="true"
        >
          &#x1F480;
        </motion.div>

        <motion.h1
          style={titleStyle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          GAME OVER
        </motion.h1>

        <motion.p
          style={reasonStyle}
          data-testid="game-over-reason"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {reasonMessage}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <PixelButton onClick={handleTryAgain} variant="danger" size="large">
            TRY AGAIN
          </PixelButton>
        </motion.div>
      </div>
    </div>
  )
}
