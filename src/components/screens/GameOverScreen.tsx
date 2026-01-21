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
  background: 'linear-gradient(180deg, #4d1a1a 0%, #1a1a2e 100%)',
  color: '#ffffff',
}

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
}

const titleStyle: React.CSSProperties = {
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#DB3A34', // Danger red color
  marginBottom: '1.5rem',
  textShadow: '4px 4px 0 #800000',
  fontFamily: 'inherit',
}

const reasonStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  color: '#a0a0a0', // Muted text
  marginBottom: '2rem',
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
        <h1 style={titleStyle}>
          <span aria-hidden="true">&#x1F480; </span>
          GAME OVER
          <span aria-hidden="true"> &#x1F480;</span>
        </h1>

        <p style={reasonStyle} data-testid="game-over-reason">{reasonMessage}</p>

        <PixelButton onClick={handleTryAgain} variant="danger" size="large">
          TRY AGAIN
        </PixelButton>
      </div>
    </div>
  )
}
