import type { QuizQuestion as QuizQuestionType } from '../../types'

interface QuizQuestionProps {
  question: QuizQuestionType
  selectedAnswer: string | null
  onSelectAnswer: (answer: string) => void
  showResult: boolean
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#1a1a2e',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
}

const questionStyle: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#E8E8E8',
  textAlign: 'center',
  margin: 0,
}

const optionsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0.75rem',
}

const getOptionStyle = (
  isSelected: boolean,
  showResult: boolean,
  isCorrect: boolean,
  isWrongSelection: boolean
): React.CSSProperties => {
  let borderColor = '#444'
  let backgroundColor = 'transparent'

  if (showResult) {
    if (isCorrect) {
      borderColor = '#4CAF50'
      backgroundColor = 'rgba(76, 175, 80, 0.2)'
    } else if (isWrongSelection) {
      borderColor = '#f44336'
      backgroundColor = 'rgba(244, 67, 54, 0.2)'
    }
  } else if (isSelected) {
    borderColor = '#D4AF37'
  }

  return {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    color: '#E8E8E8',
    backgroundColor,
    border: `3px solid ${borderColor}`,
    borderRadius: '4px',
    cursor: showResult ? 'default' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  }
}

const funFactStyle: React.CSSProperties = {
  fontStyle: 'italic',
  fontSize: '0.9rem',
  color: '#D4AF37',
  textAlign: 'center',
  padding: '0.75rem',
  borderTop: '1px solid #444',
  marginTop: '0.5rem',
}

export function QuizQuestion({
  question,
  selectedAnswer,
  onSelectAnswer,
  showResult,
}: QuizQuestionProps) {
  const handleOptionClick = (option: string) => {
    if (!showResult) {
      onSelectAnswer(option)
    }
  }

  return (
    <div style={containerStyle} data-testid="quiz-question">
      <h2 style={questionStyle}>{question.questionText}</h2>

      <div style={optionsGridStyle}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option
          const isCorrect = option === question.correctAnswer
          const isWrongSelection = showResult && isSelected && !isCorrect

          return (
            <button
              key={option}
              style={getOptionStyle(isSelected, showResult, isCorrect && showResult, isWrongSelection)}
              onClick={() => handleOptionClick(option)}
              disabled={showResult}
              aria-label={option}
              data-selected={isSelected && !showResult ? 'true' : undefined}
              data-correct={showResult && isCorrect ? 'true' : undefined}
              data-wrong={isWrongSelection ? 'true' : undefined}
            >
              {option}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div style={funFactStyle} data-testid="fun-fact">
          {question.funFact}
        </div>
      )}
    </div>
  )
}
