import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizModal } from '../../components/game/QuizModal'
import type { CountryQuiz } from '../../types'

const mockQuiz: CountryQuiz = {
  id: 'quiz-france',
  countryId: 'france',
  name: 'France',
  questions: [
    {
      id: 'q1',
      questionText: 'What is the capital of France?',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctAnswer: 'Paris',
      funFact: 'Paris is known as the City of Light!',
    },
    {
      id: 'q2',
      questionText: 'What is the famous tower in Paris?',
      options: ['Big Ben', 'Eiffel Tower', 'Leaning Tower', 'CN Tower'],
      correctAnswer: 'Eiffel Tower',
      funFact: 'The Eiffel Tower was built in 1889!',
    },
    {
      id: 'q3',
      questionText: 'What is a famous French food?',
      options: ['Sushi', 'Pizza', 'Croissant', 'Tacos'],
      correctAnswer: 'Croissant',
      funFact: 'Croissants are made with buttery, flaky dough!',
    },
  ],
}

describe('QuizModal', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  const defaultProps = {
    quiz: mockQuiz,
    onComplete: mockOnComplete,
    onSkip: mockOnSkip,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders quiz title', () => {
      render(<QuizModal {...defaultProps} />)
      expect(screen.getByText(/Quiz: France/)).toBeInTheDocument()
    })

    it('renders question count showing current question', () => {
      render(<QuizModal {...defaultProps} />)
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
    })

    it('shows first question initially', () => {
      render(<QuizModal {...defaultProps} />)
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    })

    it('renders modal overlay with testid', () => {
      render(<QuizModal {...defaultProps} />)
      expect(screen.getByTestId('quiz-modal-overlay')).toBeInTheDocument()
    })
  })

  describe('answer selection and feedback flow', () => {
    it('transitions to feedback phase after answer selection', () => {
      render(<QuizModal {...defaultProps} />)

      // Select an answer
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))

      // Should show fun fact (indicating feedback phase)
      expect(screen.getByTestId('fun-fact')).toBeInTheDocument()
    })

    it('shows funFact in feedback phase', () => {
      render(<QuizModal {...defaultProps} />)

      // Select an answer
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))

      expect(screen.getByText(/Paris is known as the City of Light!/)).toBeInTheDocument()
    })

    it('shows Next button in feedback phase', () => {
      render(<QuizModal {...defaultProps} />)

      // Select an answer
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))

      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
    })
  })

  describe('question progression', () => {
    it('Next button advances to next question', () => {
      render(<QuizModal {...defaultProps} />)

      // Answer first question
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))

      // Click Next
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Should show question 2
      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument()
      expect(screen.getByText('What is the famous tower in Paris?')).toBeInTheDocument()
    })

    it('progresses through all 3 questions', () => {
      render(<QuizModal {...defaultProps} />)

      // Question 1
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Question 2
      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Eiffel Tower/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Question 3
      expect(screen.getByText('Question 3 of 3')).toBeInTheDocument()
      expect(screen.getByText('What is a famous French food?')).toBeInTheDocument()
    })
  })

  describe('results phase', () => {
    const completeQuiz = (correctAnswers: string[]) => {
      render(<QuizModal {...defaultProps} />)

      // Answer all 3 questions
      correctAnswers.forEach((answer, index) => {
        fireEvent.click(screen.getByRole('button', { name: new RegExp(answer) }))
        if (index < 2) {
          fireEvent.click(screen.getByRole('button', { name: /Next/i }))
        } else {
          // Last question - click Next to go to results
          fireEvent.click(screen.getByRole('button', { name: /Next/i }))
        }
      })
    }

    it('shows result after 3 questions answered', () => {
      completeQuiz(['Paris', 'Eiffel Tower', 'Croissant'])

      expect(screen.getByTestId('quiz-result')).toBeInTheDocument()
    })

    it('calculates correct count correctly for all correct answers', () => {
      completeQuiz(['Paris', 'Eiffel Tower', 'Croissant'])

      // 3/3 correct should show "Quiz Master!"
      expect(screen.getByText(/Quiz Master/)).toBeInTheDocument()
      expect(screen.getByText(/3\/3 correct/)).toBeInTheDocument()
    })

    it('calculates correct count correctly for some wrong answers', () => {
      completeQuiz(['Paris', 'Big Ben', 'Pizza']) // 1 correct

      expect(screen.getByText(/Good Try/)).toBeInTheDocument()
      expect(screen.getByText(/1\/3 correct/)).toBeInTheDocument()
    })

    it('calculates correct count correctly for zero correct answers', () => {
      completeQuiz(['London', 'Big Ben', 'Pizza']) // 0 correct

      expect(screen.getByText(/Keep Learning/)).toBeInTheDocument()
      expect(screen.getByText(/0\/3 correct/)).toBeInTheDocument()
    })

    it('shows correct reward for 3/3 correct', () => {
      completeQuiz(['Paris', 'Eiffel Tower', 'Croissant'])

      expect(screen.getByText(/\+\$30 earned/)).toBeInTheDocument()
    })

    it('shows correct reward for 2/3 correct', () => {
      completeQuiz(['Paris', 'Eiffel Tower', 'Pizza']) // 2 correct

      expect(screen.getByText(/\+\$20 earned/)).toBeInTheDocument()
    })

    it('Continue button calls onComplete with correct count', () => {
      completeQuiz(['Paris', 'Eiffel Tower', 'Croissant'])

      fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
      expect(mockOnComplete).toHaveBeenCalledWith(3)
    })

    it('Continue button calls onComplete with correct count for partial score', () => {
      completeQuiz(['Paris', 'Big Ben', 'Croissant']) // 2 correct

      fireEvent.click(screen.getByRole('button', { name: /Continue/i }))

      expect(mockOnComplete).toHaveBeenCalledWith(2)
    })
  })

  describe('skip functionality', () => {
    it('renders Skip Quiz button in playing phase', () => {
      render(<QuizModal {...defaultProps} />)
      expect(screen.getByRole('button', { name: /Skip Quiz/i })).toBeInTheDocument()
    })

    it('renders Skip Quiz button in feedback phase', () => {
      render(<QuizModal {...defaultProps} />)

      // Select an answer to enter feedback phase
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))

      expect(screen.getByRole('button', { name: /Skip Quiz/i })).toBeInTheDocument()
    })

    it('Skip Quiz button calls onSkip', () => {
      render(<QuizModal {...defaultProps} />)

      fireEvent.click(screen.getByRole('button', { name: /Skip Quiz/i }))

      expect(mockOnSkip).toHaveBeenCalledTimes(1)
    })

    it('does not render Skip Quiz button in results phase', () => {
      render(<QuizModal {...defaultProps} />)

      // Complete all questions
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByRole('button', { name: /Eiffel Tower/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))
      fireEvent.click(screen.getByRole('button', { name: /Croissant/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      expect(screen.queryByRole('button', { name: /Skip Quiz/i })).not.toBeInTheDocument()
    })
  })

  describe('state management', () => {
    it('tracks selected answers correctly across questions', () => {
      render(<QuizModal {...defaultProps} />)

      // Select correct answer for Q1
      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Select wrong answer for Q2
      fireEvent.click(screen.getByRole('button', { name: /Big Ben/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Select correct answer for Q3
      fireEvent.click(screen.getByRole('button', { name: /Croissant/ }))
      fireEvent.click(screen.getByRole('button', { name: /Next/i }))

      // Should have 2/3 correct
      expect(screen.getByText(/2\/3 correct/)).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('applies modal overlay styling', () => {
      render(<QuizModal {...defaultProps} />)

      const overlay = screen.getByTestId('quiz-modal-overlay')
      expect(overlay).toHaveStyle({ position: 'fixed' })
    })

    it('renders modal container with proper styling', () => {
      render(<QuizModal {...defaultProps} />)

      const container = screen.getByTestId('quiz-modal-container')
      expect(container).toBeInTheDocument()
    })
  })
})
