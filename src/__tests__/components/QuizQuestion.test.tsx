import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizQuestion } from '../../components/game/QuizQuestion'
import type { QuizQuestion as QuizQuestionType } from '../../types'

const mockQuestion: QuizQuestionType = {
  id: 'q1',
  questionText: 'What is the capital of France?',
  options: ['London', 'Paris', 'Berlin', 'Madrid'],
  correctAnswer: 'Paris',
  funFact: 'Paris is also known as the City of Light!',
}

describe('QuizQuestion', () => {
  const defaultProps = {
    question: mockQuestion,
    selectedAnswer: null,
    onSelectAnswer: vi.fn(),
    showResult: false,
  }

  describe('rendering', () => {
    it('renders question text', () => {
      render(<QuizQuestion {...defaultProps} />)
      expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
    })

    it('renders all 4 answer options', () => {
      render(<QuizQuestion {...defaultProps} />)

      expect(screen.getByRole('button', { name: /London/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Paris/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Berlin/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Madrid/ })).toBeInTheDocument()
    })

    it('renders options as buttons in a grid', () => {
      render(<QuizQuestion {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(4)
    })
  })

  describe('selection', () => {
    it('calls onSelectAnswer when option is clicked', () => {
      const onSelectAnswer = vi.fn()
      render(<QuizQuestion {...defaultProps} onSelectAnswer={onSelectAnswer} />)

      fireEvent.click(screen.getByRole('button', { name: /Paris/ }))

      expect(onSelectAnswer).toHaveBeenCalledWith('Paris')
    })

    it('highlights selected option with gold border', () => {
      render(<QuizQuestion {...defaultProps} selectedAnswer="Paris" />)

      const parisButton = screen.getByRole('button', { name: /Paris/ })
      expect(parisButton).toHaveAttribute('data-selected', 'true')
    })

    it('does not highlight unselected options', () => {
      render(<QuizQuestion {...defaultProps} selectedAnswer="Paris" />)

      const londonButton = screen.getByRole('button', { name: /London/ })
      expect(londonButton).not.toHaveAttribute('data-selected', 'true')
    })

    it('does not call onSelectAnswer when showResult is true', () => {
      const onSelectAnswer = vi.fn()
      render(
        <QuizQuestion
          {...defaultProps}
          onSelectAnswer={onSelectAnswer}
          showResult={true}
          selectedAnswer="Paris"
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /London/ }))

      expect(onSelectAnswer).not.toHaveBeenCalled()
    })
  })

  describe('result display', () => {
    it('shows correct answer with correct styling when showResult is true', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          showResult={true}
          selectedAnswer="Paris"
        />
      )

      const parisButton = screen.getByRole('button', { name: /Paris/ })
      expect(parisButton).toHaveAttribute('data-correct', 'true')
    })

    it('shows incorrect answer with wrong styling when showResult is true and wrong answer selected', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          showResult={true}
          selectedAnswer="London"
        />
      )

      const londonButton = screen.getByRole('button', { name: /London/ })
      expect(londonButton).toHaveAttribute('data-wrong', 'true')

      // Also shows correct answer
      const parisButton = screen.getByRole('button', { name: /Paris/ })
      expect(parisButton).toHaveAttribute('data-correct', 'true')
    })

    it('shows funFact when showResult is true', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          showResult={true}
          selectedAnswer="Paris"
        />
      )

      expect(screen.getByText(/Paris is also known as the City of Light!/)).toBeInTheDocument()
    })

    it('does not show funFact when showResult is false', () => {
      render(<QuizQuestion {...defaultProps} showResult={false} />)

      expect(screen.queryByText(/Paris is also known as the City of Light!/)).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('renders options as buttons with accessible labels', () => {
      render(<QuizQuestion {...defaultProps} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('disables buttons when showResult is true', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          showResult={true}
          selectedAnswer="Paris"
        />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })
  })

  describe('styling', () => {
    it('applies pixel art theme styling', () => {
      const { container } = render(<QuizQuestion {...defaultProps} />)

      expect(container.querySelector('[data-testid="quiz-question"]')).toBeInTheDocument()
    })

    it('renders question text as header', () => {
      render(<QuizQuestion {...defaultProps} />)

      const questionHeader = screen.getByRole('heading')
      expect(questionHeader).toHaveTextContent('What is the capital of France?')
    })

    it('renders funFact with proper styling when shown', () => {
      render(
        <QuizQuestion
          {...defaultProps}
          showResult={true}
          selectedAnswer="Paris"
        />
      )

      const funFact = screen.getByTestId('fun-fact')
      expect(funFact).toBeInTheDocument()
    })
  })
})
