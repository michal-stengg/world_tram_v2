import { useState, useEffect, useCallback, useRef } from 'react'
import { PixelButton } from '../common/PixelButton'
import type { MiniGame } from '../../types'

interface CatcherGameProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type GameState = 'ready' | 'playing' | 'finished'

interface FallingItem {
  id: number
  x: number
  y: number
  type: 'good' | 'bad'
  icon: string
}

const GAME_DURATION = 15 // seconds
const MAX_SCORE = 15
const CATCHER_MOVE_SPEED = 10 // percentage per keypress
const ITEM_FALL_SPEED = 2 // percentage per tick
const TICK_INTERVAL = 50 // ms
const SPAWN_INTERVAL = 1000 // ms
const COLLISION_THRESHOLD = 15 // percentage
const CATCHER_Y_POSITION = 85 // percentage from top

export function CatcherGame({ miniGame, onComplete, onSkip }: CatcherGameProps) {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [score, setScore] = useState(0)
  const [catcherX, setCatcherX] = useState(50) // center position
  const [items, setItems] = useState<FallingItem[]>([])

  const nextItemId = useRef(0)
  const gameIntervalRef = useRef<number | null>(null)
  const timerIntervalRef = useRef<number | null>(null)
  const spawnIntervalRef = useRef<number | null>(null)

  const spawnItem = useCallback(() => {
    const isBad = Math.random() < 0.3 // 30% chance of bad item
    const newItem: FallingItem = {
      id: nextItemId.current++,
      x: Math.random() * 80 + 10, // 10-90% of width
      y: 0,
      type: isBad ? 'bad' : 'good',
      icon: isBad ? '💣' : miniGame.icon,
    }
    setItems(prev => [...prev, newItem])
  }, [miniGame.icon])

  const checkCollision = useCallback((item: FallingItem, currentCatcherX: number): boolean => {
    return (
      item.y >= CATCHER_Y_POSITION - 5 &&
      item.y <= CATCHER_Y_POSITION + 5 &&
      Math.abs(item.x - currentCatcherX) < COLLISION_THRESHOLD
    )
  }, [])

  const startGame = useCallback(() => {
    setGameState('playing')
    setTimeRemaining(GAME_DURATION)
    setScore(0)
    setCatcherX(50)
    setItems([])
    nextItemId.current = 0
  }, [])

  // Handle keyboard input
  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCatcherX(prev => Math.max(10, prev - CATCHER_MOVE_SPEED))
      } else if (e.key === 'ArrowRight') {
        setCatcherX(prev => Math.min(90, prev + CATCHER_MOVE_SPEED))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  // Game loop - update item positions and check collisions
  useEffect(() => {
    if (gameState !== 'playing') return

    gameIntervalRef.current = window.setInterval(() => {
      setItems(prevItems => {
        const updatedItems: FallingItem[] = []
        let scoreChange = 0

        setCatcherX(currentCatcherX => {
          for (const item of prevItems) {
            const newY = item.y + ITEM_FALL_SPEED

            // Check collision
            if (checkCollision({ ...item, y: newY }, currentCatcherX)) {
              scoreChange += item.type === 'good' ? 1 : -1
            } else if (newY < 100) {
              // Item still on screen
              updatedItems.push({ ...item, y: newY })
            }
            // Items that fall off screen are removed
          }
          return currentCatcherX
        })

        if (scoreChange !== 0) {
          setScore(prev => Math.max(0, prev + scoreChange))
        }

        return updatedItems
      })
    }, TICK_INTERVAL)

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current)
      }
    }
  }, [gameState, checkCollision])

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return

    timerIntervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameState('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [gameState])

  // Item spawning
  useEffect(() => {
    if (gameState !== 'playing') return

    // Spawn first item immediately
    spawnItem()

    spawnIntervalRef.current = window.setInterval(() => {
      spawnItem()
    }, SPAWN_INTERVAL)

    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current)
      }
    }
  }, [gameState, spawnItem])

  // Call onComplete when game finishes
  useEffect(() => {
    if (gameState === 'finished') {
      onComplete(score, MAX_SCORE)
    }
  }, [gameState, score, onComplete])

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
    }
  }, [])

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1rem',
    gap: '1rem',
    minHeight: '400px',
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
  }

  const playAreaStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    border: '2px solid #F7B538',
    overflow: 'hidden',
  }

  const catcherStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: `${100 - CATCHER_Y_POSITION}%`,
    left: `${catcherX}%`,
    transform: 'translateX(-50%)',
    fontSize: '2rem',
    transition: 'left 0.05s linear',
  }

  const itemStyle = (item: FallingItem): React.CSSProperties => ({
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    transform: 'translateX(-50%)',
    fontSize: '1.5rem',
  })

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '400px',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
  }

  const instructionsStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#aaa',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  }

  const gameOverStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2rem',
    borderRadius: '8px',
    border: '2px solid #F7B538',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>{miniGame.name}</h2>
        <p>{miniGame.description}</p>
      </div>

      <div style={{ position: 'relative' }}>
        <PixelButton
          onClick={onSkip}
          variant="secondary"
          size="small"
          className="skip-button"
        >
          Skip
        </PixelButton>
      </div>

      {gameState === 'ready' && (
        <>
          <div style={playAreaStyle}>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>{miniGame.icon}</p>
              <p>Catch the {miniGame.icon} items!</p>
              <p>Avoid the bombs! 💣</p>
            </div>
          </div>
          <p style={instructionsStyle}>
            Use Arrow Keys to move left and right
          </p>
          <PixelButton onClick={startGame} variant="gold" glow>
            Start
          </PixelButton>
        </>
      )}

      {gameState === 'playing' && (
        <>
          <div style={statsStyle}>
            <div>
              <span style={{ color: '#aaa' }}>Time: </span>
              <span style={{ fontWeight: 'bold' }}>{timeRemaining}</span>
            </div>
            <div>
              <span style={{ color: '#aaa' }}>Score: </span>
              <span style={{ fontWeight: 'bold' }}>{score}</span>
            </div>
          </div>
          <div style={playAreaStyle}>
            {items.map(item => (
              <div
                key={item.id}
                data-testid="falling-item"
                style={itemStyle(item)}
              >
                {item.icon}
              </div>
            ))}
            <div data-testid="catcher" style={catcherStyle}>
              🧺
            </div>
          </div>
        </>
      )}

      {gameState === 'finished' && (
        <div style={playAreaStyle}>
          <div style={gameOverStyle}>
            <h3>Game Over!</h3>
            <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
              Score: {score} / {MAX_SCORE}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
