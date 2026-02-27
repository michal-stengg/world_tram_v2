import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  const stars = '\u2B50'.repeat(rating.stars)

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
        maxWidth: '1100px',
        margin: '0 auto',
        background: 'radial-gradient(ellipse at 50% 30%, #1e2a4a 0%, var(--color-bg-dark, #1a1a2e) 70%)',
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
        <motion.div
          style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}
          aria-hidden="true"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          🏆
        </motion.div>

        {/* Victory title */}
        <motion.h1
          style={{
            fontSize: 'var(--font-size-title, 4rem)',
            fontWeight: 'bold',
            color: 'var(--color-gold, #F7B538)',
            margin: '0 0 1rem 0',
            textShadow: '3px 3px 0px rgba(196, 132, 29, 0.5), 0 0 30px rgba(247, 181, 56, 0.3)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          VICTORY!
        </motion.h1>

        {/* Star rating */}
        <motion.div
          style={{
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {stars}
        </motion.div>

        {/* Rating title */}
        <motion.div
          style={{
            fontSize: '1.25rem',
            color: 'var(--color-gold, #F7B538)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {rating.title}
        </motion.div>

        {/* Turn count message */}
        <motion.p
          style={{
            fontSize: '1rem',
            color: '#ffffff',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.8',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          You completed the journey
          <br />
          in <strong style={{ color: 'var(--color-gold, #F7B538)' }}>{turnCount}</strong> turns!
        </motion.p>

        {/* Statistics panel */}
        <motion.div
          style={{
            backgroundColor: 'var(--color-bg-card, rgba(22, 33, 62, 0.8))',
            border: 'var(--border-card, 2px solid rgba(255, 255, 255, 0.1))',
            borderRadius: 'var(--radius-lg, 12px)',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            width: '100%',
            maxWidth: '400px',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {/* Captain & Train */}
          <div
            style={{
              fontSize: '0.85rem',
              color: '#ffffff',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: 'var(--border-divider, 1px solid rgba(255, 255, 255, 0.08))',
              lineHeight: 1.8,
            }}
          >
            <div>Captain: <strong style={{ color: 'var(--color-gold, #F7B538)' }}>{selectedCaptain?.name}</strong></div>
            <div>Train: <strong style={{ color: 'var(--color-gold, #F7B538)' }}>{selectedTrain?.name}</strong></div>
          </div>

          {/* Final Resources */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '0.5rem',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: 'var(--border-divider, 1px solid rgba(255, 255, 255, 0.08))',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>🍞</div>
              <div style={{ color: '#ffffff', fontSize: '0.85rem' }}>{resources.food}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>⛽</div>
              <div style={{ color: '#ffffff', fontSize: '0.85rem' }}>{resources.fuel}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>💧</div>
              <div style={{ color: '#ffffff', fontSize: '0.85rem' }}>{resources.water}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>💰</div>
              <div style={{ color: '#ffffff', fontSize: '0.85rem' }}>{resources.money}</div>
            </div>
          </div>

          {/* Crew Summary */}
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary, #a0b4c8)',
              marginBottom: '0.5rem',
            }}
          >
            Crew: {formatCrewSummary()}
          </div>

          {/* Carts */}
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-secondary, #a0b4c8)',
            }}
          >
            {ownedCarts.length} Carts Acquired
          </div>
        </motion.div>

        {/* Encouraging message */}
        <motion.p
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary, #a0b4c8)',
            margin: '0 0 2rem 0',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Congratulations, Captain!
        </motion.p>

        {/* New Game button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <PixelButton
            variant="gold"
            size="large"
            glow
            onClick={handleNewGame}
          >
            NEW GAME
          </PixelButton>
        </motion.div>
      </div>

      {/* Right panel - leaderboard section */}
      <motion.div
        style={{ flex: 1 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: 'var(--color-gold, #F7B538)',
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
      </motion.div>
    </div>
  )
}
