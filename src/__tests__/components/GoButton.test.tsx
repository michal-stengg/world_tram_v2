import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GoButton } from '../../components/game/GoButton'

describe('GoButton', () => {
  describe('rendering', () => {
    it('renders GO! text', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByText(/go!/i)).toBeInTheDocument()
    })

    it('renders dice emojis', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getAllByText('🎲')).toHaveLength(2)
    })

    it('has data-testid for targeting', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByTestId('go-button')).toBeInTheDocument()
    })
  })

  describe('onClick handling', () => {
    it('calls onGo when clicked', () => {
      const handleGo = vi.fn()
      render(<GoButton onGo={handleGo} />)
      fireEvent.click(screen.getByRole('button'))
      expect(handleGo).toHaveBeenCalledTimes(1)
    })

    it('does not call onGo when disabled', () => {
      const handleGo = vi.fn()
      render(<GoButton onGo={handleGo} disabled />)
      fireEvent.click(screen.getByRole('button'))
      expect(handleGo).not.toHaveBeenCalled()
    })
  })

  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('is disabled when disabled prop is true', () => {
      render(<GoButton onGo={() => {}} disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('styling', () => {
    it('has gold variant styling', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'gold')
    })

    it('has large size', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByRole('button')).toHaveAttribute('data-size', 'large')
    })

    it('has glow effect', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByRole('button')).toHaveAttribute('data-glow', 'true')
    })
  })

  describe('accessibility', () => {
    it('renders as a button element', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has accessible emoji labels', () => {
      render(<GoButton onGo={() => {}} />)
      expect(screen.getAllByRole('img', { name: 'Dice' })).toHaveLength(2)
    })
  })
})
