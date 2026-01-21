import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TurnResultDisplay } from '../../components/game/TurnResultDisplay'
import type { TurnResult } from '../../logic/turn'

const mockTurnResult: TurnResult = {
  diceRoll: 7,
  movement: 10,
  resourceChanges: {
    food: -5,
    fuel: -5,
    water: -8,
    money: -40,
  },
  newResources: {
    food: 45,
    fuel: 95,
    water: 42,
    money: 160,
  },
  newCountryIndex: 1,
  newProgress: 0,
  arrivedAtCountry: true,
  gameStatus: 'playing',
  newTurnCount: 2,
  eventTriggered: false,
}

describe('TurnResultDisplay', () => {
  describe('rendering', () => {
    it('renders the turn result container', () => {
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={vi.fn()} />)
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('displays the dice roll', () => {
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={vi.fn()} />)
      expect(screen.getByText(/rolled 7/i)).toBeInTheDocument()
    })

    it('displays the movement distance', () => {
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={vi.fn()} />)
      expect(screen.getByText(/moved 10/i)).toBeInTheDocument()
    })

    it('displays resource changes', () => {
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={vi.fn()} />)
      expect(screen.getByTestId('resource-change-food')).toHaveTextContent('-5')
      expect(screen.getByTestId('resource-change-fuel')).toHaveTextContent('-5')
      expect(screen.getByTestId('resource-change-water')).toHaveTextContent('-8')
      expect(screen.getByTestId('resource-change-money')).toHaveTextContent('-40')
    })

    it('displays positive changes with + prefix', () => {
      const positiveResult: TurnResult = {
        ...mockTurnResult,
        resourceChanges: { food: 5, fuel: 0, water: 10, money: 50 },
      }
      render(<TurnResultDisplay result={positiveResult} onDismiss={vi.fn()} />)
      expect(screen.getByTestId('resource-change-food')).toHaveTextContent('+5')
      expect(screen.getByTestId('resource-change-water')).toHaveTextContent('+10')
    })

    it('renders dismiss button', () => {
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={vi.fn()} />)
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })
  })

  describe('station arrival', () => {
    it('shows arrival message when arrived at new country', () => {
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={vi.fn()} />)
      expect(screen.getByText(/arrived/i)).toBeInTheDocument()
    })

    it('does not show arrival message when not arrived', () => {
      const noArrival: TurnResult = {
        ...mockTurnResult,
        arrivedAtCountry: false,
      }
      render(<TurnResultDisplay result={noArrival} onDismiss={vi.fn()} />)
      expect(screen.queryByText(/arrived/i)).not.toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('calls onDismiss when continue button clicked', () => {
      const onDismiss = vi.fn()
      render(<TurnResultDisplay result={mockTurnResult} onDismiss={onDismiss} />)

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      expect(onDismiss).toHaveBeenCalledTimes(1)
    })
  })
})
