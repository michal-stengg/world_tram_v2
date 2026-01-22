import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { StationShop } from '../../components/game/StationShop'
import type { Cart, ResourceCart, ResourcePrices, Resources, MaxResources } from '../../types'

// Helper to get button inside a testid container
function getButtonInContainer(testId: string) {
  const container = screen.getByTestId(testId)
  return within(container).getByRole('button')
}

describe('StationShop', () => {
  const defaultProps = {
    money: 200,
    ownedCarts: [] as Cart[],
    prices: { food: 4, fuel: 3, water: 2 } as ResourcePrices,
    shopCart: { food: 0, fuel: 0, water: 0 } as ResourceCart,
    maxResources: { food: 100, fuel: 200, water: 100, money: 1000 } as MaxResources,
    currentResources: { food: 50, fuel: 100, water: 50, money: 200 } as Resources,
    countryTheme: 'French Market',
    onPurchaseCart: vi.fn(),
    onUpdateShopCart: vi.fn(),
    onPurchaseResources: vi.fn(),
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the shop with title', () => {
      render(<StationShop {...defaultProps} />)
      expect(screen.getByText('🏪 Station Shop')).toBeInTheDocument()
    })

    it('should display the country theme', () => {
      render(<StationShop {...defaultProps} />)
      expect(screen.getByText('French Market')).toBeInTheDocument()
    })

    it('should display current money', () => {
      render(<StationShop {...defaultProps} />)
      expect(screen.getByText('$200')).toBeInTheDocument()
    })

    it('should display resource prices', () => {
      render(<StationShop {...defaultProps} />)
      expect(screen.getByText('$4/unit')).toBeInTheDocument() // food
      expect(screen.getByText('$3/unit')).toBeInTheDocument() // fuel
      expect(screen.getByText('$2/unit')).toBeInTheDocument() // water
    })

    it('should display current resource levels', () => {
      render(<StationShop {...defaultProps} />)
      // Both food and water show 50/100, fuel shows 100/200
      expect(screen.getAllByText('50/100')).toHaveLength(2) // food and water
      expect(screen.getByText('100/200')).toBeInTheDocument() // fuel
    })
  })

  describe('cart purchases', () => {
    it('should call onPurchaseCart when clicking Buy', () => {
      render(<StationShop {...defaultProps} />)
      const buyButton = screen.getAllByText('Buy')[0]
      fireEvent.click(buyButton)
      expect(defaultProps.onPurchaseCart).toHaveBeenCalled()
    })

    it('should show Owned for purchased carts', () => {
      const fuelCart: Cart = {
        id: 'fuel-cart',
        name: 'Fuel Cart',
        icon: '⛽',
        price: 100,
        effectType: 'maxFuel',
        effectValue: 50,
        description: 'Increases max fuel',
      }
      render(<StationShop {...defaultProps} ownedCarts={[fuelCart]} />)
      expect(screen.getByText('Owned')).toBeInTheDocument()
    })
  })

  describe('resource purchases', () => {
    it('should call onUpdateShopCart when clicking +', () => {
      render(<StationShop {...defaultProps} />)
      const incrementFood = getButtonInContainer('increment-food')
      fireEvent.click(incrementFood)
      expect(defaultProps.onUpdateShopCart).toHaveBeenCalledWith('food', 1)
    })

    it('should call onUpdateShopCart when clicking -', () => {
      render(<StationShop {...defaultProps} shopCart={{ food: 5, fuel: 0, water: 0 }} />)
      const decrementFood = getButtonInContainer('decrement-food')
      fireEvent.click(decrementFood)
      expect(defaultProps.onUpdateShopCart).toHaveBeenCalledWith('food', 4)
    })

    it('should disable decrement when quantity is 0', () => {
      render(<StationShop {...defaultProps} />)
      const decrementFood = getButtonInContainer('decrement-food')
      expect(decrementFood).toBeDisabled()
    })

    it('should disable increment when at max capacity', () => {
      render(<StationShop {...defaultProps} currentResources={{ food: 100, fuel: 100, water: 50, money: 200 }} />)
      const incrementFood = getButtonInContainer('increment-food')
      expect(incrementFood).toBeDisabled()
    })

    it('should display current cart quantities', () => {
      render(<StationShop {...defaultProps} shopCart={{ food: 10, fuel: 5, water: 3 }} />)
      expect(screen.getByTestId('quantity-food')).toHaveTextContent('10')
      expect(screen.getByTestId('quantity-fuel')).toHaveTextContent('5')
      expect(screen.getByTestId('quantity-water')).toHaveTextContent('3')
    })

    it('should calculate and display supplies total', () => {
      render(<StationShop {...defaultProps} shopCart={{ food: 10, fuel: 10, water: 10 }} />)
      // (10 * 4) + (10 * 3) + (10 * 2) = 40 + 30 + 20 = 90
      expect(screen.getByText('$90')).toBeInTheDocument()
    })
  })

  describe('purchase button', () => {
    it('should call onPurchaseResources when clicking Purchase Supplies', () => {
      render(<StationShop {...defaultProps} shopCart={{ food: 5, fuel: 0, water: 0 }} />)
      const purchaseBtn = getButtonInContainer('purchase-supplies-btn')
      fireEvent.click(purchaseBtn)
      expect(defaultProps.onPurchaseResources).toHaveBeenCalled()
    })

    it('should disable Purchase Supplies when cart is empty', () => {
      render(<StationShop {...defaultProps} />)
      const purchaseBtn = getButtonInContainer('purchase-supplies-btn')
      expect(purchaseBtn).toBeDisabled()
    })

    it('should disable Purchase Supplies when cannot afford', () => {
      render(<StationShop {...defaultProps} money={10} shopCart={{ food: 10, fuel: 10, water: 10 }} />)
      const purchaseBtn = getButtonInContainer('purchase-supplies-btn')
      expect(purchaseBtn).toBeDisabled()
    })

    it('should enable Purchase Supplies when can afford', () => {
      render(<StationShop {...defaultProps} shopCart={{ food: 5, fuel: 0, water: 0 }} />)
      const purchaseBtn = getButtonInContainer('purchase-supplies-btn')
      expect(purchaseBtn).not.toBeDisabled()
    })
  })

  describe('close functionality', () => {
    it('should call onClose when clicking Close button', () => {
      render(<StationShop {...defaultProps} />)
      const closeBtn = getButtonInContainer('close-shop-btn')
      fireEvent.click(closeBtn)
      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('should call onClose when clicking overlay', () => {
      render(<StationShop {...defaultProps} />)
      const overlay = screen.getByTestId('station-shop-overlay')
      fireEvent.click(overlay)
      expect(defaultProps.onClose).toHaveBeenCalled()
    })
  })
})
