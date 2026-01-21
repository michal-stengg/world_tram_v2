import { carts } from '../../data/carts'
import { canPurchaseCart } from '../../logic/carts'
import type { Cart } from '../../types'
import { PixelButton } from '../common/PixelButton'

interface CartShopProps {
  money: number
  ownedCarts: Cart[]
  onPurchase: (cartId: string) => void
  onClose: () => void
}

export function CartShop({ money, ownedCarts, onPurchase, onClose }: CartShopProps) {
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
    minWidth: '400px',
    maxHeight: '80vh',
    overflow: 'auto',
    zIndex: 1000,
  }

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid var(--color-gold, #F7B538)',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--color-gold, #F7B538)',
  }

  const moneyStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    color: 'var(--color-money, #f1c40f)',
    fontWeight: 'bold',
  }

  const cartListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  }

  const cartItemStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  }

  const cartInfoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
  }

  const cartNameRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const cartIconStyle: React.CSSProperties = {
    fontSize: '1.5rem',
  }

  const cartNameStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#ffffff',
  }

  const cartPriceStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: 'var(--color-money, #f1c40f)',
    fontWeight: 'bold',
  }

  const cartDescriptionStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: 'rgba(255, 255, 255, 0.7)',
  }

  const isOwned = (cartId: string): boolean => {
    return ownedCarts.some(c => c.id === cartId)
  }

  const handleBuyClick = (cart: Cart) => {
    if (!isOwned(cart.id) && canPurchaseCart(cart, money)) {
      onPurchase(cart.id)
    }
  }

  return (
    <>
      <div
        style={overlayStyle}
        onClick={onClose}
        data-testid="cart-shop-overlay"
      />
      <div style={containerStyle} data-testid="cart-shop">
        <div style={headerStyle}>
          <span style={titleStyle}>Cart Shop</span>
          <span style={moneyStyle}>${money}</span>
        </div>

        <div style={cartListStyle}>
          {carts.map((cart) => {
            const owned = isOwned(cart.id)
            const canAfford = canPurchaseCart(cart, money)
            const disabled = owned || !canAfford

            return (
              <div
                key={cart.id}
                style={cartItemStyle}
                data-testid={`cart-item-${cart.id}`}
              >
                <div style={cartInfoStyle}>
                  <div style={cartNameRowStyle}>
                    <span style={cartIconStyle}>{cart.icon}</span>
                    <span style={cartNameStyle}>{cart.name}</span>
                    <span style={cartPriceStyle}>${cart.price}</span>
                  </div>
                  <span style={cartDescriptionStyle}>{cart.description}</span>
                </div>
                <div data-testid={`buy-button-${cart.id}`}>
                  <PixelButton
                    onClick={() => handleBuyClick(cart)}
                    disabled={disabled}
                    size="small"
                    variant={owned ? 'secondary' : 'gold'}
                  >
                    {owned ? 'Owned' : 'Buy'}
                  </PixelButton>
                </div>
              </div>
            )
          })}
        </div>

        <PixelButton onClick={onClose} variant="secondary">
          Close
        </PixelButton>
      </div>
    </>
  )
}
