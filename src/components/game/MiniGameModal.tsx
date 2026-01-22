import { useState } from 'react'
import { PixelButton } from '../common/PixelButton'
import { CatcherGame } from '../minigames/CatcherGame'
import { TimingGame } from '../minigames/TimingGame'
import { MemoryGame } from '../minigames/MemoryGame'
import { calculateMiniGameReward } from '../../logic/minigames'
import type { MiniGame } from '../../types'

interface MiniGameModalProps {
  miniGame: MiniGame
  onComplete: (score: number, maxScore: number) => void
  onSkip: () => void
}

type ModalState = 'playing' | 'results'

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const containerStyle: React.CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.95)',
  border: '4px solid var(--color-gold, #F7B538)',
  borderRadius: '8px',
  padding: '1.5rem',
  minWidth: '350px',
  maxWidth: '450px',
  textAlign: 'center',
}

const resultsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
}

const headerStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#F7B538',
  marginBottom: '1rem',
}

const scoreStyle: React.CSSProperties = {
  fontSize: '1.25rem',
}

const rewardStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  color: '#4CAF50',
}

export function MiniGameModal({ miniGame, onComplete, onSkip }: MiniGameModalProps) {
  const [modalState, setModalState] = useState<ModalState>('playing')
  const [finalScore, setFinalScore] = useState(0)
  const [finalMaxScore, setFinalMaxScore] = useState(0)

  const handleGameComplete = (score: number, maxScore: number) => {
    setFinalScore(score)
    setFinalMaxScore(maxScore)
    setModalState('results')
  }

  const handleCollectReward = () => {
    onComplete(finalScore, finalMaxScore)
  }

  const renderGame = () => {
    switch (miniGame.type) {
      case 'catcher':
        return <CatcherGame miniGame={miniGame} onComplete={handleGameComplete} onSkip={onSkip} />
      case 'timing':
        return <TimingGame miniGame={miniGame} onComplete={handleGameComplete} onSkip={onSkip} />
      case 'memory':
        return <MemoryGame miniGame={miniGame} onComplete={handleGameComplete} onSkip={onSkip} />
    }
  }

  const reward = calculateMiniGameReward(finalScore, finalMaxScore, miniGame.maxReward)
  const rewardTypeLabel = miniGame.rewardType === 'food' ? 'food' : 'money'
  const rewardIcon = miniGame.rewardType === 'food' ? '🍖' : '💰'

  return (
    <div style={overlayStyle} data-testid="minigame-modal-overlay">
      <div style={containerStyle}>
        {modalState === 'playing' && renderGame()}

        {modalState === 'results' && (
          <div style={resultsStyle}>
            <div style={headerStyle}>Game Complete!</div>
            <div style={scoreStyle}>
              Score: {finalScore}/{finalMaxScore}
            </div>
            <div style={rewardStyle}>
              Reward: +{reward} {rewardIcon} {rewardTypeLabel}
            </div>
            <PixelButton onClick={handleCollectReward} variant="gold" glow>
              Collect Reward
            </PixelButton>
          </div>
        )}
      </div>
    </div>
  )
}
