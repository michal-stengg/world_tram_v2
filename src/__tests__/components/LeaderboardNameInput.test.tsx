import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LeaderboardNameInput } from '../../components/game/LeaderboardNameInput'

describe('LeaderboardNameInput', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onSkip: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders input field with placeholder "Enter your name"', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name')
      expect(input).toBeInTheDocument()
    })

    it('renders SUBMIT button', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    it('renders SKIP button', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('shows character count as "0/20" initially', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      expect(screen.getByText('0/20')).toBeInTheDocument()
    })
  })

  describe('input behavior', () => {
    it('updates character count when typing', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name')
      fireEvent.change(input, { target: { value: 'Hello' } })

      expect(screen.getByText('5/20')).toBeInTheDocument()
    })

    it('limits input to 20 characters', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name') as HTMLInputElement
      const longName = 'This is a very long name that exceeds twenty characters'
      fireEvent.change(input, { target: { value: longName } })

      expect(input.value.length).toBeLessThanOrEqual(20)
      expect(screen.getByText('20/20')).toBeInTheDocument()
    })
  })

  describe('submit functionality', () => {
    it('calls onSubmit with entered name when SUBMIT clicked', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name')
      fireEvent.change(input, { target: { value: 'Player1' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      expect(defaultProps.onSubmit).toHaveBeenCalledWith('Player1')
    })

    it('SUBMIT button is disabled when input is empty', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeDisabled()
    })

    it('SUBMIT button is disabled when input contains only whitespace', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name')
      fireEvent.change(input, { target: { value: '   ' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).toBeDisabled()
    })

    it('SUBMIT button is enabled when input has valid text', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name')
      fireEvent.change(input, { target: { value: 'Player1' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      expect(submitButton).not.toBeDisabled()
    })

    it('trims whitespace from name on submit', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const input = screen.getByPlaceholderText('Enter your name')
      fireEvent.change(input, { target: { value: '  Player1  ' } })

      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)

      expect(defaultProps.onSubmit).toHaveBeenCalledWith('Player1')
    })
  })

  describe('skip functionality', () => {
    it('calls onSkip when SKIP clicked', () => {
      render(<LeaderboardNameInput {...defaultProps} />)

      const skipButton = screen.getByRole('button', { name: /skip/i })
      fireEvent.click(skipButton)

      expect(defaultProps.onSkip).toHaveBeenCalled()
    })
  })
})
