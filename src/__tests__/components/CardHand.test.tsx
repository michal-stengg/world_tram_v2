import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CardHand } from '../../components/game/CardHand'
import type { BonusCard } from '../../data/cards'

const mockCards: BonusCard[] = [
  {
    id: 'security-patrol',
    name: 'Security Patrol',
    stat: 'security',
    bonus: 3,
    description: 'Deploy a trained patrol team to handle threats and maintain order.',
  },
  {
    id: 'quick-repairs',
    name: 'Quick Repairs',
    stat: 'engineering',
    bonus: 3,
    description: 'A kit of emergency tools and spare parts for rapid mechanical fixes.',
  },
  {
    id: 'emergency-rations',
    name: 'Emergency Rations',
    stat: 'food',
    bonus: 2,
    description: 'Preserved food supplies that can sustain the crew during shortages.',
  },
]

describe('CardHand', () => {
  describe('rendering cards', () => {
    it('renders 3 cards when given 3 cards', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toBeInTheDocument()
      expect(screen.getByTestId('card-display-quick-repairs')).toBeInTheDocument()
      expect(screen.getByTestId('card-display-emergency-rations')).toBeInTheDocument()
    })

    it('renders all card names', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByText('Security Patrol')).toBeInTheDocument()
      expect(screen.getByText('Quick Repairs')).toBeInTheDocument()
      expect(screen.getByText('Emergency Rations')).toBeInTheDocument()
    })

    it('has a card-hand test id', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-hand')).toBeInTheDocument()
    })
  })

  describe('selected state', () => {
    it('passes selected state correctly to cards', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={['quick-repairs']}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toHaveAttribute('data-selected', 'false')
      expect(screen.getByTestId('card-display-quick-repairs')).toHaveAttribute('data-selected', 'true')
      expect(screen.getByTestId('card-display-emergency-rations')).toHaveAttribute('data-selected', 'false')
    })

    it('handles multiple selected cards', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={['security-patrol', 'emergency-rations']}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toHaveAttribute('data-selected', 'true')
      expect(screen.getByTestId('card-display-quick-repairs')).toHaveAttribute('data-selected', 'false')
      expect(screen.getByTestId('card-display-emergency-rations')).toHaveAttribute('data-selected', 'true')
    })

    it('handles no selected cards', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toHaveAttribute('data-selected', 'false')
      expect(screen.getByTestId('card-display-quick-repairs')).toHaveAttribute('data-selected', 'false')
      expect(screen.getByTestId('card-display-emergency-rations')).toHaveAttribute('data-selected', 'false')
    })

    it('handles all cards selected', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={['security-patrol', 'quick-repairs', 'emergency-rations']}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toHaveAttribute('data-selected', 'true')
      expect(screen.getByTestId('card-display-quick-repairs')).toHaveAttribute('data-selected', 'true')
      expect(screen.getByTestId('card-display-emergency-rations')).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('interaction', () => {
    it('calls onSelectCard with card id when first card is clicked', () => {
      const handleSelectCard = vi.fn()
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={handleSelectCard}
        />
      )

      fireEvent.click(screen.getByTestId('card-display-security-patrol'))

      expect(handleSelectCard).toHaveBeenCalledTimes(1)
      expect(handleSelectCard).toHaveBeenCalledWith('security-patrol')
    })

    it('calls onSelectCard with card id when second card is clicked', () => {
      const handleSelectCard = vi.fn()
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={handleSelectCard}
        />
      )

      fireEvent.click(screen.getByTestId('card-display-quick-repairs'))

      expect(handleSelectCard).toHaveBeenCalledTimes(1)
      expect(handleSelectCard).toHaveBeenCalledWith('quick-repairs')
    })

    it('calls onSelectCard with card id when third card is clicked', () => {
      const handleSelectCard = vi.fn()
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={[]}
          onSelectCard={handleSelectCard}
        />
      )

      fireEvent.click(screen.getByTestId('card-display-emergency-rations'))

      expect(handleSelectCard).toHaveBeenCalledTimes(1)
      expect(handleSelectCard).toHaveBeenCalledWith('emergency-rations')
    })

    it('calls onSelectCard for already selected card', () => {
      const handleSelectCard = vi.fn()
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={['quick-repairs']}
          onSelectCard={handleSelectCard}
        />
      )

      fireEvent.click(screen.getByTestId('card-display-quick-repairs'))

      expect(handleSelectCard).toHaveBeenCalledTimes(1)
      expect(handleSelectCard).toHaveBeenCalledWith('quick-repairs')
    })
  })

  describe('edge cases', () => {
    it('renders empty hand with no cards', () => {
      render(
        <CardHand
          cards={[]}
          selectedCardIds={[]}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-hand')).toBeInTheDocument()
    })

    it('renders with fewer than 3 cards', () => {
      const twoCards = mockCards.slice(0, 2)
      render(
        <CardHand
          cards={twoCards}
          selectedCardIds={[]}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toBeInTheDocument()
      expect(screen.getByTestId('card-display-quick-repairs')).toBeInTheDocument()
      expect(screen.queryByTestId('card-display-emergency-rations')).not.toBeInTheDocument()
    })

    it('ignores selectedCardIds for cards not in hand', () => {
      render(
        <CardHand
          cards={mockCards}
          selectedCardIds={['non-existent-card']}
          onSelectCard={() => {}}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toHaveAttribute('data-selected', 'false')
      expect(screen.getByTestId('card-display-quick-repairs')).toHaveAttribute('data-selected', 'false')
      expect(screen.getByTestId('card-display-emergency-rations')).toHaveAttribute('data-selected', 'false')
    })
  })
})
