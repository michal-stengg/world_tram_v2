import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { ResourceBar } from '../../components/game/ResourceBar'
import { useGameStore } from '../../stores/gameStore'
import { STARTING_RESOURCES, MAX_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'

describe('ResourceBar', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        resources: { ...STARTING_RESOURCES },
        crew: [...startingCrew],
        turnCount: 1,
      })
    })
  })

  describe('rendering', () => {
    it('renders the resource bar container', () => {
      render(<ResourceBar />)
      expect(screen.getByTestId('resource-bar')).toBeInTheDocument()
    })

    it('renders all 4 resource meters', () => {
      render(<ResourceBar />)
      expect(screen.getByTestId('resource-meter-food')).toBeInTheDocument()
      expect(screen.getByTestId('resource-meter-fuel')).toBeInTheDocument()
      expect(screen.getByTestId('resource-meter-water')).toBeInTheDocument()
      expect(screen.getByTestId('resource-meter-money')).toBeInTheDocument()
    })

    it('renders the turn counter', () => {
      render(<ResourceBar />)
      expect(screen.getByTestId('turn-counter')).toBeInTheDocument()
    })

    it('displays current turn number', () => {
      render(<ResourceBar />)
      expect(screen.getByTestId('turn-number')).toHaveTextContent('1')
    })
  })

  describe('resource values', () => {
    it('shows food starting value', () => {
      render(<ResourceBar />)
      const foodMeter = screen.getByTestId('resource-meter-food')
      expect(foodMeter).toHaveTextContent(`${STARTING_RESOURCES.food}/${MAX_RESOURCES.food}`)
    })

    it('shows fuel starting value', () => {
      render(<ResourceBar />)
      const fuelMeter = screen.getByTestId('resource-meter-fuel')
      expect(fuelMeter).toHaveTextContent(`${STARTING_RESOURCES.fuel}/${MAX_RESOURCES.fuel}`)
    })

    it('shows water starting value', () => {
      render(<ResourceBar />)
      const waterMeter = screen.getByTestId('resource-meter-water')
      expect(waterMeter).toHaveTextContent(`${STARTING_RESOURCES.water}/${MAX_RESOURCES.water}`)
    })

    it('shows money starting value', () => {
      render(<ResourceBar />)
      const moneyMeter = screen.getByTestId('resource-meter-money')
      expect(moneyMeter).toHaveTextContent(`${STARTING_RESOURCES.money}/${MAX_RESOURCES.money}`)
    })
  })

  describe('state updates', () => {
    it('updates when resources change', () => {
      render(<ResourceBar />)

      act(() => {
        useGameStore.setState({
          resources: { food: 25, fuel: 80, water: 30, money: 100 },
        })
      })

      const foodMeter = screen.getByTestId('resource-meter-food')
      const fuelMeter = screen.getByTestId('resource-meter-fuel')
      expect(foodMeter).toHaveTextContent(`25/${MAX_RESOURCES.food}`)
      expect(fuelMeter).toHaveTextContent(`80/${MAX_RESOURCES.fuel}`)
    })

    it('updates turn counter when turnCount changes', () => {
      render(<ResourceBar />)

      act(() => {
        useGameStore.setState({ turnCount: 5 })
      })

      expect(screen.getByTestId('turn-number')).toHaveTextContent('5')
    })
  })

  describe('resource icons', () => {
    it('shows food icon', () => {
      render(<ResourceBar />)
      expect(screen.getByRole('img', { name: 'Food' })).toHaveTextContent('🍞')
    })

    it('shows fuel icon', () => {
      render(<ResourceBar />)
      expect(screen.getByRole('img', { name: 'Fuel' })).toHaveTextContent('⛽')
    })

    it('shows water icon', () => {
      render(<ResourceBar />)
      expect(screen.getByRole('img', { name: 'Water' })).toHaveTextContent('💧')
    })

    it('shows money icon', () => {
      render(<ResourceBar />)
      expect(screen.getByRole('img', { name: 'Money' })).toHaveTextContent('💰')
    })
  })
})
