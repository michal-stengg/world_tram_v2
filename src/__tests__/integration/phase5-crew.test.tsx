import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../../App'
import { useGameStore } from '../../stores/gameStore'
import { COOK_FOOD_PRODUCTION } from '../../data/constants'
import { captains } from '../../data/captains'
import { trains } from '../../data/trains'
import { startingCrew } from '../../data/crew'

// Mock the dice roll to get consistent results for testing
vi.mock('../../logic/dice', () => ({
  rollMovement: () => 5, // Fixed dice roll for predictable movement
}))

describe('Phase 5 Crew Management Integration', () => {
  // Reset store state before each test
  beforeEach(() => {
    vi.useFakeTimers()
    act(() => {
      useGameStore.setState({
        currentScreen: 'dashboard',
        selectedCaptain: captains[0], // Renji - engineering focused
        selectedTrain: trains[0], // Blitzzug - reliable German train
        resources: { food: 50, fuel: 100, water: 50, money: 200 },
        crew: JSON.parse(JSON.stringify(startingCrew)), // Deep copy to avoid mutation
        currentCountryIndex: 0,
        progressInCountry: 0,
        turnCount: 1,
        lastTurnResult: null,
        gameOverReason: null,
      })
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('cook role affects food production', () => {
    it('changing all crew to cooks increases food production per turn', () => {
      render(<App />)

      // Get initial state
      const initialState = useGameStore.getState()

      // Count initial cooks (should be 1 - Maria)
      const initialCookCount = initialState.crew.filter(c => c.role === 'cook').length
      expect(initialCookCount).toBe(1)

      // Change all crew members to cooks by clicking until they become cooks
      // Role cycle: engineer -> cook -> security -> free -> engineer
      // Tom (engineer): click once to get cook
      // Maria (cook): already cook
      // Jack (security): click 3 times (security -> free -> engineer -> cook)
      // Sam (free): click 2 times (free -> engineer -> cook)

      const tomMember = screen.getByTestId('crew-member-tom')
      fireEvent.click(tomMember) // engineer -> cook

      const jackMember = screen.getByTestId('crew-member-jack')
      fireEvent.click(jackMember) // security -> free
      fireEvent.click(jackMember) // free -> engineer
      fireEvent.click(jackMember) // engineer -> cook

      const samMember = screen.getByTestId('crew-member-sam')
      fireEvent.click(samMember) // free -> engineer
      fireEvent.click(samMember) // engineer -> cook

      // Verify all crew are now cooks
      const stateAfterRoleChange = useGameStore.getState()
      const allCooks = stateAfterRoleChange.crew.every(c => c.role === 'cook')
      expect(allCooks).toBe(true)

      // Execute a turn to see food production effect
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      // Get state after turn
      const stateAfterTurn = useGameStore.getState()
      const lastResult = stateAfterTurn.lastTurnResult

      expect(lastResult).not.toBeNull()

      // With 4 cooks, food production should be: 4 * COOK_FOOD_PRODUCTION + captain.stats.food
      // Renji has food stat of 2
      const expectedFoodProduction = 4 * COOK_FOOD_PRODUCTION + captains[0].stats.food
      expect(lastResult!.resourceChanges.food).toBeGreaterThan(0)

      // Food change = production - consumption
      // With 4 crew, consumption is 4 * 3 = 12
      // Production with 4 cooks = 4 * 5 + 2 = 22
      // Net change = 22 - 12 = 10
      expect(lastResult!.resourceChanges.food).toBe(expectedFoodProduction - 12)
    })

    it('reducing cooks decreases food production per turn', () => {
      render(<App />)

      // First, execute a turn with 1 cook to get baseline
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      const stateWithOneCook = useGameStore.getState()
      const foodChangeWithOneCook = stateWithOneCook.lastTurnResult!.resourceChanges.food

      // Now reset and change Maria from cook to something else
      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 100, water: 50, money: 200 },
          crew: JSON.parse(JSON.stringify(startingCrew)),
          lastTurnResult: null,
          turnCount: 1,
        })
      })

      // Change Maria from cook to security (cook -> security -> free -> engineer -> cook)
      const mariaMember = screen.getByTestId('crew-member-maria')
      fireEvent.click(mariaMember) // cook -> security

      // Verify Maria is now security
      const crewAfterChange = useGameStore.getState().crew
      const maria = crewAfterChange.find(c => c.id === 'maria')
      expect(maria?.role).toBe('security')

      // Execute turn with 0 cooks
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      const stateWithNoCooks = useGameStore.getState()
      const foodChangeWithNoCooks = stateWithNoCooks.lastTurnResult!.resourceChanges.food

      // With 0 cooks, food production is only captain's food stat (2)
      // Food change with 0 cooks should be less than with 1 cook
      expect(foodChangeWithNoCooks).toBeLessThan(foodChangeWithOneCook)
    })
  })

  describe('engineer role affects fuel consumption', () => {
    it('changing all crew to engineers decreases fuel consumption per turn', () => {
      render(<App />)

      // Execute a turn with default crew (1 engineer - Tom)
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      const stateWithOneEngineer = useGameStore.getState()
      const fuelChangeWithOneEngineer = stateWithOneEngineer.lastTurnResult!.resourceChanges.fuel

      // Reset state
      act(() => {
        useGameStore.setState({
          resources: { food: 50, fuel: 100, water: 50, money: 200 },
          crew: JSON.parse(JSON.stringify(startingCrew)),
          lastTurnResult: null,
          turnCount: 1,
        })
      })

      // Change all crew to engineers
      // Tom (engineer): already engineer
      // Maria (cook): cook -> security -> free -> engineer (3 clicks)
      // Jack (security): security -> free -> engineer (2 clicks)
      // Sam (free): free -> engineer (1 click)

      const mariaMember = screen.getByTestId('crew-member-maria')
      fireEvent.click(mariaMember) // cook -> security
      fireEvent.click(mariaMember) // security -> free
      fireEvent.click(mariaMember) // free -> engineer

      const jackMember = screen.getByTestId('crew-member-jack')
      fireEvent.click(jackMember) // security -> free
      fireEvent.click(jackMember) // free -> engineer

      const samMember = screen.getByTestId('crew-member-sam')
      fireEvent.click(samMember) // free -> engineer

      // Verify all crew are now engineers
      const stateAfterRoleChange = useGameStore.getState()
      const allEngineers = stateAfterRoleChange.crew.every(c => c.role === 'engineer')
      expect(allEngineers).toBe(true)

      // Execute turn with 4 engineers
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      const stateWithAllEngineers = useGameStore.getState()
      const fuelChangeWithAllEngineers = stateWithAllEngineers.lastTurnResult!.resourceChanges.fuel

      // With 4 engineers, fuel consumption should be reduced by 4 * ENGINEER_FUEL_SAVINGS
      // So fuel loss (negative number) should be smaller in magnitude (less negative)
      expect(fuelChangeWithAllEngineers).toBeGreaterThan(fuelChangeWithOneEngineer)

      // The fuel savings calculation:
      // BASE_FUEL_CONSUMPTION = 5, Blitzzug power = 3, efficiency = 1.0
      // Base consumption = 5
      // With 1 engineer: bonus = 2, consumption = 5 - 2 = 3, fuel change = -3
      // With 4 engineers: bonus = 8, consumption = 5 - 8 = -3 -> capped at 0, fuel change = 0
      // The difference is 3 (not 6, due to the floor at 0)
      expect(fuelChangeWithOneEngineer).toBe(-3) // 1 engineer: 5 - 2 = 3 fuel consumed
      expect(fuelChangeWithAllEngineers).toBeGreaterThanOrEqual(0) // 4 engineers: capped at 0 fuel consumed
      expect(Math.abs(fuelChangeWithAllEngineers)).toBe(0) // Verify it's actually 0 (handles -0 case)
    })

    it('removing engineers increases fuel consumption per turn', () => {
      render(<App />)

      // Change Tom from engineer to cook
      const tomMember = screen.getByTestId('crew-member-tom')
      fireEvent.click(tomMember) // engineer -> cook

      // Verify Tom is now cook
      const crewAfterChange = useGameStore.getState().crew
      const tom = crewAfterChange.find(c => c.id === 'tom')
      expect(tom?.role).toBe('cook')

      // Verify no engineers remain
      const engineerCount = crewAfterChange.filter(c => c.role === 'engineer').length
      expect(engineerCount).toBe(0)

      // Execute turn with 0 engineers
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      const stateWithNoEngineers = useGameStore.getState()
      const fuelChangeWithNoEngineers = stateWithNoEngineers.lastTurnResult!.resourceChanges.fuel

      // With 0 engineers, fuel consumption should be at base level (no savings)
      // Fuel change should be more negative than with engineers
      expect(fuelChangeWithNoEngineers).toBeLessThan(0)
    })
  })

  describe('crew roles persist between turns', () => {
    it('crew roles persist after executing a turn', () => {
      render(<App />)

      // Change Tom from engineer to security
      const tomMember = screen.getByTestId('crew-member-tom')
      fireEvent.click(tomMember) // engineer -> cook
      fireEvent.click(tomMember) // cook -> security

      // Verify Tom is now security
      let crew = useGameStore.getState().crew
      expect(crew.find(c => c.id === 'tom')?.role).toBe('security')

      // Execute a turn
      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      // Verify Tom is still security after the turn
      crew = useGameStore.getState().crew
      expect(crew.find(c => c.id === 'tom')?.role).toBe('security')
    })

    it('all crew roles persist after multiple turns', () => {
      render(<App />)

      // Set up specific roles
      // Tom: engineer -> cook
      // Maria: cook -> security
      // Jack: security -> free
      // Sam: free -> engineer

      fireEvent.click(screen.getByTestId('crew-member-tom')) // engineer -> cook
      fireEvent.click(screen.getByTestId('crew-member-maria')) // cook -> security
      fireEvent.click(screen.getByTestId('crew-member-jack')) // security -> free
      fireEvent.click(screen.getByTestId('crew-member-sam')) // free -> engineer

      // Verify roles are set correctly
      const crewBeforeTurns = useGameStore.getState().crew
      expect(crewBeforeTurns.find(c => c.id === 'tom')?.role).toBe('cook')
      expect(crewBeforeTurns.find(c => c.id === 'maria')?.role).toBe('security')
      expect(crewBeforeTurns.find(c => c.id === 'jack')?.role).toBe('free')
      expect(crewBeforeTurns.find(c => c.id === 'sam')?.role).toBe('engineer')

      // Execute multiple turns
      const goButton = screen.getByRole('button', { name: /go/i })

      // Dismiss turn result modal and execute next turn
      for (let i = 0; i < 3; i++) {
        fireEvent.click(goButton)
        act(() => { vi.advanceTimersByTime(1100) })

        // If a turn result modal appears, dismiss it
        const dismissButton = screen.queryByRole('button', { name: /continue/i })
        if (dismissButton) {
          fireEvent.click(dismissButton)
        }
      }

      // Verify all roles persisted
      const crewAfterTurns = useGameStore.getState().crew
      expect(crewAfterTurns.find(c => c.id === 'tom')?.role).toBe('cook')
      expect(crewAfterTurns.find(c => c.id === 'maria')?.role).toBe('security')
      expect(crewAfterTurns.find(c => c.id === 'jack')?.role).toBe('free')
      expect(crewAfterTurns.find(c => c.id === 'sam')?.role).toBe('engineer')
    })
  })

  describe('UI shows updated roles when cycling', () => {
    it('UI displays updated role label after clicking crew member', () => {
      render(<App />)

      // Verify initial role display for Tom
      const tomRoleLabel = screen.getByTestId('role-tom')
      expect(tomRoleLabel).toHaveTextContent('Engineer')

      // Click Tom to cycle role
      const tomMember = screen.getByTestId('crew-member-tom')
      fireEvent.click(tomMember)

      // Verify UI shows updated role
      expect(tomRoleLabel).toHaveTextContent('Cook')

      // Click again to continue cycling
      fireEvent.click(tomMember)
      expect(tomRoleLabel).toHaveTextContent('Security')

      fireEvent.click(tomMember)
      expect(tomRoleLabel).toHaveTextContent('Free')

      fireEvent.click(tomMember)
      expect(tomRoleLabel).toHaveTextContent('Engineer') // Back to original
    })

    it('UI updates all crew member roles independently', () => {
      render(<App />)

      // Verify initial roles
      expect(screen.getByTestId('role-tom')).toHaveTextContent('Engineer')
      expect(screen.getByTestId('role-maria')).toHaveTextContent('Cook')
      expect(screen.getByTestId('role-jack')).toHaveTextContent('Security')
      expect(screen.getByTestId('role-sam')).toHaveTextContent('Free')

      // Click each crew member once
      fireEvent.click(screen.getByTestId('crew-member-tom'))
      fireEvent.click(screen.getByTestId('crew-member-maria'))
      fireEvent.click(screen.getByTestId('crew-member-jack'))
      fireEvent.click(screen.getByTestId('crew-member-sam'))

      // Verify each role cycled independently
      expect(screen.getByTestId('role-tom')).toHaveTextContent('Cook')
      expect(screen.getByTestId('role-maria')).toHaveTextContent('Security')
      expect(screen.getByTestId('role-jack')).toHaveTextContent('Free')
      expect(screen.getByTestId('role-sam')).toHaveTextContent('Engineer')
    })
  })
})
