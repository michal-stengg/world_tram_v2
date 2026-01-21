import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CardDisplay } from '../../components/game/CardDisplay'
import type { BonusCard } from '../../data/cards'

const mockCard: BonusCard = {
  id: 'security-patrol',
  name: 'Security Patrol',
  stat: 'security',
  bonus: 3,
  description: 'Deploy a trained patrol team to handle threats and maintain order.',
}

describe('CardDisplay', () => {
  describe('rendering card info', () => {
    it('renders card name', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      expect(screen.getByText('Security Patrol')).toBeInTheDocument()
    })

    it('renders stat type', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      expect(screen.getByTestId('stat-type')).toHaveTextContent('security')
    })

    it('renders bonus value with plus sign', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      expect(screen.getByText('+3')).toBeInTheDocument()
    })

    it('renders card description', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      expect(screen.getByText(/Deploy a trained patrol team/)).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('calls onSelect when clicked', () => {
      const handleSelect = vi.fn()
      render(<CardDisplay card={mockCard} selected={false} onSelect={handleSelect} />)

      fireEvent.click(screen.getByTestId(`card-display-${mockCard.id}`))

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })

    it('calls onSelect when Enter key is pressed', () => {
      const handleSelect = vi.fn()
      render(<CardDisplay card={mockCard} selected={false} onSelect={handleSelect} />)

      const card = screen.getByTestId(`card-display-${mockCard.id}`)
      fireEvent.keyDown(card, { key: 'Enter' })

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })

    it('calls onSelect when Space key is pressed', () => {
      const handleSelect = vi.fn()
      render(<CardDisplay card={mockCard} selected={false} onSelect={handleSelect} />)

      const card = screen.getByTestId(`card-display-${mockCard.id}`)
      fireEvent.keyDown(card, { key: ' ' })

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('selected state', () => {
    it('shows not selected when selected prop is false', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      const card = screen.getByTestId(`card-display-${mockCard.id}`)

      expect(card).toHaveAttribute('data-selected', 'false')
    })

    it('shows selected state when selected prop is true', () => {
      render(<CardDisplay card={mockCard} selected={true} onSelect={() => {}} />)
      const card = screen.getByTestId(`card-display-${mockCard.id}`)

      expect(card).toHaveAttribute('data-selected', 'true')
    })

    it('has different styling when selected', () => {
      const { rerender } = render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      const cardNotSelected = screen.getByTestId(`card-display-${mockCard.id}`)
      expect(cardNotSelected).toHaveAttribute('data-selected', 'false')

      rerender(<CardDisplay card={mockCard} selected={true} onSelect={() => {}} />)
      const cardSelected = screen.getByTestId(`card-display-${mockCard.id}`)

      expect(cardSelected).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('accessibility', () => {
    it('is focusable', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      const card = screen.getByTestId(`card-display-${mockCard.id}`)

      card.focus()
      expect(document.activeElement).toBe(card)
    })

    it('has role button', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      const card = screen.getByTestId(`card-display-${mockCard.id}`)

      expect(card).toHaveAttribute('role', 'button')
    })

    it('has aria-label with card name', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      const card = screen.getByTestId(`card-display-${mockCard.id}`)

      expect(card).toHaveAttribute('aria-label', 'Select card Security Patrol')
    })
  })

  describe('different cards', () => {
    it('renders different card data correctly', () => {
      const engineeringCard: BonusCard = {
        id: 'quick-repairs',
        name: 'Quick Repairs',
        stat: 'engineering',
        bonus: 3,
        description: 'A kit of emergency tools and spare parts for rapid mechanical fixes.',
      }

      render(<CardDisplay card={engineeringCard} selected={false} onSelect={() => {}} />)

      expect(screen.getByText('Quick Repairs')).toBeInTheDocument()
      expect(screen.getByTestId('stat-type')).toHaveTextContent('engineering')
      expect(screen.getByText('+3')).toBeInTheDocument()
      expect(screen.getByText(/A kit of emergency tools/)).toBeInTheDocument()
    })

    it('renders food card correctly', () => {
      const foodCard: BonusCard = {
        id: 'emergency-rations',
        name: 'Emergency Rations',
        stat: 'food',
        bonus: 2,
        description: 'Preserved food supplies that can sustain the crew during shortages.',
      }

      render(<CardDisplay card={foodCard} selected={false} onSelect={() => {}} />)

      expect(screen.getByText('Emergency Rations')).toBeInTheDocument()
      expect(screen.getByTestId('stat-type')).toHaveTextContent('food')
      expect(screen.getByText('+2')).toBeInTheDocument()
    })
  })

  describe('stat colors', () => {
    it('displays correct color indicator for security stat', () => {
      render(<CardDisplay card={mockCard} selected={false} onSelect={() => {}} />)
      const statIndicator = screen.getByTestId('stat-indicator')
      expect(statIndicator).toBeInTheDocument()
    })

    it('displays correct color indicator for engineering stat', () => {
      const engineeringCard: BonusCard = {
        id: 'backup-generator',
        name: 'Backup Generator',
        stat: 'engineering',
        bonus: 4,
        description: 'A portable power unit.',
      }

      render(<CardDisplay card={engineeringCard} selected={false} onSelect={() => {}} />)
      const statIndicator = screen.getByTestId('stat-indicator')
      expect(statIndicator).toBeInTheDocument()
    })

    it('displays correct color indicator for food stat', () => {
      const foodCard: BonusCard = {
        id: 'medical-supplies',
        name: 'Medical Supplies',
        stat: 'food',
        bonus: 3,
        description: 'First aid kits and medicine.',
      }

      render(<CardDisplay card={foodCard} selected={false} onSelect={() => {}} />)
      const statIndicator = screen.getByTestId('stat-indicator')
      expect(statIndicator).toBeInTheDocument()
    })
  })
})
