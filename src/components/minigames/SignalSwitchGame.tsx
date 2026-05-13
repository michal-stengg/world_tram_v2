import { useState } from 'react'
import { PixelButton } from '../common/PixelButton'
import type { MiniGame } from '../../types'

interface SignalSwitchGameProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type GameState = 'ready' | 'playing' | 'finished'
type SignalColor = 'Red' | 'Yellow' | 'Green'

const SEQUENCE: SignalColor[] = ['Red', 'Green', 'Yellow', 'Green', 'Red']
const SIGNALS: Array<{ label: SignalColor; icon: string; color: string }> = [
  { label: 'Red', icon: '🔴', color: '#ef5350' },
  { label: 'Yellow', icon: '🟡', color: '#f7b538' },
  { label: 'Green', icon: '🟢', color: '#66bb6a' },
]

export function SignalSwitchGame({ miniGame, onComplete, onSkip }: SignalSwitchGameProps) {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)

  const startGame = () => {
    setGameState('playing')
    setStep(0)
    setScore(0)
  }

  const chooseSignal = (signal: SignalColor) => {
    const nextScore = score + (signal === SEQUENCE[step] ? 1 : 0)
    const nextStep = step + 1

    setScore(nextScore)
    setStep(nextStep)

    if (nextStep === SEQUENCE.length) {
      setGameState('finished')
      onComplete(nextScore, SEQUENCE.length)
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

  const signalRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }

  const signalButtonStyle = (color: string): React.CSSProperties => ({
    minWidth: '96px',
    minHeight: '88px',
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
          <p>Match the requested signal before the tram reaches the junction.</p>
          <PixelButton onClick={startGame} variant="gold" glow>
            Start
          </PixelButton>
        </>
      )}

      {gameState === 'playing' && (
        <>
          <div>
            Step {step + 1}/{SEQUENCE.length} | Score: {score}
          </div>
          <div style={{ fontSize: '1.25rem', color: '#F7B538', fontWeight: 'bold' }}>
            Set signal to {SEQUENCE[step]}
          </div>
          <div style={signalRowStyle}>
            {SIGNALS.map((signal) => (
              <button
                key={signal.label}
                type="button"
                aria-label={signal.label}
                style={signalButtonStyle(signal.color)}
                onClick={() => chooseSignal(signal.label)}
              >
                <span style={{ display: 'block', fontSize: '2rem' }}>{signal.icon}</span>
                {signal.label}
              </button>
            ))}
          </div>
        </>
      )}

      {gameState === 'finished' && (
        <div>
          Signal route set. Score: {score}/{SEQUENCE.length}
        </div>
      )}
    </div>
  )
}
