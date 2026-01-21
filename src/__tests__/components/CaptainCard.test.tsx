import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CaptainCard } from '../../components/game/CaptainCard'
import type { Captain } from '../../types'

const mockCaptain: Captain = {
  id: 'renji',
  name: 'Renji',
  origin: 'Japan',
  description: 'A precise and methodical engineer with decades of experience.',
  portrait: '\uD83E\uDDD1\u200D\u2708\uFE0F',
  stats: {
    engineering: 5,
    food: 2,
    security: 3,
  },
}

describe('CaptainCard', () => {
  describe('rendering captain info', () => {
    it('renders captain name', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByText('Renji')).toBeInTheDocument()
    })

    it('renders captain origin', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByText('Japan')).toBeInTheDocument()
    })

    it('renders captain portrait', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByTestId('captain-portrait')).toHaveTextContent('\uD83E\uDDD1\u200D\u2708\uFE0F')
    })

    it('renders captain description', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByText(/A precise and methodical engineer/)).toBeInTheDocument()
    })
  })

  describe('rendering stats', () => {
    it('renders engineering stat bar', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByText('Eng')).toBeInTheDocument()
    })

    it('renders food stat bar', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByText('Food')).toBeInTheDocument()
    })

    it('renders security stat bar', () => {
      render(<CaptainCard captain={mockCaptain} />)
      expect(screen.getByText('Sec')).toBeInTheDocument()
    })

    it('renders all 3 stat bars', () => {
      render(<CaptainCard captain={mockCaptain} />)
      const statBars = screen.getAllByTestId('stat-bar')
      expect(statBars).toHaveLength(3)
    })
  })

  describe('interaction', () => {
    it('calls onSelect when clicked', () => {
      const handleSelect = vi.fn()
      render(<CaptainCard captain={mockCaptain} onSelect={handleSelect} />)

      fireEvent.click(screen.getByTestId('captain-card-renji'))

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })

    it('works without onSelect prop', () => {
      render(<CaptainCard captain={mockCaptain} />)

      expect(() => fireEvent.click(screen.getByTestId('captain-card-renji'))).not.toThrow()
    })
  })

  describe('selected state', () => {
    it('is not selected by default', () => {
      render(<CaptainCard captain={mockCaptain} />)
      const card = screen.getByTestId('captain-card-renji')

      expect(card).not.toHaveAttribute('data-selected', 'true')
    })

    it('shows selected state when selected prop is true', () => {
      render(<CaptainCard captain={mockCaptain} selected />)
      const card = screen.getByTestId('captain-card-renji')

      expect(card).toHaveAttribute('data-selected', 'true')
    })

    it('has different styling when selected', () => {
      const { rerender } = render(<CaptainCard captain={mockCaptain} />)
      const cardNotSelected = screen.getByTestId('captain-card-renji')
      expect(cardNotSelected).not.toHaveAttribute('data-selected', 'true')

      rerender(<CaptainCard captain={mockCaptain} selected />)
      const cardSelected = screen.getByTestId('captain-card-renji')

      // Just verify the component accepts selected prop and renders with selected attribute
      expect(cardSelected).toHaveAttribute('data-selected', 'true')
    })
  })

  describe('accessibility', () => {
    it('is focusable', () => {
      render(<CaptainCard captain={mockCaptain} />)
      const card = screen.getByTestId('captain-card-renji')

      card.focus()
      expect(document.activeElement).toBe(card)
    })

    it('has role button for interactive cards', () => {
      render(<CaptainCard captain={mockCaptain} onSelect={() => {}} />)
      const card = screen.getByTestId('captain-card-renji')

      expect(card).toHaveAttribute('role', 'button')
    })

    it('has aria-label with captain name', () => {
      render(<CaptainCard captain={mockCaptain} />)
      const card = screen.getByTestId('captain-card-renji')

      expect(card).toHaveAttribute('aria-label', 'Select captain Renji')
    })
  })

  describe('different captains', () => {
    it('renders different captain data correctly', () => {
      const anotherCaptain: Captain = {
        id: 'maria',
        name: 'Maria',
        origin: 'Spain',
        description: 'A fearless captain from the Mediterranean.',
        portrait: '\uD83D\uDC69\u200D\u2708\uFE0F',
        stats: {
          engineering: 3,
          food: 4,
          security: 5,
        },
      }

      render(<CaptainCard captain={anotherCaptain} />)

      expect(screen.getByText('Maria')).toBeInTheDocument()
      expect(screen.getByText('Spain')).toBeInTheDocument()
      expect(screen.getByText(/A fearless captain/)).toBeInTheDocument()
      expect(screen.getByTestId('captain-portrait')).toHaveTextContent('\uD83D\uDC69\u200D\u2708\uFE0F')
    })
  })
})
