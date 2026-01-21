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
}

const titleStyles: React.CSSProperties = {
  fontSize: 'var(--font-size-title, 4rem)',
  color: 'var(--color-gold, #F7B538)',
  margin: 0,
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
}

const subtitleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  color: '#ffffff',
  marginTop: '1rem',
  marginBottom: '3rem',
  opacity: 0.9,
}

const buttonContainerStyles: React.CSSProperties = {
  marginTop: '2rem',
}

export function IntroScreen() {
  const setScreen = useGameStore((state) => state.setScreen)

  const handleStartGame = () => {
    setScreen('captainSelect')
  }

  return (
    <div style={containerStyles} data-testid="intro-screen">
      <h1 style={titleStyles}>
        <span role="img" aria-label="train">🚂</span> WORLD TRAM
      </h1>
      <p style={subtitleStyles}>A Turn-Based Railway Adventure</p>
      <div style={buttonContainerStyles}>
        <PixelButton onClick={handleStartGame} variant="gold" size="large" glow>
          START GAME
        </PixelButton>
      </div>
    </div>
  )
}
