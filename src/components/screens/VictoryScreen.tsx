import { PixelButton } from '../common/PixelButton'
import { useGameStore } from '../../stores/gameStore'

export function VictoryScreen() {
  const setScreen = useGameStore((state) => state.setScreen)
  const turnCount = useGameStore((state) => state.turnCount)

  const handleNewGame = () => {
    setScreen('captainSelect')
  }

  return (
    <div
      data-testid="victory-screen"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      {/* Celebration emojis */}
      <div
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
        }}
        aria-hidden="true"
      >
        🎉 🏆 🎉
      </div>

      {/* Victory title */}
      <h1
        style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#F7B538',
          margin: '0 0 1.5rem 0',
          textShadow: '0 0 20px rgba(247, 181, 56, 0.5)',
        }}
      >
        VICTORY!
      </h1>

      {/* More celebration */}
      <div
        style={{
          fontSize: '2rem',
          marginBottom: '1.5rem',
        }}
        aria-hidden="true"
      >
        🎊 🎊 🎊
      </div>

      {/* Turn count message */}
      <p
        style={{
          fontSize: '1.5rem',
          color: '#ffffff',
          margin: '0 0 2rem 0',
          lineHeight: '1.6',
        }}
      >
        You completed the journey
        <br />
        in <strong style={{ color: '#F7B538' }}>{turnCount}</strong> turns!
      </p>

      {/* Encouraging message */}
      <p
        style={{
          fontSize: '1.25rem',
          color: '#a0a0a0',
          margin: '0 0 3rem 0',
        }}
      >
        Congratulations, Captain!
      </p>

      {/* New Game button */}
      <PixelButton
        variant="gold"
        size="large"
        glow
        onClick={handleNewGame}
      >
        NEW GAME
      </PixelButton>
    </div>
  )
}
