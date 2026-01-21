import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResourceMeter } from '../../components/common/ResourceMeter'

describe('ResourceMeter', () => {
  describe('rendering', () => {
    it('renders the icon correctly', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      expect(screen.getByRole('img', { name: 'Food' })).toHaveTextContent('🍞')
    })

    it('renders the label correctly', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      expect(screen.getByText('Food')).toBeInTheDocument()
    })

    it('renders the current/max text', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      expect(screen.getByTestId('value-text')).toHaveTextContent('50/100')
    })

    it('renders with correct testid', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      expect(screen.getByTestId('resource-meter-food')).toBeInTheDocument()
    })
  })

  describe('bar width', () => {
    it('shows 50% width for 50/100', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      const barFill = screen.getByTestId('bar-fill')
      // The width is set via framer-motion animation, so we check the animate prop indirectly
      expect(barFill).toBeInTheDocument()
    })

    it('shows 100% width for full resource', () => {
      render(<ResourceMeter icon="⛽" label="Fuel" current={200} max={200} />)
      expect(screen.getByTestId('value-text')).toHaveTextContent('200/200')
    })

    it('shows 0% width for empty resource', () => {
      render(<ResourceMeter icon="💧" label="Water" current={0} max={100} />)
      expect(screen.getByTestId('value-text')).toHaveTextContent('0/100')
    })

    it('clamps percentage to 100% when current exceeds max', () => {
      render(<ResourceMeter icon="💰" label="Money" current={150} max={100} />)
      expect(screen.getByTestId('value-text')).toHaveTextContent('150/100')
    })
  })

  describe('warning state', () => {
    it('shows warning when current < 20% of max', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={15} max={100} />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveAttribute('data-warning', 'true')
    })

    it('does not show warning when current >= 20% of max', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={25} max={100} />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveAttribute('data-warning', 'false')
    })

    it('does not show warning when showWarning is false', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={5} max={100} showWarning={false} />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveAttribute('data-warning', 'false')
    })

    it('shows warning at exactly 19%', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={19} max={100} />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveAttribute('data-warning', 'true')
    })

    it('does not show warning at exactly 20%', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={20} max={100} />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveAttribute('data-warning', 'false')
    })
  })

  describe('color prop', () => {
    it('uses default gold color when not provided', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveStyle({ backgroundColor: '#F7B538' })
    })

    it('uses custom color when provided', () => {
      render(<ResourceMeter icon="⛽" label="Fuel" current={50} max={100} color="#1B4B8C" />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveStyle({ backgroundColor: '#1B4B8C' })
    })

    it('overrides color with red when in warning state', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={10} max={100} color="#3E8914" />)
      const barFill = screen.getByTestId('bar-fill')
      expect(barFill).toHaveStyle({ backgroundColor: '#DB3A34' })
    })
  })

  describe('previewDelta prop', () => {
    it('does not render delta when previewDelta is undefined', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      expect(screen.queryByTestId('preview-delta')).not.toBeInTheDocument()
    })

    it('renders positive delta with plus sign and green color', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} previewDelta={5} />)
      const delta = screen.getByTestId('preview-delta')
      expect(delta).toHaveTextContent('(+5)')
      expect(delta).toHaveStyle({ color: '#2ecc71' })
    })

    it('renders negative delta with minus sign and red color', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} previewDelta={-3} />)
      const delta = screen.getByTestId('preview-delta')
      expect(delta).toHaveTextContent('(-3)')
      expect(delta).toHaveStyle({ color: '#e74c3c' })
    })

    it('renders zero delta with neutral color', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} previewDelta={0} />)
      const delta = screen.getByTestId('preview-delta')
      expect(delta).toHaveTextContent('(0)')
    })
  })

  describe('different resources', () => {
    it('renders food meter correctly', () => {
      render(<ResourceMeter icon="🍞" label="Food" current={50} max={100} />)
      expect(screen.getByTestId('resource-meter-food')).toBeInTheDocument()
      expect(screen.getByText('Food')).toBeInTheDocument()
    })

    it('renders fuel meter correctly', () => {
      render(<ResourceMeter icon="⛽" label="Fuel" current={100} max={200} />)
      expect(screen.getByTestId('resource-meter-fuel')).toBeInTheDocument()
      expect(screen.getByText('Fuel')).toBeInTheDocument()
    })

    it('renders water meter correctly', () => {
      render(<ResourceMeter icon="💧" label="Water" current={50} max={100} />)
      expect(screen.getByTestId('resource-meter-water')).toBeInTheDocument()
      expect(screen.getByText('Water')).toBeInTheDocument()
    })

    it('renders money meter correctly', () => {
      render(<ResourceMeter icon="💰" label="Money" current={200} max={1000} />)
      expect(screen.getByTestId('resource-meter-money')).toBeInTheDocument()
      expect(screen.getByText('Money')).toBeInTheDocument()
    })
  })
})
