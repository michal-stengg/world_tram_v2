import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CargoDiscoveryModal } from '../../components/game/CargoDiscoveryModal'
import type { CargoItem } from '../../types'

const mockCommonCargo: CargoItem = {
  id: 'cargo-1',
  name: 'Mysterious Box',
  icon: '📦',
  rarity: 'common',
  rewardType: 'money',
  rewardAmount: 10,
  description: 'A dusty old box',
}

const mockRareCargo: CargoItem = {
  id: 'cargo-2',
  name: 'Ancient Artifact',
  icon: '🏺',
  rarity: 'rare',
  rewardType: 'fuel',
  rewardAmount: 25,
  description: 'An artifact from ancient times',
}

const mockLegendaryCargo: CargoItem = {
  id: 'cargo-3',
  name: 'Golden Treasure',
  icon: '👑',
  rarity: 'legendary',
  rewardType: 'money',
  rewardAmount: 100,
  description: 'A legendary treasure',
}

describe('CargoDiscoveryModal', () => {
  describe('rendering', () => {
    it('renders the modal container', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-discovery-modal')).toBeInTheDocument()
    })

    it('displays "You found a crate!" header', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText(/you found a crate!/i)).toBeInTheDocument()
    })

    it('displays crate emoji in header', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-discovery-header')).toHaveTextContent('📦')
    })

    it('displays the item icon', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-item-icon')).toHaveTextContent('📦')
    })

    it('displays the item name', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-item-name')).toHaveTextContent('Mysterious Box')
    })

    it('displays "Will open at next station" note', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText(/will open at next station/i)).toBeInTheDocument()
    })

    it('renders continue button', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('renders modal overlay', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-discovery-overlay')).toBeInTheDocument()
    })
  })

  describe('rarity badges', () => {
    it('displays common rarity badge with correct styling', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={vi.fn()}
        />
      )
      const badge = screen.getByTestId('cargo-rarity-badge')
      expect(badge).toHaveTextContent(/common/i)
      expect(badge).toHaveStyle({ backgroundColor: '#666' })
    })

    it('displays rare rarity badge with correct styling', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockRareCargo}
          onContinue={vi.fn()}
        />
      )
      const badge = screen.getByTestId('cargo-rarity-badge')
      expect(badge).toHaveTextContent(/rare/i)
      expect(badge).toHaveStyle({ backgroundColor: '#4488ff' })
    })

    it('displays legendary rarity badge with correct styling', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockLegendaryCargo}
          onContinue={vi.fn()}
        />
      )
      const badge = screen.getByTestId('cargo-rarity-badge')
      expect(badge).toHaveTextContent(/legendary/i)
      expect(badge).toHaveStyle({ backgroundColor: '#FFD700' })
    })
  })

  describe('different cargo items', () => {
    it('displays correct icon for different cargo', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockRareCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-item-icon')).toHaveTextContent('🏺')
    })

    it('displays correct name for different cargo', () => {
      render(
        <CargoDiscoveryModal
          cargoItem={mockLegendaryCargo}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('cargo-item-name')).toHaveTextContent('Golden Treasure')
    })
  })

  describe('interaction', () => {
    it('calls onContinue when continue button clicked', () => {
      const onContinue = vi.fn()
      render(
        <CargoDiscoveryModal
          cargoItem={mockCommonCargo}
          onContinue={onContinue}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      expect(onContinue).toHaveBeenCalledTimes(1)
    })
  })
})
