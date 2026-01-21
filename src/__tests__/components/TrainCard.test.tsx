import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TrainCard } from '../../components/game/TrainCard'
import type { Train } from '../../types'

const mockTrain: Train = {
  id: 'blitzzug',
  name: 'Blitzzug',
  origin: 'Germany',
  character: 'The reliable workhorse of European rails',
  sprite: '🚄',
  stats: {
    speed: 5,
    reliability: 4,
    power: 3,
  },
}

describe('TrainCard', () => {
  describe('rendering', () => {
    it('renders train name', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('Blitzzug')).toBeInTheDocument()
    })

    it('renders train origin', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('Germany')).toBeInTheDocument()
    })

    it('renders train sprite', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('🚄')).toBeInTheDocument()
    })

    it('renders train character description', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('The reliable workhorse of European rails')).toBeInTheDocument()
    })

    it('renders with testid', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByTestId('train-card')).toBeInTheDocument()
    })
  })

  describe('stat bars', () => {
    it('renders Speed stat bar', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('Speed')).toBeInTheDocument()
    })

    it('renders Reliability stat bar', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('Reliability')).toBeInTheDocument()
    })

    it('renders Power stat bar', () => {
      render(<TrainCard train={mockTrain} />)
      expect(screen.getByText('Power')).toBeInTheDocument()
    })

    it('renders all three stat bars', () => {
      render(<TrainCard train={mockTrain} />)
      const statBars = screen.getAllByTestId('stat-bar')
      expect(statBars).toHaveLength(3)
    })
  })

  describe('interactions', () => {
    it('calls onSelect when clicked', () => {
      const handleSelect = vi.fn()
      render(<TrainCard train={mockTrain} onSelect={handleSelect} />)

      const card = screen.getByTestId('train-card')
      fireEvent.click(card)

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })

    it('does not throw when clicked without onSelect prop', () => {
      render(<TrainCard train={mockTrain} />)

      const card = screen.getByTestId('train-card')
      expect(() => fireEvent.click(card)).not.toThrow()
    })

    it('handles keyboard activation with Enter', () => {
      const handleSelect = vi.fn()
      render(<TrainCard train={mockTrain} onSelect={handleSelect} />)

      const card = screen.getByTestId('train-card')
      fireEvent.keyDown(card, { key: 'Enter' })

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })

    it('handles keyboard activation with Space', () => {
      const handleSelect = vi.fn()
      render(<TrainCard train={mockTrain} onSelect={handleSelect} />)

      const card = screen.getByTestId('train-card')
      fireEvent.keyDown(card, { key: ' ' })

      expect(handleSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('selected state', () => {
    it('applies selected styling when selected prop is true', () => {
      render(<TrainCard train={mockTrain} selected />)
      const card = screen.getByTestId('train-card')
      expect(card).toHaveAttribute('data-selected', 'true')
    })

    it('does not apply selected styling when selected prop is false', () => {
      render(<TrainCard train={mockTrain} selected={false} />)
      const card = screen.getByTestId('train-card')
      expect(card).not.toHaveAttribute('data-selected', 'true')
    })

    it('does not apply selected styling when selected prop is not provided', () => {
      render(<TrainCard train={mockTrain} />)
      const card = screen.getByTestId('train-card')
      expect(card).not.toHaveAttribute('data-selected', 'true')
    })
  })

  describe('accessibility', () => {
    it('has role button', () => {
      render(<TrainCard train={mockTrain} />)
      const card = screen.getByTestId('train-card')
      expect(card).toHaveAttribute('role', 'button')
    })

    it('has tabIndex for keyboard navigation', () => {
      render(<TrainCard train={mockTrain} />)
      const card = screen.getByTestId('train-card')
      expect(card).toHaveAttribute('tabIndex', '0')
    })

    it('has aria-label describing the train', () => {
      render(<TrainCard train={mockTrain} />)
      const card = screen.getByTestId('train-card')
      expect(card).toHaveAttribute('aria-label', 'Select Blitzzug train from Germany')
    })

    it('indicates selected state with aria-pressed', () => {
      render(<TrainCard train={mockTrain} selected />)
      const card = screen.getByTestId('train-card')
      expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    it('indicates unselected state with aria-pressed false', () => {
      render(<TrainCard train={mockTrain} selected={false} />)
      const card = screen.getByTestId('train-card')
      expect(card).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('different train data', () => {
    it('renders correctly with different train', () => {
      const differentTrain: Train = {
        id: 'kitsune',
        name: 'Kitsune Express',
        origin: 'Japan',
        character: 'Swift and elegant, a master of precision',
        sprite: '🦊',
        stats: {
          speed: 6,
          reliability: 3,
          power: 2,
        },
      }

      render(<TrainCard train={differentTrain} />)

      expect(screen.getByText('Kitsune Express')).toBeInTheDocument()
      expect(screen.getByText('Japan')).toBeInTheDocument()
      expect(screen.getByText('🦊')).toBeInTheDocument()
      expect(screen.getByText('Swift and elegant, a master of precision')).toBeInTheDocument()
    })
  })
})
