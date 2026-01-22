import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizResult } from '../../components/game/QuizResult'
import type { QuizResult as QuizResultType } from '../../types'

describe('QuizResult', () => {
  const mockOnContinue = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createQuizResult = (
    score: number,
    rating: string
  ): QuizResultType => ({
    score,
    totalQuestions: 3,
    reward: score === 3 ? 30 : score === 2 ? 20 : score === 1 ? 10 : 5,
    rating,
  })

  describe('rating display', () => {
    it('renders Quiz Master rating correctly', () => {
      const result = createQuizResult(3, '🌟 Quiz Master!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('🌟 Quiz Master!')).toBeInTheDocument()
    })

    it('renders Great Job rating correctly', () => {
      const result = createQuizResult(2, '⭐ Great Job!')

      render(
        <QuizResult
          result={result}
          countryName="Germany"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('⭐ Great Job!')).toBeInTheDocument()
    })

    it('renders Good Try rating correctly', () => {
      const result = createQuizResult(1, '👍 Good Try!')

      render(
        <QuizResult
          result={result}
          countryName="Italy"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('👍 Good Try!')).toBeInTheDocument()
    })

    it('renders Keep Learning rating correctly', () => {
      const result = createQuizResult(0, '📚 Keep Learning!')

      render(
        <QuizResult
          result={result}
          countryName="Spain"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('📚 Keep Learning!')).toBeInTheDocument()
    })
  })

  describe('score display', () => {
    it('renders score as X/3 correct format', () => {
      const result = createQuizResult(2, '⭐ Great Job!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('2/3 correct')).toBeInTheDocument()
    })

    it('renders 0/3 score correctly', () => {
      const result = createQuizResult(0, '📚 Keep Learning!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('0/3 correct')).toBeInTheDocument()
    })

    it('renders 3/3 score correctly', () => {
      const result = createQuizResult(3, '🌟 Quiz Master!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('3/3 correct')).toBeInTheDocument()
    })
  })

  describe('reward display', () => {
    it('renders reward amount with +$ format', () => {
      const result = createQuizResult(3, '🌟 Quiz Master!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('+$30 earned')).toBeInTheDocument()
    })

    it('renders participation reward correctly', () => {
      const result = createQuizResult(0, '📚 Keep Learning!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText('+$5 earned')).toBeInTheDocument()
    })
  })

  describe('country name display', () => {
    it('renders the country name', () => {
      const result = createQuizResult(2, '⭐ Great Job!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText(/France/)).toBeInTheDocument()
    })

    it('renders different country names', () => {
      const result = createQuizResult(1, '👍 Good Try!')

      render(
        <QuizResult
          result={result}
          countryName="Japan"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByText(/Japan/)).toBeInTheDocument()
    })
  })

  describe('continue button', () => {
    it('renders continue button', () => {
      const result = createQuizResult(2, '⭐ Great Job!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(
        screen.getByRole('button', { name: /continue/i })
      ).toBeInTheDocument()
    })

    it('calls onContinue when continue button is clicked', () => {
      const result = createQuizResult(2, '⭐ Great Job!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      const continueButton = screen.getByRole('button', { name: /continue/i })
      fireEvent.click(continueButton)

      expect(mockOnContinue).toHaveBeenCalledTimes(1)
    })
  })

  describe('styling', () => {
    it('renders with quiz-result test id', () => {
      const result = createQuizResult(2, '⭐ Great Job!')

      render(
        <QuizResult
          result={result}
          countryName="France"
          onContinue={mockOnContinue}
        />
      )

      expect(screen.getByTestId('quiz-result')).toBeInTheDocument()
    })
  })
})
