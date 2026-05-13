import { useState } from 'react'
import { PixelButton } from '../common/PixelButton'
import type { MiniGame } from '../../types'

interface LanternSequenceGameProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type GameState = 'ready' | 'playing' | 'finished'
type LanternColor = 'Red' | 'Blue' | 'Gold' | 'Green'

const PATTERN: LanternColor[] = ['Red', 'Blue', 'Gold', 'Green']
const LANTERNS: Array<{ label: LanternColor; color: string }> = [
  { label: 'Red', color: '#ef5350' },
  { label: 'Blue', color: '#42a5f5' },
  { label: 'Gold', color: '#f7b538' },
  { label: 'Green', color: '#66bb6a' },
]

export function LanternSequenceGame({ miniGame, onComplete, onSkip }: LanternSequenceGameProps) {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [position, setPosition] = useState(0)
  const [score, setScore] = useState(0)

  const startGame = () => {
    setGameState('playing')
    setPosition(0)
    setScore(0)
  }

  const chooseLantern = (lantern: LanternColor) => {
    if (lantern !== PATTERN[position]) {
      setPosition(0)
      setScore(0)
      return
    }

    const nextPosition = position + 1
    setPosition(nextPosition)
    setScore(nextPosition)

    if (nextPosition === PATTERN.length) {
      setGameState('finished')
      onComplete(nextPosition, PATTERN.length)
    }
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    minHeight: '400px',
    padding: '1rem',
  }

  const lanternGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(110px, 1fr))',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '280px',
  }

  const lanternButtonStyle = (color: string): React.CSSProperties => ({
    minHeight: '84px',
    border: `3px solid ${color}`,
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: '#fff',
    font: 'inherit',
    fontWeight: 'bold',
    cursor: 'pointer',
  })

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <h2>{miniGame.name}</h2>
        <p style={{ fontSize: '2rem', margin: 0 }}>{miniGame.icon}</p>
        <p>{miniGame.description}</p>
      </div>

      <PixelButton onClick={onSkip} variant="secondary" size="small">
        Skip
      </PixelButton>

      {gameState === 'ready' && (
        <>
          <p>Watch the lantern colors, then repeat the pattern.</p>
          <PixelButton onClick={startGame} variant="gold" glow>
            Start
          </PixelButton>
        </>
      )}

      {gameState === 'playing' && (
        <>
          <div data-testid="lantern-pattern" style={{ display: 'flex', gap: '0.4rem' }}>
            {PATTERN.map((color) => (
              <span key={color}>{color}</span>
            ))}
          </div>
          <div>
            Input {position + 1}/{PATTERN.length} | Score: {score}
          </div>
          <div style={lanternGridStyle}>
            {LANTERNS.map((lantern) => (
              <button
                key={lantern.label}
                type="button"
                aria-label={`${lantern.label} Lantern`}
                style={lanternButtonStyle(lantern.color)}
                onClick={() => chooseLantern(lantern.label)}
              >
                <span style={{ display: 'block', fontSize: '2rem' }}>🏮</span>
                {lantern.label} Lantern
              </button>
            ))}
          </div>
        </>
      )}

      {gameState === 'finished' && (
        <div>
          Lanterns lit. Score: {score}/{PATTERN.length}
        </div>
      )}
    </div>
  )
}
