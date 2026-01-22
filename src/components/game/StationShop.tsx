import { useState } from 'react'
import { carts } from '../../data/carts'
import { canPurchaseCart } from '../../logic/carts'
import { calculateCartTotal } from '../../logic/shop'
import type { Cart, ResourceCart, ResourcePrices, Resources, MaxResources } from '../../types'
import { PixelButton } from '../common/PixelButton'

interface StationShopProps {
  money: number
  ownedCarts: Cart[]
  prices: ResourcePrices
  shopCart: ResourceCart
  maxResources: MaxResources
  currentResources: Resources
  countryTheme: string
  onPurchaseCart: (cartId: string) => void
  onUpdateShopCart: (resource: 'food' | 'fuel' | 'water', amount: number) => void
  onPurchaseResources: () => void
  onClose: () => void
}

export function StationShop({
  money,
  ownedCarts,
  prices,
  shopCart,
  maxResources,
  currentResources,
  countryTheme,
  onPurchaseCart,
  onUpdateShopCart,
  onPurchaseResources,
  onClose,
}: StationShopProps) {
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false)
  const [failedCartPrice, setFailedCartPrice] = useState(0)

  const resourceTotal = calculateCartTotal(shopCart, prices)
  const canAffordResources = resourceTotal <= money && resourceTotal > 0

  const isCartOwned = (cartId: string) => ownedCarts.some(c => c.id === cartId)
  const canAffordCart = (cart: Cart) => canPurchaseCart(cart, money)

  const handleCartPurchase = (cart: Cart) => {
    if (!canAffordCart(cart)) {
      setFailedCartPrice(cart.price)
      setShowInsufficientFunds(true)
      return
    }
    onPurchaseCart(cart.id)
  }

  // Calculate max purchasable for each resource
  const getMaxPurchasable = (resource: 'food' | 'fuel' | 'water') => {
    const currentAmount = currentResources[resource]
    const maxAmount = maxResources[resource]
    const currentInCart = shopCart[resource]
    return maxAmount - currentAmount - currentInCart
  }

  const handleIncrement = (resource: 'food' | 'fuel' | 'water') => {
    const maxMore = getMaxPurchasable(resource)
    if (maxMore > 0) {
      onUpdateShopCart(resource, shopCart[resource] + 1)
    }
  }

  const handleDecrement = (resource: 'food' | 'fuel' | 'water') => {
    if (shopCart[resource] > 0) {
      onUpdateShopCart(resource, shopCart[resource] - 1)
    }
  }

  // Style definitions
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  }

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    border: '4px solid var(--color-gold, #F7B538)',
    borderRadius: '8px',
    padding: '1.5rem',
    minWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    zIndex: 1000,
  }

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid var(--color-gold, #F7B538)',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--color-gold, #F7B538)',
  }

  const themeStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: '0.25rem',
  }

  const columnsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  }

  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }

  const columnHeaderStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  }

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  }

  const itemInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  }

  const itemNameStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontWeight: 'bold',
  }

  const priceStyle: React.CSSProperties = {
    color: 'var(--color-money, #f1c40f)',
    fontSize: '0.9rem',
  }

  const resourceControlStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const quantityStyle: React.CSSProperties = {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
  }

  const currentAmountStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
  }

  const footerStyle: React.CSSProperties = {
    borderTop: '2px solid var(--color-gold, #F7B538)',
    paddingTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  }

  const totalRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    fontSize: '1rem',
    width: '100%',
  }

  const moneyStyle: React.CSSProperties = {
    color: 'var(--color-money, #f1c40f)',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  }

  const buttonRowStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1rem',
    marginTop: '0.5rem',
  }

  return (
    <>
      <div style={overlayStyle} onClick={onClose} data-testid="station-shop-overlay" />
      <div style={containerStyle} data-testid="station-shop">
        <div style={headerStyle}>
          <div style={titleStyle}>🏪 Station Shop</div>
          <div style={themeStyle}>{countryTheme}</div>
        </div>

        <div style={columnsStyle}>
          {/* Left Column - Cart Upgrades */}
          <div style={columnStyle}>
            <div style={columnHeaderStyle}>UPGRADES</div>
            {carts.map((cart) => {
              const owned = isCartOwned(cart.id)
              const canBuy = canAffordCart(cart) && !owned

              return (
                <div key={cart.id} style={itemStyle} data-testid={`cart-${cart.id}`}>
                  <div style={itemInfoStyle}>
                    <div style={itemNameStyle}>
                      <span>{cart.icon}</span>
                      <span>{cart.name}</span>
                    </div>
                    <div style={priceStyle}>${cart.price}</div>
                  </div>
                  <PixelButton
                    onClick={() => handleCartPurchase(cart)}
                    disabled={owned}
                    size="small"
                    variant={owned ? 'secondary' : canBuy ? 'gold' : 'secondary'}
                  >
                    {owned ? 'Owned' : 'Buy'}
                  </PixelButton>
                </div>
              )
            })}
          </div>

          {/* Right Column - Resource Supplies */}
          <div style={columnStyle}>
            <div style={columnHeaderStyle}>SUPPLIES</div>
            {(['food', 'fuel', 'water'] as const).map((resource) => {
              const icons = { food: '🍞', fuel: '⛽', water: '💧' }
              const labels = { food: 'Food', fuel: 'Fuel', water: 'Water' }
              const current = currentResources[resource]
              const max = maxResources[resource]
              const inCart = shopCart[resource]
              const canIncrement = current + inCart < max

              return (
                <div key={resource} style={itemStyle} data-testid={`resource-${resource}`}>
                  <div style={itemInfoStyle}>
                    <div style={itemNameStyle}>
                      <span>{icons[resource]}</span>
                      <span>{labels[resource]}</span>
                    </div>
                    <div style={priceStyle}>${prices[resource]}/unit</div>
                    <div style={currentAmountStyle}>{current}/{max}</div>
                  </div>
                  <div style={resourceControlStyle}>
                    <div data-testid={`decrement-${resource}`}>
                      <PixelButton
                        onClick={() => handleDecrement(resource)}
                        disabled={inCart === 0}
                        size="small"
                        variant="secondary"
                      >
                        -
                      </PixelButton>
                    </div>
                    <span style={quantityStyle} data-testid={`quantity-${resource}`}>{inCart}</span>
                    <div data-testid={`increment-${resource}`}>
                      <PixelButton
                        onClick={() => handleIncrement(resource)}
                        disabled={!canIncrement}
                        size="small"
                        variant="secondary"
                      >
                        +
                      </PixelButton>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={footerStyle}>
          <div style={totalRowStyle}>
            <span>Supplies Total: <span style={moneyStyle}>${resourceTotal}</span></span>
            <span>💰 You have: <span style={moneyStyle}>${money}</span></span>
          </div>
          <div style={buttonRowStyle}>
            <div data-testid="purchase-supplies-btn">
              <PixelButton
                onClick={onPurchaseResources}
                disabled={!canAffordResources}
                variant="gold"
              >
                Purchase Supplies
              </PixelButton>
            </div>
            <div data-testid="close-shop-btn">
              <PixelButton onClick={onClose} variant="secondary">
                Close
              </PixelButton>
            </div>
          </div>
        </div>

        {/* Insufficient Funds Popup */}
        {showInsufficientFunds && (
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.98)',
              border: '4px solid #e74c3c',
              borderRadius: '12px',
              padding: '2rem',
              zIndex: 1100,
              textAlign: 'center',
              minWidth: '300px',
            }}
            data-testid="insufficient-funds-popup"
          >
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
              🙅‍♂️
            </div>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
              💸💸💸
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#e74c3c',
              marginBottom: '1rem',
            }}>
              Insufficient Funds!
            </div>
            <div style={{ marginBottom: '1rem', color: '#aaa' }}>
              You need <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>${failedCartPrice}</span>
              <br />
              You have <span style={{ color: '#f1c40f', fontWeight: 'bold' }}>${money}</span>
            </div>
            <PixelButton
              onClick={() => setShowInsufficientFunds(false)}
              variant="secondary"
            >
              OK
            </PixelButton>
          </div>
        )}
      </div>
    </>
  )
}
