import { useState, useEffect, useCallback, useRef } from 'react'
import { PixelButton } from '../common/PixelButton'
import type { MiniGame } from '../../types'

interface MemoryGameProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type GameState = 'ready' | 'playing' | 'finished'

interface Card {
  id: number
  symbol: string
  isFlipped: boolean
  isMatched: boolean
}

const GAME_DURATION = 30 // seconds
const MAX_SCORE = 6 // 6 pairs
const FLIP_BACK_DELAY = 1000 // ms

// Symbols for Russia's Matryoshka Match
const RUSSIA_SYMBOLS = ['🪆', '🏛️', '❄️', '🎭', '🌟', '🐻']
// Generic symbols for other games
const GENERIC_SYMBOLS = ['⭐', '🌙', '🔥', '💎', '🍀', '❤️']

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function createCards(countryId: string): Card[] {
  const symbols = countryId === 'russia' ? RUSSIA_SYMBOLS : GENERIC_SYMBOLS
  const pairs = [...symbols, ...symbols] // 12 cards total
  const shuffled = shuffleArray(pairs)

  return shuffled.map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }))
}

export function MemoryGame({ miniGame, onComplete, onSkip }: MemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
  const [score, setScore] = useState(0)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [isComparing, setIsComparing] = useState(false)

  const timerIntervalRef = useRef<number | null>(null)
  const compareTimeoutRef = useRef<number | null>(null)

  const startGame = useCallback(() => {
    setGameState('playing')
    setTimeRemaining(GAME_DURATION)
    setScore(0)
    setCards(createCards(miniGame.countryId))
    setFlippedCards([])
    setIsComparing(false)
  }, [miniGame.countryId])

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (isComparing) return
      if (flippedCards.length >= 2) return

      const card = cards.find((c) => c.id === cardId)
      if (!card || card.isFlipped || card.isMatched) return

      // Flip the card
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
      )

      const newFlippedCards = [...flippedCards, cardId]
      setFlippedCards(newFlippedCards)

      // Check for match when two cards are flipped
      if (newFlippedCards.length === 2) {
        setIsComparing(true)
        const [firstId, secondId] = newFlippedCards
        const firstCard = cards.find((c) => c.id === firstId)!
        const secondCard = cards.find((c) => c.id === secondId)!

        if (firstCard.symbol === secondCard.symbol) {
          // Match found!
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          )
          setScore((prev) => prev + 1)
          setFlippedCards([])
          setIsComparing(false)
        } else {
          // No match - flip back after delay
          compareTimeoutRef.current = window.setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              )
            )
            setFlippedCards([])
            setIsComparing(false)
          }, FLIP_BACK_DELAY)
        }
      }
    },
    [cards, flippedCards, isComparing]
  )

  // Check for win condition (all pairs matched)
  useEffect(() => {
    if (gameState !== 'playing') return

    const allMatched = cards.length > 0 && cards.every((c) => c.isMatched)
    if (allMatched) {
      setGameState('finished')
    }
  }, [cards, gameState])

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return

    timerIntervalRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
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

  // Call onComplete when game finishes
  useEffect(() => {
    if (gameState === 'finished') {
      onComplete(score, MAX_SCORE)
    }
  }, [gameState, score, onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
      if (compareTimeoutRef.current) clearTimeout(compareTimeoutRef.current)
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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    maxWidth: '320px',
    margin: '0 auto',
  }

  const cardStyle = (isFlipped: boolean, isMatched: boolean): React.CSSProperties => ({
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    backgroundColor: isMatched ? '#4a4' : isFlipped ? '#666' : '#333',
    borderRadius: '8px',
    cursor: isMatched ? 'default' : 'pointer',
    border: '2px solid #555',
    minWidth: '60px',
    minHeight: '60px',
  })

  const statsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '320px',
    padding: '0.5rem 1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
  }

  const readyContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    textAlign: 'center',
  }

  const finishedStyle: React.CSSProperties = {
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
        <p style={{ fontSize: '2rem' }}>{miniGame.icon}</p>
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
        <div style={readyContainerStyle}>
          <p>{miniGame.description}</p>
          <p>Match all 6 pairs before time runs out!</p>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
            Click cards to flip them and find matching pairs.
          </p>
          <PixelButton onClick={startGame} variant="gold" glow>
            Start
          </PixelButton>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div style={statsStyle}>
            <div>
              <span style={{ color: '#aaa' }}>Time: </span>
              <span style={{ fontWeight: 'bold' }}>{timeRemaining}</span>
            </div>
            <div>
              <span style={{ color: '#aaa' }}>Pairs: </span>
              <span style={{ fontWeight: 'bold' }}>
                {score}/{MAX_SCORE}
              </span>
            </div>
          </div>
          <div style={gridStyle}>
            {cards.map((card) => (
              <div
                key={card.id}
                data-testid="memory-card"
                style={cardStyle(card.isFlipped, card.isMatched)}
                onClick={() => handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </div>
            ))}
          </div>
        </>
      )}

      {gameState === 'finished' && (
        <div style={finishedStyle}>
          <h3>{score === MAX_SCORE ? 'All Pairs Found!' : "Time's Up!"}</h3>
          <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
            Score: {score} / {MAX_SCORE}
          </p>
        </div>
      )}
    </div>
  )
}
