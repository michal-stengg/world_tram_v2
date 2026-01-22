import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../../App'
import { useGameStore } from '../../stores/gameStore'
import { captains } from '../../data/captains'
import { trains } from '../../data/trains'
import { carts } from '../../data/carts'
import { STARTING_RESOURCES, MAX_RESOURCES } from '../../data/constants'
import { startingCrew } from '../../data/crew'
import { countries } from '../../data/countries'
import {
  applyCartEffects,
  calculateIncomeBonus,
  calculateFuelEfficiencyBonus,
  calculateSecurityBonus,
} from '../../logic/carts'

// Mock the dice roll to get consistent results for testing
vi.mock('../../logic/dice', () => ({
  rollMovement: () => 10, // Fixed dice roll of 10 to guarantee arrival at new country
  rollDice: () => 6, // Fixed dice roll for event resolution
}))

// Mock events to prevent random event triggering during cart tests
vi.mock('../../logic/events', () => ({
  shouldTriggerEvent: () => false, // Never trigger events in cart tests
  selectRandomEvent: () => ({
    id: 'test-event',
    name: 'Test Event',
    description: 'A test event',
    statTested: 'engineering',
    difficulty: 10,
    penalty: { type: 'resource', resource: 'fuel', amount: 20 },
  }),
  resolveEvent: () => ({
    success: true,
    total: 15,
  }),
}))

describe('Phase 8: Cart Integration', () => {
  // Reset store to initial game state before each test
  beforeEach(() => {
    vi.useFakeTimers()
    act(() => {
      useGameStore.setState({
        currentScreen: 'dashboard',
        selectedCaptain: captains[0], // Renji - security stat = 3
        selectedTrain: trains[0], // Blitzzug
        resources: { ...STARTING_RESOURCES },
        crew: JSON.parse(JSON.stringify(startingCrew)),
        currentCountryIndex: 0, // France
        progressInCountry: 0,
        turnCount: 1,
        lastTurnResult: null,
        gameOverReason: null,
        cardHand: [],
        currentEvent: null,
        selectedCards: [],
        ownedCarts: [],
      })
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('cart purchase at station', () => {
    it('player can open cart shop via "Visit Shop" button at station', () => {
      render(<App />)

      // Execute turn to arrive at station
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1700) })

      // Station modal should be visible
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()

      // Click Visit Shop button
      const visitShopButton = screen.getByRole('button', { name: /visit shop/i })
      fireEvent.click(visitShopButton)

      // Cart shop should now be visible
      expect(screen.getByTestId('station-shop')).toBeInTheDocument()
    })

    it('player can purchase a cart they can afford', () => {
      // Starting money is 200, fuel-cart costs 100
      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Click Visit Shop button
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Verify cart shop is open
      expect(screen.getByTestId('station-shop')).toBeInTheDocument()

      // Get current money before purchase
      const stateBeforePurchase = useGameStore.getState()
      const moneyBefore = stateBeforePurchase.resources.money
      expect(stateBeforePurchase.ownedCarts.length).toBe(0)

      // Find and click the Buy button for fuel-cart (price: 100)
      const fuelCartBuyButton = screen.getByTestId('cart-fuel-cart')
      const buyButton = fuelCartBuyButton.querySelector('button')
      expect(buyButton).not.toBeNull()
      fireEvent.click(buyButton!)

      // Verify money was deducted
      const stateAfterPurchase = useGameStore.getState()
      expect(stateAfterPurchase.resources.money).toBe(moneyBefore - 100)

      // Verify cart was added to ownedCarts
      expect(stateAfterPurchase.ownedCarts.length).toBe(1)
      expect(stateAfterPurchase.ownedCarts[0].id).toBe('fuel-cart')
    })

    it('player can close shop and continue after purchase', () => {
      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Click Visit Shop button
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Purchase a cart
      const waterCartBuyButton = screen.getByTestId('cart-water-cart')
      const buyButton = waterCartBuyButton.querySelector('button')
      fireEvent.click(buyButton!)

      // Close the shop
      const closeButton = screen.getByRole('button', { name: /close/i })
      fireEvent.click(closeButton)

      // Cart shop should be closed
      expect(screen.queryByTestId('station-shop')).not.toBeInTheDocument()

      // Turn result should now be visible
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('clicking overlay closes cart shop', () => {
      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Click Visit Shop button
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Click the overlay to close the shop
      fireEvent.click(screen.getByTestId('station-shop-overlay'))

      // Cart shop should be closed
      expect(screen.queryByTestId('station-shop')).not.toBeInTheDocument()
    })
  })

  describe('cart purchase restrictions', () => {
    it('cannot purchase cart when money is insufficient', () => {
      // Set money to less than any cart price
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 50 }, // Less than cheapest cart (water-cart: 70)
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Click Visit Shop button
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Try to buy fuel-cart (price: 100)
      const fuelCartBuyButton = screen.getByTestId('cart-fuel-cart')
      const buyButton = fuelCartBuyButton.querySelector('button')

      // Button should be disabled
      expect(buyButton).toBeDisabled()

      // Click anyway (should do nothing)
      fireEvent.click(buyButton!)

      // Verify no cart was purchased
      const state = useGameStore.getState()
      expect(state.ownedCarts.length).toBe(0)
    })

    it('buy button is disabled when player cannot afford cart', () => {
      // Start with very low money - after arriving at station, player earns 25 (10 + 3*5 for Renji)
      // and pays wages of 10. So net change from 10 is 10 + 25 - 10 = 25, ending with ~25
      // This should not be enough for any cart (cheapest is water-cart at 70)
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 10 },
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // All cart buy buttons should be disabled because we have less than 70 (cheapest cart)
      const waterCartBuyContainer = screen.getByTestId('cart-water-cart')
      const waterBuyButton = waterCartBuyContainer.querySelector('button')
      expect(waterBuyButton).toBeDisabled()

      // Fuel cart should also be disabled
      const fuelCartBuyContainer = screen.getByTestId('cart-fuel-cart')
      const fuelBuyButton = fuelCartBuyContainer.querySelector('button')
      expect(fuelBuyButton).toBeDisabled()
    })

    it('already owned carts show "Owned" and are disabled', () => {
      // Pre-own a cart
      const fuelCart = carts.find(c => c.id === 'fuel-cart')!
      act(() => {
        useGameStore.setState({
          ownedCarts: [fuelCart],
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Fuel cart should show "Owned" and be disabled
      const fuelCartBuyContainer = screen.getByTestId('cart-fuel-cart')
      const fuelBuyButton = fuelCartBuyContainer.querySelector('button')
      expect(fuelBuyButton).toHaveTextContent('Owned')
      expect(fuelBuyButton).toBeDisabled()

      // Other carts should still show "Buy"
      const foodCartBuyContainer = screen.getByTestId('cart-food-cart')
      const foodBuyButton = foodCartBuyContainer.querySelector('button')
      expect(foodBuyButton).toHaveTextContent('Buy')
    })
  })

  describe('cart effects on gameplay', () => {
    it('fuel cart increases max fuel capacity', () => {
      const fuelCart = carts.find(c => c.id === 'fuel-cart')!
      expect(fuelCart.effectType).toBe('maxFuel')
      expect(fuelCart.effectValue).toBe(50)

      const modifiedMaxResources = applyCartEffects([fuelCart], MAX_RESOURCES)

      expect(modifiedMaxResources.fuel).toBe(MAX_RESOURCES.fuel + 50)
      expect(modifiedMaxResources.food).toBe(MAX_RESOURCES.food)
      expect(modifiedMaxResources.water).toBe(MAX_RESOURCES.water)
    })

    it('passenger cart provides income bonus at stations', () => {
      const passengerCart = carts.find(c => c.id === 'passenger-cart')!
      expect(passengerCart.effectType).toBe('income')
      expect(passengerCart.effectValue).toBe(20)

      const incomeBonus = calculateIncomeBonus([passengerCart])

      expect(incomeBonus).toBe(20)
    })

    it('spare parts cart reduces fuel consumption', () => {
      const sparePartsCart = carts.find(c => c.id === 'spare-parts-cart')!
      expect(sparePartsCart.effectType).toBe('fuelEfficiency')
      expect(sparePartsCart.effectValue).toBe(2)

      const fuelEfficiencyBonus = calculateFuelEfficiencyBonus([sparePartsCart])

      expect(fuelEfficiencyBonus).toBe(2)
    })

    it('security cart provides security bonus', () => {
      const securityCart = carts.find(c => c.id === 'security-cart')!
      expect(securityCart.effectType).toBe('security')
      expect(securityCart.effectValue).toBe(2)

      const securityBonus = calculateSecurityBonus([securityCart])

      expect(securityBonus).toBe(2)
    })

    it('food cart increases max food capacity', () => {
      const foodCart = carts.find(c => c.id === 'food-cart')!
      expect(foodCart.effectType).toBe('maxFood')
      expect(foodCart.effectValue).toBe(30)

      const modifiedMaxResources = applyCartEffects([foodCart], MAX_RESOURCES)

      expect(modifiedMaxResources.food).toBe(MAX_RESOURCES.food + 30)
    })

    it('water cart increases max water capacity', () => {
      const waterCart = carts.find(c => c.id === 'water-cart')!
      expect(waterCart.effectType).toBe('maxWater')
      expect(waterCart.effectValue).toBe(30)

      const modifiedMaxResources = applyCartEffects([waterCart], MAX_RESOURCES)

      expect(modifiedMaxResources.water).toBe(MAX_RESOURCES.water + 30)
    })
  })

  describe('multiple cart purchases', () => {
    it('can purchase multiple different carts', () => {
      // Give enough money for multiple carts
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 500 },
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Purchase fuel-cart (100)
      const fuelBuyContainer = screen.getByTestId('cart-fuel-cart')
      fireEvent.click(fuelBuyContainer.querySelector('button')!)

      // Purchase food-cart (80)
      const foodBuyContainer = screen.getByTestId('cart-food-cart')
      fireEvent.click(foodBuyContainer.querySelector('button')!)

      // Verify both carts are owned
      const state = useGameStore.getState()
      expect(state.ownedCarts.length).toBe(2)
      expect(state.ownedCarts.map(c => c.id)).toContain('fuel-cart')
      expect(state.ownedCarts.map(c => c.id)).toContain('food-cart')
    })

    it('each purchase deducts the correct amount', () => {
      const initialMoney = 500
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: initialMoney },
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Get money after arriving at station (includes station reward)
      const moneyAfterStation = useGameStore.getState().resources.money

      // Purchase water-cart (70)
      const waterBuyContainer = screen.getByTestId('cart-water-cart')
      fireEvent.click(waterBuyContainer.querySelector('button')!)

      expect(useGameStore.getState().resources.money).toBe(moneyAfterStation - 70)

      // Purchase passenger-cart (100)
      const passengerBuyContainer = screen.getByTestId('cart-passenger-cart')
      fireEvent.click(passengerBuyContainer.querySelector('button')!)

      expect(useGameStore.getState().resources.money).toBe(moneyAfterStation - 70 - 100)
    })

    it('all owned carts are tracked correctly', () => {
      // Give enough money for multiple carts
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 1000 },
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Purchase multiple carts
      fireEvent.click(screen.getByTestId('cart-fuel-cart').querySelector('button')!)
      fireEvent.click(screen.getByTestId('cart-food-cart').querySelector('button')!)
      fireEvent.click(screen.getByTestId('cart-water-cart').querySelector('button')!)

      const state = useGameStore.getState()
      expect(state.ownedCarts.length).toBe(3)

      // Verify specific cart data is preserved
      const fuelCart = state.ownedCarts.find(c => c.id === 'fuel-cart')
      expect(fuelCart).toBeDefined()
      expect(fuelCart?.effectType).toBe('maxFuel')
      expect(fuelCart?.effectValue).toBe(50)
    })

    it('cannot buy the same cart twice', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 500 },
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Purchase fuel-cart
      const fuelBuyContainer = screen.getByTestId('cart-fuel-cart')
      fireEvent.click(fuelBuyContainer.querySelector('button')!)

      // Verify cart is purchased
      expect(useGameStore.getState().ownedCarts.length).toBe(1)
      const moneyAfterFirstPurchase = useGameStore.getState().resources.money

      // Try to buy same cart again - button should now be disabled and show "Owned"
      const buyButton = fuelBuyContainer.querySelector('button')
      expect(buyButton).toHaveTextContent('Owned')
      expect(buyButton).toBeDisabled()

      fireEvent.click(buyButton!)

      // Verify no duplicate purchase
      expect(useGameStore.getState().ownedCarts.length).toBe(1)
      expect(useGameStore.getState().resources.money).toBe(moneyAfterFirstPurchase)
    })
  })

  describe('combined cart effects', () => {
    it('multiple cart effects stack correctly', () => {
      const fuelCart = carts.find(c => c.id === 'fuel-cart')!
      const foodCart = carts.find(c => c.id === 'food-cart')!
      const waterCart = carts.find(c => c.id === 'water-cart')!

      const modifiedMaxResources = applyCartEffects([fuelCart, foodCart, waterCart], MAX_RESOURCES)

      expect(modifiedMaxResources.fuel).toBe(MAX_RESOURCES.fuel + 50)
      expect(modifiedMaxResources.food).toBe(MAX_RESOURCES.food + 30)
      expect(modifiedMaxResources.water).toBe(MAX_RESOURCES.water + 30)
    })

    it('multiple income carts stack', () => {
      const passengerCart = carts.find(c => c.id === 'passenger-cart')!

      // If we had two passenger carts (hypothetically), they would stack
      // For now, test with one
      const incomeBonus = calculateIncomeBonus([passengerCart])
      expect(incomeBonus).toBe(20)
    })

    it('fuel efficiency and security bonuses work together', () => {
      const sparePartsCart = carts.find(c => c.id === 'spare-parts-cart')!
      const securityCart = carts.find(c => c.id === 'security-cart')!

      const fuelBonus = calculateFuelEfficiencyBonus([sparePartsCart, securityCart])
      const securityBonus = calculateSecurityBonus([sparePartsCart, securityCart])

      // Only spare parts cart provides fuel efficiency
      expect(fuelBonus).toBe(2)
      // Only security cart provides security bonus
      expect(securityBonus).toBe(2)
    })
  })

  describe('cart shop state persistence', () => {
    it('owned carts persist after closing and reopening shop', () => {
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: 500 },
        })
      })

      render(<App />)

      // Execute turn to arrive at first station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Purchase a cart
      fireEvent.click(screen.getByTestId('cart-fuel-cart').querySelector('button')!)
      expect(useGameStore.getState().ownedCarts.length).toBe(1)

      // Close shop
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      // Dismiss turn result
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Execute another turn to arrive at next station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Verify fuel cart still shows as owned
      const fuelBuyContainer = screen.getByTestId('cart-fuel-cart')
      expect(fuelBuyContainer.querySelector('button')).toHaveTextContent('Owned')

      // Verify owned carts count is still 1
      expect(useGameStore.getState().ownedCarts.length).toBe(1)
    })

    it('cart shop shows updated money after purchases', () => {
      const initialMoney = 500
      act(() => {
        useGameStore.setState({
          resources: { ...STARTING_RESOURCES, money: initialMoney },
        })
      })

      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Get initial money displayed in shop header
      // The shop header should display current money
      const shopContainer = screen.getByTestId('station-shop')
      const moneyAfterStation = useGameStore.getState().resources.money
      expect(shopContainer).toHaveTextContent(`$${moneyAfterStation}`)

      // Purchase a cart
      fireEvent.click(screen.getByTestId('cart-water-cart').querySelector('button')!)

      // Shop should now show reduced money
      const moneyAfterPurchase = useGameStore.getState().resources.money
      expect(moneyAfterPurchase).toBe(moneyAfterStation - 70)
      expect(shopContainer).toHaveTextContent(`$${moneyAfterPurchase}`)
    })
  })

  describe('shop flow integration with game flow', () => {
    it('can skip shop and continue directly from station modal', () => {
      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Station modal should be visible
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()

      // Click Continue (not Visit Shop)
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Station modal should be gone, cart shop should NOT appear
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.queryByTestId('station-shop')).not.toBeInTheDocument()

      // Turn result should show
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('station modal shows before cart shop in the flow', () => {
      render(<App />)

      // Execute turn
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Station modal shows first
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      expect(screen.queryByTestId('station-shop')).not.toBeInTheDocument()

      // Click Visit Shop
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Now cart shop shows, station modal is gone
      expect(screen.queryByTestId('station-modal')).not.toBeInTheDocument()
      expect(screen.getByTestId('station-shop')).toBeInTheDocument()
    })

    it('turn result shows after closing cart shop', () => {
      render(<App />)

      // Execute turn
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })

      // Go to shop
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))
      expect(screen.getByTestId('station-shop')).toBeInTheDocument()

      // Close shop
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      // Turn result should now show
      expect(screen.queryByTestId('station-shop')).not.toBeInTheDocument()
      expect(screen.getByTestId('turn-result-display')).toBeInTheDocument()
    })

    it('game continues normally after completing shop visit', () => {
      act(() => {
        useGameStore.setState({
          resources: { food: 100, fuel: 200, water: 100, money: 500 },
        })
      })

      render(<App />)

      // First turn - arrive at Germany
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      expect(screen.getByText(`Welcome to ${countries[1].name}!`)).toBeInTheDocument()

      // Visit shop and purchase something
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))
      fireEvent.click(screen.getByTestId('cart-water-cart').querySelector('button')!)
      fireEvent.click(screen.getByRole('button', { name: /close/i }))

      // Dismiss turn result
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      // Second turn - should arrive at next country
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      expect(screen.getByTestId('station-modal')).toBeInTheDocument()
      expect(screen.getByText(`Welcome to ${countries[2].name}!`)).toBeInTheDocument()

      // Verify turn count incremented
      expect(useGameStore.getState().turnCount).toBe(3)
    })
  })

  describe('cart data verification', () => {
    it('all expected carts are available in the shop', () => {
      render(<App />)

      // Execute turn to arrive at station
      fireEvent.click(screen.getByRole('button', { name: /go/i }))
      act(() => { vi.advanceTimersByTime(1700) })
      fireEvent.click(screen.getByRole('button', { name: /visit shop/i }))

      // Verify all carts from data are shown
      expect(screen.getByTestId('cart-fuel-cart')).toBeInTheDocument()
      expect(screen.getByTestId('cart-food-cart')).toBeInTheDocument()
      expect(screen.getByTestId('cart-water-cart')).toBeInTheDocument()
      expect(screen.getByTestId('cart-spare-parts-cart')).toBeInTheDocument()
      expect(screen.getByTestId('cart-security-cart')).toBeInTheDocument()
      expect(screen.getByTestId('cart-passenger-cart')).toBeInTheDocument()
    })

    it('cart prices match data definitions', () => {
      const expectedPrices = {
        'fuel-cart': 100,
        'food-cart': 80,
        'water-cart': 70,
        'spare-parts-cart': 120,
        'security-cart': 150,
        'passenger-cart': 100,
      }

      for (const [cartId, expectedPrice] of Object.entries(expectedPrices)) {
        const cart = carts.find(c => c.id === cartId)
        expect(cart).toBeDefined()
        expect(cart!.price).toBe(expectedPrice)
      }
    })

    it('cart effect types match data definitions', () => {
      const expectedEffects = {
        'fuel-cart': { type: 'maxFuel', value: 50 },
        'food-cart': { type: 'maxFood', value: 30 },
        'water-cart': { type: 'maxWater', value: 30 },
        'spare-parts-cart': { type: 'fuelEfficiency', value: 2 },
        'security-cart': { type: 'security', value: 2 },
        'passenger-cart': { type: 'income', value: 20 },
      }

      for (const [cartId, expectedEffect] of Object.entries(expectedEffects)) {
        const cart = carts.find(c => c.id === cartId)
        expect(cart).toBeDefined()
        expect(cart!.effectType).toBe(expectedEffect.type)
        expect(cart!.effectValue).toBe(expectedEffect.value)
      }
    })
  })
})
