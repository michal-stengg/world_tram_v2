import { useState, useEffect } from 'react'
import { PixelButton } from '../common/PixelButton'
import { useGameStore } from '../../stores/gameStore'
import { calculateRating } from '../../logic/rating'
import { Leaderboard } from '../game/Leaderboard'
import { LeaderboardNameInput } from '../game/LeaderboardNameInput'
import {
  calculateScore,
  loadLeaderboard,
  checkQualification,
  addLeaderboardEntry
} from '../../logic/leaderboard'
import type { CrewRole, LeaderboardEntry } from '../../types'

export function VictoryScreen() {
  const setScreen = useGameStore((state) => state.setScreen)
  const turnCount = useGameStore((state) => state.turnCount)
  const resources = useGameStore((state) => state.resources)
  const crew = useGameStore((state) => state.crew)
  const ownedCarts = useGameStore((state) => state.ownedCarts)
  const selectedCaptain = useGameStore((state) => state.selectedCaptain)
  const selectedTrain = useGameStore((state) => state.selectedTrain)

  const rating = calculateRating(turnCount)
  const stars = '⭐'.repeat(rating.stars)

  // Leaderboard state
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([])
  const [showNameInput, setShowNameInput] = useState(false)
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null)
  const [playerScore, setPlayerScore] = useState(0)

  // Initialize leaderboard on mount
  useEffect(() => {
    const score = calculateScore(resources)
    setPlayerScore(score)
    setLeaderboardEntries(loadLeaderboard())

    const qualification = checkQualification(score)
    if (qualification.qualifies) {
      setShowNameInput(true)
    }
  }, [resources])

  const handleSubmitName = (name: string) => {
    const entry = addLeaderboardEntry(name, playerScore)
    setCurrentEntryId(entry.id)
    setLeaderboardEntries(loadLeaderboard())
    setShowNameInput(false)
  }

  const handleSkip = () => {
    setShowNameInput(false)
  }

  // Count crew by role
  const crewCounts = crew.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1
    return acc
  }, {} as Record<CrewRole, number>)

  const formatCrewSummary = () => {
    const parts: string[] = []
    if (crewCounts.engineer) {
      parts.push(`${crewCounts.engineer} Engineer${crewCounts.engineer > 1 ? 's' : ''}`)
    }
    if (crewCounts.cook) {
      parts.push(`${crewCounts.cook} Cook${crewCounts.cook > 1 ? 's' : ''}`)
    }
    if (crewCounts.security) {
      parts.push(`${crewCounts.security} Security`)
    }
    if (crewCounts.free) {
      parts.push(`${crewCounts.free} Free`)
    }
    return parts.length > 0 ? parts.join(', ') : 'No crew'
  }

  const handleNewGame = () => {
    setScreen('captainSelect')
  }

  return (
    <div
      data-testid="victory-screen"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        gap: '2rem',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      {/* Left panel - existing content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            margin: '0 0 1rem 0',
            textShadow: '0 0 20px rgba(247, 181, 56, 0.5)',
          }}
        >
          VICTORY!
        </h1>

        {/* Star rating */}
        <div
          style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
          }}
        >
          {stars}
        </div>

        {/* Rating title */}
        <div
          style={{
            fontSize: '1.5rem',
            color: '#F7B538',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
        >
          {rating.title}
        </div>

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
            margin: '0 0 1.5rem 0',
            lineHeight: '1.6',
          }}
        >
          You completed the journey
          <br />
          in <strong style={{ color: '#F7B538' }}>{turnCount}</strong> turns!
        </p>

        {/* Statistics panel */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(247, 181, 56, 0.3)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '400px',
          }}
        >
          {/* Captain & Train */}
          <div
            style={{
              fontSize: '1rem',
              color: '#ffffff',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div>Captain: <strong style={{ color: '#F7B538' }}>{selectedCaptain?.name}</strong></div>
            <div>Train: <strong style={{ color: '#F7B538' }}>{selectedTrain?.name}</strong></div>
          </div>

          {/* Final Resources */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>🍞</div>
              <div style={{ color: '#ffffff', fontSize: '1rem' }}>{resources.food}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>⛽</div>
              <div style={{ color: '#ffffff', fontSize: '1rem' }}>{resources.fuel}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>💧</div>
              <div style={{ color: '#ffffff', fontSize: '1rem' }}>{resources.water}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>💰</div>
              <div style={{ color: '#ffffff', fontSize: '1rem' }}>{resources.money}</div>
            </div>
          </div>

          {/* Crew Summary */}
          <div
            style={{
              fontSize: '0.9rem',
              color: '#a0a0a0',
              marginBottom: '0.5rem',
            }}
          >
            Crew: {formatCrewSummary()}
          </div>

          {/* Carts */}
          <div
            style={{
              fontSize: '0.9rem',
              color: '#a0a0a0',
            }}
          >
            {ownedCarts.length} Carts Acquired
          </div>
        </div>

        {/* Encouraging message */}
        <p
          style={{
            fontSize: '1.25rem',
            color: '#a0a0a0',
            margin: '0 0 2rem 0',
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

      {/* Right panel - leaderboard section */}
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#F7B538',
            margin: '0 0 1rem 0',
            textAlign: 'center',
          }}
        >
          Your Score: <span>{playerScore}</span>
        </h2>
        {showNameInput ? (
          <LeaderboardNameInput onSubmit={handleSubmitName} onSkip={handleSkip} />
        ) : null}
        <Leaderboard entries={leaderboardEntries} currentEntryId={currentEntryId || undefined} />
      </div>
    </div>
  )
}
