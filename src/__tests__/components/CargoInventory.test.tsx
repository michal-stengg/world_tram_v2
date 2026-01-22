import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CargoInventory } from '../../components/game/CargoInventory'
import type { CargoDiscovery } from '../../types'

const createMockCargo = (
  id: string,
  name: string,
  icon: string,
  rarity: 'common' | 'rare' | 'legendary'
): CargoDiscovery => ({
  item: {
    id,
    name,
    icon,
    rarity,
    rewardType: 'money',
    rewardAmount: 100,
    description: `A ${rarity} item`,
  },
  foundAtCountry: 'switzerland',
  turnFound: 1,
})

describe('CargoInventory', () => {
  describe('empty state', () => {
    it('returns null when carriedCargo is empty', () => {
      const { container } = render(<CargoInventory carriedCargo={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('does not render cargo-inventory container when empty', () => {
      render(<CargoInventory carriedCargo={[]} />)
      expect(screen.queryByTestId('cargo-inventory')).not.toBeInTheDocument()
    })
  })

  describe('displaying cargo items', () => {
    it('renders cargo-inventory container when items present', () => {
      const cargo = [createMockCargo('box-1', 'Mystery Box', '📦', 'common')]
      render(<CargoInventory carriedCargo={cargo} />)
      expect(screen.getByTestId('cargo-inventory')).toBeInTheDocument()
    })

    it('displays single cargo item icon', () => {
      const cargo = [createMockCargo('gem-1', 'Ruby Gem', '💎', 'rare')]
      render(<CargoInventory carriedCargo={cargo} />)
      expect(screen.getByTestId('cargo-item-0')).toHaveTextContent('💎')
    })

    it('displays multiple cargo items', () => {
      const cargo = [
        createMockCargo('box-1', 'Mystery Box', '📦', 'common'),
        createMockCargo('gem-1', 'Ruby Gem', '💎', 'rare'),
        createMockCargo('crown-1', 'Golden Crown', '👑', 'legendary'),
      ]
      render(<CargoInventory carriedCargo={cargo} />)

      expect(screen.getByTestId('cargo-item-0')).toHaveTextContent('📦')
      expect(screen.getByTestId('cargo-item-1')).toHaveTextContent('💎')
      expect(screen.getByTestId('cargo-item-2')).toHaveTextContent('👑')
    })

    it('shows correct number of items', () => {
      const cargo = [
        createMockCargo('box-1', 'Mystery Box', '📦', 'common'),
        createMockCargo('gem-1', 'Ruby Gem', '💎', 'rare'),
      ]
      render(<CargoInventory carriedCargo={cargo} />)

      expect(screen.getByTestId('cargo-item-0')).toBeInTheDocument()
      expect(screen.getByTestId('cargo-item-1')).toBeInTheDocument()
      expect(screen.queryByTestId('cargo-item-2')).not.toBeInTheDocument()
    })
  })

  describe('rarity indicator', () => {
    it('shows gray border for common items', () => {
      const cargo = [createMockCargo('box-1', 'Common Box', '📦', 'common')]
      render(<CargoInventory carriedCargo={cargo} />)
      const item = screen.getByTestId('cargo-item-0')
      expect(item).toHaveStyle({ borderColor: '#666' })
    })

    it('shows blue border for rare items', () => {
      const cargo = [createMockCargo('gem-1', 'Rare Gem', '💎', 'rare')]
      render(<CargoInventory carriedCargo={cargo} />)
      const item = screen.getByTestId('cargo-item-0')
      expect(item).toHaveStyle({ borderColor: '#4488ff' })
    })

    it('shows gold border for legendary items', () => {
      const cargo = [createMockCargo('crown-1', 'Legendary Crown', '👑', 'legendary')]
      render(<CargoInventory carriedCargo={cargo} />)
      const item = screen.getByTestId('cargo-item-0')
      expect(item).toHaveStyle({ borderColor: '#FFD700' })
    })
  })

  describe('tooltip/title attribute', () => {
    it('has title attribute with item name', () => {
      const cargo = [createMockCargo('box-1', 'Mystery Box', '📦', 'common')]
      render(<CargoInventory carriedCargo={cargo} />)
      const item = screen.getByTestId('cargo-item-0')
      expect(item).toHaveAttribute('title', 'Mystery Box')
    })

    it('shows correct title for each item', () => {
      const cargo = [
        createMockCargo('box-1', 'Mystery Box', '📦', 'common'),
        createMockCargo('gem-1', 'Ruby Gem', '💎', 'rare'),
      ]
      render(<CargoInventory carriedCargo={cargo} />)

      expect(screen.getByTestId('cargo-item-0')).toHaveAttribute('title', 'Mystery Box')
      expect(screen.getByTestId('cargo-item-1')).toHaveAttribute('title', 'Ruby Gem')
    })
  })

  describe('cargo icon label', () => {
    it('displays cargo label icon', () => {
      const cargo = [createMockCargo('box-1', 'Mystery Box', '📦', 'common')]
      render(<CargoInventory carriedCargo={cargo} />)
      expect(screen.getByTestId('cargo-label')).toBeInTheDocument()
    })
  })
})
