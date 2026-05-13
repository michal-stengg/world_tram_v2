import { useState } from 'react'
import { PixelButton } from '../common/PixelButton'
import type { MiniGame } from '../../types'

interface TrackRepairGameProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type GameState = 'ready' | 'playing' | 'finished'

const BROKEN_TILES = new Set([1, 4, 6, 9, 11])
const TILE_COUNT = 12
const MAX_SCORE = BROKEN_TILES.size

export function TrackRepairGame({ miniGame, onComplete, onSkip }: TrackRepairGameProps) {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [repairedTiles, setRepairedTiles] = useState<Set<number>>(new Set())

  const startGame = () => {
    setGameState('playing')
    setRepairedTiles(new Set())
  }

  const repairTile = (tileIndex: number) => {
    if (!BROKEN_TILES.has(tileIndex) || repairedTiles.has(tileIndex)) return

    const nextRepairedTiles = new Set(repairedTiles)
    nextRepairedTiles.add(tileIndex)
    setRepairedTiles(nextRepairedTiles)

    if (nextRepairedTiles.size === MAX_SCORE) {
      setGameState('finished')
      onComplete(MAX_SCORE, MAX_SCORE)
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 64px)',
    gap: '8px',
    justifyContent: 'center',
  }

  const tileStyle = (isBroken: boolean, isRepaired: boolean): React.CSSProperties => ({
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    border: isBroken && !isRepaired ? '3px solid #ef5350' : '2px solid #555',
    backgroundColor: isRepaired ? '#2e7d32' : isBroken ? '#4a2630' : '#263238',
    color: '#fff',
    fontSize: '1.6rem',
    cursor: isBroken && !isRepaired ? 'pointer' : 'default',
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
          <p>Find the cracked rails and repair them before departure.</p>
          <PixelButton onClick={startGame} variant="gold" glow>
            Start
          </PixelButton>
        </>
      )}

      {gameState === 'playing' && (
        <>
          <div>
            Repairs: {repairedTiles.size}/{MAX_SCORE}
          </div>
          <div style={gridStyle}>
            {Array.from({ length: TILE_COUNT }, (_, index) => {
              const isBroken = BROKEN_TILES.has(index)
              const isRepaired = repairedTiles.has(index)
              const label = isBroken && !isRepaired ? 'repair cracked rail' : 'intact rail'
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={label}
                  style={tileStyle(isBroken, isRepaired)}
                  onClick={() => repairTile(index)}
                >
                  {isRepaired ? '✓' : isBroken ? '⚡' : '═'}
                </button>
              )
            })}
          </div>
        </>
      )}

      {gameState === 'finished' && (
        <div>
          Track repaired. Score: {MAX_SCORE}/{MAX_SCORE}
        </div>
      )}
    </div>
  )
}
