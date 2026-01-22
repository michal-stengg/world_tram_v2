import { PixelButton } from '../common/PixelButton'
import type { QuizResult as QuizResultType } from '../../types'

interface QuizResultProps {
  result: QuizResultType
  countryName: string
  onContinue: () => void
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#1a1a2e',
  padding: '2rem',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  minWidth: '300px',
  textAlign: 'center',
}

const ratingStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#E8E8E8',
}

const countryStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#E8E8E8',
  opacity: 0.8,
}

const scoreStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  color: '#E8E8E8',
}

const rewardStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#D4AF37',
}

export function QuizResult({ result, countryName, onContinue }: QuizResultProps) {
  return (
    <div style={containerStyle} data-testid="quiz-result">
      <div style={ratingStyle}>{result.rating}</div>
      <div style={countryStyle}>{countryName} Quiz</div>
      <div style={scoreStyle}>
        {result.score}/{result.totalQuestions} correct
      </div>
      <div style={rewardStyle}>+${result.reward} earned</div>
      <PixelButton onClick={onContinue} variant="gold" glow>
        Continue
      </PixelButton>
    </div>
  )
}
