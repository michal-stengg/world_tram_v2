import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StationModal } from '../../components/game/StationModal'
import type { Country } from '../../types'
import type { StationReward } from '../../logic/station'

const mockCountry: Country = {
  id: 'germany',
  name: 'Germany',
  icon: '🏰',
  landmark: 'Neuschwanstein Castle',
  distanceRequired: 10,
}

const mockReward: StationReward = {
  waterRefill: 25,
  moneyEarned: 40,
}

describe('StationModal', () => {
  describe('rendering', () => {
    it('renders the station modal container', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
    })

    it('displays welcome message with country name', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText(/welcome to germany/i)).toBeInTheDocument()
    })

    it('displays country icon', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText('🏰')).toBeInTheDocument()
    })

    it('displays water refill amount', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('water-reward')).toHaveTextContent('+25')
      expect(screen.getByText(/water/i)).toBeInTheDocument()
    })

    it('displays money earned', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('money-reward')).toHaveTextContent('+$40')
    })

    it('renders continue button', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })
  })

  describe('different countries', () => {
    it('displays correct name for different country', () => {
      const japanCountry: Country = {
        id: 'japan',
        name: 'Japan',
        icon: '🗻',
        landmark: 'Mount Fuji',
        distanceRequired: 10,
      }
      render(
        <StationModal
          country={japanCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText(/welcome to japan/i)).toBeInTheDocument()
      expect(screen.getByText('🗻')).toBeInTheDocument()
    })
  })

  describe('different rewards', () => {
    it('displays different reward amounts correctly', () => {
      const differentReward: StationReward = {
        waterRefill: 50,
        moneyEarned: 100,
      }
      render(
        <StationModal
          country={mockCountry}
          reward={differentReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('water-reward')).toHaveTextContent('+50')
      expect(screen.getByTestId('money-reward')).toHaveTextContent('+$100')
    })

    it('displays zero water refill correctly', () => {
      const zeroWaterReward: StationReward = {
        waterRefill: 0,
        moneyEarned: 40,
      }
      render(
        <StationModal
          country={mockCountry}
          reward={zeroWaterReward}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('water-reward')).toHaveTextContent('+0')
    })
  })

  describe('interaction', () => {
    it('calls onContinue when continue button clicked', () => {
      const onContinue = vi.fn()
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={onContinue}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      expect(onContinue).toHaveBeenCalledTimes(1)
    })

    it('calls onContinue when overlay clicked', () => {
      const onContinue = vi.fn()
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={onContinue}
        />
      )

      fireEvent.click(screen.getByTestId('station-modal-overlay'))

      expect(onContinue).toHaveBeenCalledTimes(1)
    })
  })

  describe('shop button', () => {
    it('does not render Visit Shop button when onVisitShop not provided', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
        />
      )

      expect(screen.queryByRole('button', { name: /visit shop/i })).not.toBeInTheDocument()
    })

    it('renders Visit Shop button when onVisitShop is provided', () => {
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
          onVisitShop={vi.fn()}
        />
      )

      expect(screen.getByRole('button', { name: /visit shop/i })).toBeInTheDocument()
    })

    it('calls onVisitShop when Visit Shop button clicked', () => {
      const onVisitShop = vi.fn()
      render(
        <StationModal
          country={mockCountry}
          reward={mockReward}
          onContinue={vi.fn()}
          onVisitShop={onVisitShop}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      expect(onVisitShop).toHaveBeenCalledTimes(1)
    })
  })
})
