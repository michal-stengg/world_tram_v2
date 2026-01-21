import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { CartShop } from '../../components/game/CartShop'
import type { Cart } from '../../types'
import { carts } from '../../data/carts'

const mockOwnedCarts: Cart[] = []

// Helper to get the buy button inside a testid container
function getBuyButton(cartId: string) {
  const container = screen.getByTestId(`buy-button-${cartId}`)
  return within(container).getByRole('button')
}

describe('CartShop', () => {
  describe('rendering', () => {
    it('renders shop header with current money', () => {
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      expect(screen.getByTestId('cart-shop')).toBeInTheDocument()
      expect(screen.getByText(/\$500/)).toBeInTheDocument()
    })

    it('displays all available carts', () => {
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      // Should display all 6 carts from carts.ts
      expect(screen.getAllByTestId(/^cart-item-/)).toHaveLength(carts.length)
    })

    it('shows cart name, icon, price, and description', () => {
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      // Check fuel cart details within its cart item
      const fuelCartItem = screen.getByTestId('cart-item-fuel-cart')
      expect(within(fuelCartItem).getByText('Fuel Cart')).toBeInTheDocument()
      expect(within(fuelCartItem).getByText('$100')).toBeInTheDocument()
      expect(within(fuelCartItem).getByText('Extra fuel storage tank')).toBeInTheDocument()
    })

    it('renders close button', () => {
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })

  describe('purchase button states', () => {
    it('buy button is enabled when can afford and not owned', () => {
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      // Fuel cart costs $100, we have $500, so should be enabled
      const fuelCartBuyButton = getBuyButton('fuel-cart')
      expect(fuelCartBuyButton).not.toBeDisabled()
    })

    it('buy button is disabled when cannot afford', () => {
      render(
        <CartShop
          money={50}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      // Water cart costs $70, we only have $50
      const waterCartBuyButton = getBuyButton('water-cart')
      expect(waterCartBuyButton).toBeDisabled()
    })

    it('buy button shows "Owned" and is disabled when already owned', () => {
      const ownedFuelCart = carts.find(c => c.id === 'fuel-cart')!
      render(
        <CartShop
          money={500}
          ownedCarts={[ownedFuelCart]}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      const fuelCartBuyButton = getBuyButton('fuel-cart')
      expect(fuelCartBuyButton).toBeDisabled()
      expect(fuelCartBuyButton).toHaveTextContent(/owned/i)
    })
  })

  describe('interaction', () => {
    it('calls onPurchase with cart id when buy clicked', () => {
      const onPurchase = vi.fn()
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={onPurchase}
          onClose={vi.fn()}
        />
      )

      fireEvent.click(getBuyButton('fuel-cart'))

      expect(onPurchase).toHaveBeenCalledTimes(1)
      expect(onPurchase).toHaveBeenCalledWith('fuel-cart')
    })

    it('calls onClose when close button clicked', () => {
      const onClose = vi.fn()
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={onClose}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('calls onClose when overlay clicked', () => {
      const onClose = vi.fn()
      render(
        <CartShop
          money={500}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={onClose}
        />
      )

      fireEvent.click(screen.getByTestId('cart-shop-overlay'))

      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not call onPurchase when clicking disabled button', () => {
      const onPurchase = vi.fn()
      const ownedFuelCart = carts.find(c => c.id === 'fuel-cart')!
      render(
        <CartShop
          money={500}
          ownedCarts={[ownedFuelCart]}
          onPurchase={onPurchase}
          onClose={vi.fn()}
        />
      )

      fireEvent.click(getBuyButton('fuel-cart'))

      expect(onPurchase).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('handles exactly enough money to purchase', () => {
      render(
        <CartShop
          money={70}
          ownedCarts={mockOwnedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      // Water cart costs exactly $70
      const waterCartBuyButton = getBuyButton('water-cart')
      expect(waterCartBuyButton).not.toBeDisabled()
    })

    it('handles multiple owned carts', () => {
      const ownedCarts = carts.filter(c => c.id === 'fuel-cart' || c.id === 'food-cart')
      render(
        <CartShop
          money={500}
          ownedCarts={ownedCarts}
          onPurchase={vi.fn()}
          onClose={vi.fn()}
        />
      )
      // Both fuel and food cart should show as owned
      expect(getBuyButton('fuel-cart')).toHaveTextContent(/owned/i)
      expect(getBuyButton('food-cart')).toHaveTextContent(/owned/i)
      // Water cart should still be purchasable
      expect(getBuyButton('water-cart')).not.toBeDisabled()
    })
  })
})
