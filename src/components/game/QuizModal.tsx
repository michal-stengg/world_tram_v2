import { useState } from 'react'
import { QuizQuestion } from './QuizQuestion'
import { QuizResult } from './QuizResult'
import { PixelButton } from '../common/PixelButton'
import { calculateQuizReward, getQuizRating } from '../../logic/quizzes'
import type { CountryQuiz, QuizResult as QuizResultType } from '../../types'

interface QuizModalProps {
  quiz: CountryQuiz
  onComplete: (correctCount: number) => void
  onSkip: () => void
}

type QuizPhase = 'playing' | 'feedback' | 'results'

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
  backgroundColor: '#1a1a2e',
  border: '3px solid #D4AF37',
  borderRadius: '8px',
  padding: '1.5rem',
  minWidth: '350px',
  maxWidth: '500px',
  textAlign: 'center',
}

const headerStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#D4AF37',
  margin: 0,
  marginBottom: '0.5rem',
}

const progressStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#E8E8E8',
  marginBottom: '1rem',
}

const buttonContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '1rem',
}

export function QuizModal({ quiz, onComplete, onSkip }: QuizModalProps) {
  const [phase, setPhase] = useState<QuizPhase>('playing')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string>>(new Map())
  const [currentSelectedAnswer, setCurrentSelectedAnswer] = useState<string | null>(null)

  const currentQuestion = quiz.questions[currentQuestionIndex]

  const handleSelectAnswer = (answer: string) => {
    if (phase !== 'playing') return

    // Store the answer
    const newAnswers = new Map(answers)
    newAnswers.set(currentQuestion.id, answer)
    setAnswers(newAnswers)
    setCurrentSelectedAnswer(answer)

    // Transition to feedback phase
    setPhase('feedback')
  }

  const handleNext = () => {
    if (currentQuestionIndex < 2) {
      // More questions remaining
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentSelectedAnswer(null)
      setPhase('playing')
    } else {
      // All questions answered, calculate results
      setPhase('results')
    }
  }

  const calculateCorrectCount = (): number => {
    let correct = 0
    quiz.questions.forEach((question) => {
      const userAnswer = answers.get(question.id)
      if (userAnswer === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const handleContinue = () => {
    const correctCount = calculateCorrectCount()
    onComplete(correctCount)
  }

  const correctCount = calculateCorrectCount()
  const reward = calculateQuizReward(correctCount)
  const rating = getQuizRating(correctCount)

  const quizResult: QuizResultType = {
    score: correctCount,
    totalQuestions: 3,
    reward,
    rating,
  }

  return (
    <div style={overlayStyle} data-testid="quiz-modal-overlay">
      <div style={containerStyle} data-testid="quiz-modal-container">
        <h2 style={headerStyle}>Quiz: {quiz.name}</h2>

        {phase !== 'results' && (
          <p style={progressStyle}>Question {currentQuestionIndex + 1} of 3</p>
        )}

        {(phase === 'playing' || phase === 'feedback') && (
          <>
            <QuizQuestion
              question={currentQuestion}
              selectedAnswer={currentSelectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              showResult={phase === 'feedback'}
            />

            <div style={buttonContainerStyle}>
              {phase === 'feedback' && (
                <PixelButton onClick={handleNext} variant="gold">
                  Next
                </PixelButton>
              )}

              <PixelButton onClick={onSkip} variant="danger">
                Skip Quiz
              </PixelButton>
            </div>
          </>
        )}

        {phase === 'results' && (
          <QuizResult
            result={quizResult}
            countryName={quiz.name}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  )
}
