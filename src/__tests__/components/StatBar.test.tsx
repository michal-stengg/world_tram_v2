import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatBar } from '../../components/common/StatBar'

describe('StatBar', () => {
  describe('rendering', () => {
    it('renders label correctly', () => {
      render(<StatBar label="Engineering" value={4} />)
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })

    it('renders with testid', () => {
      render(<StatBar label="Speed" value={3} />)
      expect(screen.getByTestId('stat-bar')).toBeInTheDocument()
    })
  })

  describe('filled and empty blocks', () => {
    it('renders correct number of filled blocks for value', () => {
      render(<StatBar label="Engineering" value={4} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      expect(filledBlocks).toHaveLength(4)
    })

    it('renders correct number of empty blocks for remaining value', () => {
      render(<StatBar label="Engineering" value={4} />)
      const emptyBlocks = screen.getAllByTestId('block-empty')
      expect(emptyBlocks).toHaveLength(2) // maxValue defaults to 6, so 6 - 4 = 2
    })

    it('renders all filled blocks when value equals maxValue', () => {
      render(<StatBar label="Speed" value={6} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      const emptyBlocks = screen.queryAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(6)
      expect(emptyBlocks).toHaveLength(0)
    })

    it('renders all empty blocks when value is 0', () => {
      render(<StatBar label="Luck" value={0} />)
      const filledBlocks = screen.queryAllByTestId('block-filled')
      const emptyBlocks = screen.getAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(0)
      expect(emptyBlocks).toHaveLength(6)
    })

    it('renders total blocks equal to maxValue', () => {
      render(<StatBar label="Test" value={3} maxValue={5} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      const emptyBlocks = screen.getAllByTestId('block-empty')
      expect(filledBlocks.length + emptyBlocks.length).toBe(5)
    })
  })

  describe('maxValue prop', () => {
    it('uses default maxValue of 6 when not provided', () => {
      render(<StatBar label="Engineering" value={2} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      const emptyBlocks = screen.getAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(2)
      expect(emptyBlocks).toHaveLength(4)
    })

    it('respects custom maxValue', () => {
      render(<StatBar label="Custom" value={3} maxValue={10} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      const emptyBlocks = screen.getAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(3)
      expect(emptyBlocks).toHaveLength(7)
    })

    it('handles maxValue of 1', () => {
      render(<StatBar label="Binary" value={1} maxValue={1} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      const emptyBlocks = screen.queryAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(1)
      expect(emptyBlocks).toHaveLength(0)
    })
  })

  describe('color prop', () => {
    it('applies default gold color to filled blocks', () => {
      render(<StatBar label="Engineering" value={2} />)
      const filledBlocks = screen.getAllByTestId('block-filled')

      filledBlocks.forEach((block) => {
        expect(block).toHaveStyle({ color: '#F7B538' })
      })
    })

    it('applies custom color to filled blocks', () => {
      render(<StatBar label="Health" value={3} color="#e74c3c" />)
      const filledBlocks = screen.getAllByTestId('block-filled')

      filledBlocks.forEach((block) => {
        expect(block).toHaveStyle({ color: '#e74c3c' })
      })
    })

    it('applies CSS variable as color', () => {
      render(<StatBar label="Food" value={4} color="var(--color-food)" />)
      const filledBlocks = screen.getAllByTestId('block-filled')

      filledBlocks.forEach((block) => {
        expect(block).toHaveStyle({ color: 'var(--color-food)' })
      })
    })
  })

  describe('accessibility', () => {
    it('has accessible label text', () => {
      render(<StatBar label="Engineering" value={4} />)
      expect(screen.getByText('Engineering')).toBeInTheDocument()
    })

    it('communicates value via aria-label', () => {
      render(<StatBar label="Speed" value={3} maxValue={6} />)
      const statBar = screen.getByTestId('stat-bar')
      expect(statBar).toHaveAttribute('aria-label', 'Speed: 3 out of 6')
    })
  })

  describe('edge cases', () => {
    it('handles value greater than maxValue by capping at maxValue', () => {
      render(<StatBar label="Overflow" value={10} maxValue={6} />)
      const filledBlocks = screen.getAllByTestId('block-filled')
      const emptyBlocks = screen.queryAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(6)
      expect(emptyBlocks).toHaveLength(0)
    })

    it('handles negative value by treating as 0', () => {
      render(<StatBar label="Negative" value={-2} maxValue={6} />)
      const filledBlocks = screen.queryAllByTestId('block-filled')
      const emptyBlocks = screen.getAllByTestId('block-empty')
      expect(filledBlocks).toHaveLength(0)
      expect(emptyBlocks).toHaveLength(6)
    })
  })
})
