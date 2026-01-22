import { useState, useEffect, useCallback, useRef } from 'react'
import { PixelButton } from '../common/PixelButton'
import type { MiniGame } from '../../types'

interface TimingGameProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type GameState = 'ready' | 'playing' | 'roundResult' | 'finished'

const TOTAL_ROUNDS = 5
const MAX_SCORE = 15 // 5 rounds * 3 max points per round
const TICK_INTERVAL = 20 // ms
const POSITION_CHANGE_PER_TICK = 1.3 // percentage
const RESULT_DISPLAY_DURATION = 1000 // ms

type RoundResult = 'Perfect' | 'Good' | 'OK' | 'Miss'

function calculateScore(position: number): { points: number; result: RoundResult } {
  // Position is 0-100, center is 50
  const distanceFromCenter = Math.abs(position - 50)

  if (distanceFromCenter <= 2) {
    return { points: 3, result: 'Perfect' }
  } else if (distanceFromCenter <= 10) {
    return { points: 2, result: 'Good' }
  } else if (distanceFromCenter <= 20) {
    return { points: 1, result: 'OK' }
  } else {
    return { points: 0, result: 'Miss' }
  }
}

export function TimingGame({ miniGame, onComplete, onSkip }: TimingGameProps) {
  const [gameState, setGameState] = useState<GameState>('ready')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const [direction, setDirection] = useState<'right' | 'left'>('right')
  const [lastResult, setLastResult] = useState<{ points: number; result: RoundResult } | null>(null)

  const indicatorIntervalRef = useRef<number | null>(null)
  const resultTimeoutRef = useRef<number | null>(null)

  const startGame = useCallback(() => {
    setGameState('playing')
    setRound(1)
    setScore(0)
    setIndicatorPosition(0)
    setDirection('right')
    setLastResult(null)
  }, [])

  const handleStop = useCallback(() => {
    if (gameState !== 'playing') return

    // Calculate score based on position
    const result = calculateScore(indicatorPosition)
    setLastResult(result)
    setScore(prev => prev + result.points)
    setGameState('roundResult')
  }, [gameState, indicatorPosition])

  // Indicator movement
  useEffect(() => {
    if (gameState !== 'playing') return

    indicatorIntervalRef.current = window.setInterval(() => {
      setIndicatorPosition(prev => {
        let newPosition = prev
        if (direction === 'right') {
          newPosition = prev + POSITION_CHANGE_PER_TICK
          if (newPosition >= 100) {
            newPosition = 100
            setDirection('left')
          }
        } else {
          newPosition = prev - POSITION_CHANGE_PER_TICK
          if (newPosition <= 0) {
            newPosition = 0
            setDirection('right')
          }
        }
        return newPosition
      })
    }, TICK_INTERVAL)

    return () => {
      if (indicatorIntervalRef.current) {
        clearInterval(indicatorIntervalRef.current)
      }
    }
  }, [gameState, direction])

  // Handle round result display and transition
  useEffect(() => {
    if (gameState !== 'roundResult') return

    resultTimeoutRef.current = window.setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setGameState('finished')
      } else {
        setRound(prev => prev + 1)
        setIndicatorPosition(0)
        setDirection('right')
        setGameState('playing')
      }
    }, RESULT_DISPLAY_DURATION)

    return () => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current)
      }
    }
  }, [gameState, round])

  // Call onComplete when game finishes
  useEffect(() => {
    if (gameState === 'finished') {
      onComplete(score, MAX_SCORE)
    }
  }, [gameState, score, onComplete])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (indicatorIntervalRef.current) clearInterval(indicatorIntervalRef.current)
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current)
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

  const skipButtonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
  }

  const barStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    height: '40px',
    backgroundColor: '#333',
    borderRadius: '4px',
    overflow: 'hidden',
  }

  const targetZoneStyle: React.CSSProperties = {
    position: 'absolute',
    left: '30%',
    width: '40%',
    height: '100%',
    background: 'linear-gradient(to right, #4a4, #6c6, #6c6, #4a4)',
  }

  const indicatorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${indicatorPosition}%`,
    top: 0,
    width: '4px',
    height: '100%',
    backgroundColor: '#fff',
    transform: 'translateX(-50%)',
  }

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

  const resultStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
    marginTop: '1rem',
  }

  const finishedStyle: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: '2rem',
    borderRadius: '8px',
    border: '2px solid #F7B538',
  }

  const getResultColor = (result: RoundResult): string => {
    switch (result) {
      case 'Perfect':
        return '#FFD700'
      case 'Good':
        return '#4CAF50'
      case 'OK':
        return '#FFA500'
      case 'Miss':
        return '#FF5252'
    }
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2>{miniGame.name}</h2>
        <p style={{ fontSize: '2rem' }}>{miniGame.icon}</p>
        <p>{miniGame.description}</p>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={skipButtonContainerStyle}>
          <PixelButton
            onClick={onSkip}
            variant="secondary"
            size="small"
          >
            Skip
          </PixelButton>
        </div>
      </div>

      {gameState === 'ready' && (
        <>
          <div style={instructionsStyle}>
            <p>Stop the indicator in the green zone!</p>
            <p>5 rounds - aim for the center for maximum points</p>
          </div>
          <PixelButton onClick={startGame} variant="gold" glow>
            Start
          </PixelButton>
        </>
      )}

      {(gameState === 'playing' || gameState === 'roundResult') && (
        <>
          <div style={statsStyle}>
            <div>
              <span style={{ color: '#aaa' }}>Round: </span>
              <span style={{ fontWeight: 'bold' }}>Round {round}/5</span>
            </div>
            <div>
              <span style={{ color: '#aaa' }}>Score: </span>
              <span style={{ fontWeight: 'bold' }}>{score}</span>
            </div>
          </div>

          <div style={barStyle} data-testid="timing-bar">
            <div style={targetZoneStyle} data-testid="target-zone" />
            <div style={indicatorStyle} data-testid="indicator" />
          </div>

          {gameState === 'playing' && (
            <PixelButton onClick={handleStop} variant="gold" size="large" glow>
              STOP
            </PixelButton>
          )}

          {gameState === 'roundResult' && lastResult && (
            <div style={resultStyle} data-testid="round-result">
              <h3 style={{ color: getResultColor(lastResult.result), fontSize: '1.5rem' }}>
                {lastResult.result}!
              </h3>
              <p>+{lastResult.points} points</p>
            </div>
          )}
        </>
      )}

      {gameState === 'finished' && (
        <div style={finishedStyle}>
          <h3>Game Complete!</h3>
          <p style={{ fontSize: '2rem', margin: '1rem 0' }}>
            Score: {score} / {MAX_SCORE}
          </p>
        </div>
      )}
    </div>
  )
}
