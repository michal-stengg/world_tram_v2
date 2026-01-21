import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PixelButton } from '../../components/common/PixelButton'

describe('PixelButton', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<PixelButton>Click Me</PixelButton>)
      expect(screen.getByRole('button')).toHaveTextContent('Click Me')
    })

    it('renders with complex children', () => {
      render(
        <PixelButton>
          <span data-testid="icon">*</span> Start Game
        </PixelButton>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Start Game')
    })
  })

  describe('onClick handling', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<PixelButton onClick={handleClick}>Click Me</PixelButton>)

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(
        <PixelButton onClick={handleClick} disabled>
          Click Me
        </PixelButton>
      )

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('works without onClick prop', () => {
      render(<PixelButton>No Handler</PixelButton>)

      // Should not throw
      expect(() => fireEvent.click(screen.getByRole('button'))).not.toThrow()
    })
  })

  describe('variants', () => {
    it('applies primary variant styles by default', () => {
      render(<PixelButton>Primary</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-variant', 'primary')
    })

    it('applies secondary variant', () => {
      render(<PixelButton variant="secondary">Secondary</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-variant', 'secondary')
    })

    it('applies danger variant', () => {
      render(<PixelButton variant="danger">Danger</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-variant', 'danger')
    })

    it('applies gold variant', () => {
      render(<PixelButton variant="gold">Gold</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-variant', 'gold')
    })
  })

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<PixelButton>Medium</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-size', 'medium')
    })

    it('applies small size', () => {
      render(<PixelButton size="small">Small</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-size', 'small')
    })

    it('applies large size', () => {
      render(<PixelButton size="large">Large</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-size', 'large')
    })
  })

  describe('disabled state', () => {
    it('is not disabled by default', () => {
      render(<PixelButton>Enabled</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).not.toBeDisabled()
    })

    it('is disabled when disabled prop is true', () => {
      render(<PixelButton disabled>Disabled</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toBeDisabled()
    })
  })

  describe('glow effect', () => {
    it('does not have glow by default', () => {
      render(<PixelButton>No Glow</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).not.toHaveAttribute('data-glow', 'true')
    })

    it('has glow when glow prop is true', () => {
      render(<PixelButton glow>Glowing</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveAttribute('data-glow', 'true')
    })
  })

  describe('custom className', () => {
    it('applies additional className', () => {
      render(<PixelButton className="custom-class">Custom</PixelButton>)
      const button = screen.getByRole('button')

      expect(button).toHaveClass('custom-class')
    })
  })

  describe('accessibility', () => {
    it('renders as a button element', () => {
      render(<PixelButton>Accessible</PixelButton>)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('is focusable when not disabled', () => {
      render(<PixelButton>Focusable</PixelButton>)
      const button = screen.getByRole('button')

      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })
})
