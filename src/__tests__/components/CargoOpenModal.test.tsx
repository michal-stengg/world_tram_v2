import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CargoOpenModal } from '../../components/game/CargoOpenModal'
import type { CargoItem, CargoReward } from '../../types'

const mockCargoItem: CargoItem = {
  id: 'golden-compass',
  name: 'Golden Compass',
  icon: '🧭',
  rarity: 'rare',
  rewardType: 'money',
  rewardAmount: 100,
  description: 'An ornate compass that once belonged to a famous explorer.',
}

const mockReward: CargoReward = {
  rewardType: 'money',
  amount: 100,
}

describe('CargoOpenModal', () => {
  describe('rendering', () => {
    it('renders the modal header', () => {
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      // Header can be "Opening Crate..." or "Reward!"
      const header = screen.getByTestId('cargo-open-header')
      expect(header).toBeInTheDocument()
    })

    it('displays the item icon', () => {
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-item-icon')).toHaveTextContent('🧭')
    })

    it('displays the item name', () => {
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText('Golden Compass')).toBeInTheDocument()
    })

    it('shows the correct reward amount', () => {
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-reward-amount')).toHaveTextContent('+100')
    })

    it('renders collect/continue button', () => {
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /collect/i })).toBeInTheDocument()
    })
  })

  describe('resource icons', () => {
    it('shows money icon for money reward', () => {
      const moneyReward: CargoReward = { rewardType: 'money', amount: 50 }
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={moneyReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-reward-icon')).toHaveTextContent('💰')
    })

    it('shows fuel icon for fuel reward', () => {
      const fuelReward: CargoReward = { rewardType: 'fuel', amount: 30 }
      const fuelCargoItem: CargoItem = {
        ...mockCargoItem,
        rewardType: 'fuel',
      }
      render(
        <CargoOpenModal
          cargoItem={fuelCargoItem}
          reward={fuelReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-reward-icon')).toHaveTextContent('⛽')
    })

    it('shows food icon for food reward', () => {
      const foodReward: CargoReward = { rewardType: 'food', amount: 25 }
      const foodCargoItem: CargoItem = {
        ...mockCargoItem,
        rewardType: 'food',
      }
      render(
        <CargoOpenModal
          cargoItem={foodCargoItem}
          reward={foodReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-reward-icon')).toHaveTextContent('🍞')
    })

    it('shows water icon for water reward', () => {
      const waterReward: CargoReward = { rewardType: 'water', amount: 20 }
      const waterCargoItem: CargoItem = {
        ...mockCargoItem,
        rewardType: 'water',
      }
      render(
        <CargoOpenModal
          cargoItem={waterCargoItem}
          reward={waterReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-reward-icon')).toHaveTextContent('💧')
    })
  })

  describe('rarity badges', () => {
    it('displays common rarity badge', () => {
      const commonItem: CargoItem = {
        ...mockCargoItem,
        rarity: 'common',
      }
      render(
        <CargoOpenModal
          cargoItem={commonItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-rarity-badge')).toHaveTextContent('common')
    })

    it('displays rare rarity badge', () => {
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-rarity-badge')).toHaveTextContent('rare')
    })

    it('displays legendary rarity badge', () => {
      const legendaryItem: CargoItem = {
        ...mockCargoItem,
        rarity: 'legendary',
      }
      render(
        <CargoOpenModal
          cargoItem={legendaryItem}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-rarity-badge')).toHaveTextContent('legendary')
    })
  })

  describe('interaction', () => {
    it('calls onContinue when collect button is clicked', () => {
      const onContinue = vi.fn()
      render(
        <CargoOpenModal
          cargoItem={mockCargoItem}
          reward={mockReward}
          onContinue={onContinue}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /collect/i }))

      expect(onContinue).toHaveBeenCalledTimes(1)
    })
  })

  describe('different items', () => {
    it('displays different item details', () => {
      const anotherItem: CargoItem = {
        id: 'ancient-scroll',
        name: 'Ancient Scroll',
        icon: '📜',
        rarity: 'legendary',
        rewardType: 'money',
        rewardAmount: 250,
        description: 'A mysterious scroll with arcane writings.',
      }
      const anotherReward: CargoReward = { rewardType: 'money', amount: 250 }

      render(
        <CargoOpenModal
          cargoItem={anotherItem}
          reward={anotherReward}
          onContinue={vi.fn()}
        />
      )

      expect(screen.getByTestId('cargo-item-icon')).toHaveTextContent('📜')
      expect(screen.getByText('Ancient Scroll')).toBeInTheDocument()
      expect(screen.getByTestId('cargo-reward-amount')).toHaveTextContent('+250')
    })
  })
})
