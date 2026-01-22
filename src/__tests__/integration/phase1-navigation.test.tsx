import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../../App'
import { useGameStore } from '../../stores/gameStore'

describe('Phase 1 Navigation Flow', () => {
  // Reset store state before each test
  beforeEach(() => {
    vi.useFakeTimers()
    act(() => {
      useGameStore.setState({ currentScreen: 'intro' })
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('happy path flow', () => {
    it('navigates through the complete game flow: Intro -> Captain -> Train -> Dashboard -> Victory -> New Game', () => {
      render(<App />)

      // 1. Start at IntroScreen
      expect(screen.getByText('WORLD TRAM')).toBeInTheDocument()
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument()

      // 2. Click START GAME -> should show CaptainSelectionScreen
      const startButton = screen.getByRole('button', { name: /start game/i })
      fireEvent.click(startButton)

      expect(screen.getByText('CHOOSE YOUR CAPTAIN')).toBeInTheDocument()
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()

      // 3. Click a captain card -> should show TrainSelectionScreen
      const captainCard = screen.getByLabelText('Select captain Renji')
      fireEvent.click(captainCard)

      expect(screen.getByText('CHOOSE YOUR TRAIN')).toBeInTheDocument()
      expect(screen.getByTestId('train-selection-screen')).toBeInTheDocument()

      // 4. Click a train card -> should show DashboardScreen
      const trainCard = screen.getByRole('button', { name: /select blitzzug train/i })
      fireEvent.click(trainCard)

      expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /go/i })).toBeInTheDocument()

      // 5. Simulate arriving at final destination (USA)
      // Victory is now triggered manually via FINISH button at the station modal
      // Set state to be at final destination with a station reward (simulating arrival)
      act(() => {
        useGameStore.setState({
          currentCountryIndex: 9, // At USA (final destination)
          lastTurnResult: {
            diceRoll: 6,
            movement: 8,
            resourceChanges: { food: -5, fuel: -10, water: -5, money: 0 },
            newResources: { food: 50, fuel: 100, water: 50, money: 200 },
            newCountryIndex: 9,
            newProgress: 0,
            arrivedAtCountry: true,
            gameStatus: 'playing',
            newTurnCount: 10,
            stationReward: { waterRefill: 30, moneyEarned: 50 },
            eventTriggered: false,
          },
        })
      })

      // Wait for state to propagate and modal to show
      act(() => { vi.advanceTimersByTime(100) })

      // At final destination (USA), the station modal should show FINISH button
      const finishButton = screen.getByRole('button', { name: /FINISH/i })
      fireEvent.click(finishButton)

      // Should navigate to victory screen after clicking FINISH
      expect(screen.getByText('VICTORY!')).toBeInTheDocument()
      expect(screen.getByTestId('victory-screen')).toBeInTheDocument()

      // 6. Click NEW GAME -> should show CaptainSelectionScreen
      const newGameButton = screen.getByRole('button', { name: /new game/i })
      fireEvent.click(newGameButton)

      expect(screen.getByText('CHOOSE YOUR CAPTAIN')).toBeInTheDocument()
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
    })
  })

  describe('back button navigation', () => {
    it('from CaptainSelection, click Back -> should show IntroScreen', () => {
      render(<App />)

      // Navigate to CaptainSelectionScreen
      const startButton = screen.getByRole('button', { name: /start game/i })
      fireEvent.click(startButton)
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()

      // Click Back button
      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)

      // Should be back at IntroScreen
      expect(screen.getByText('WORLD TRAM')).toBeInTheDocument()
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument()
    })

    it('from TrainSelection, click Back -> should show CaptainSelectionScreen', () => {
      render(<App />)

      // Navigate to CaptainSelectionScreen
      const startButton = screen.getByRole('button', { name: /start game/i })
      fireEvent.click(startButton)

      // Navigate to TrainSelectionScreen
      const captainCard = screen.getByLabelText('Select captain Luca')
      fireEvent.click(captainCard)
      expect(screen.getByTestId('train-selection-screen')).toBeInTheDocument()

      // Click Back button
      const backButton = screen.getByRole('button', { name: /back/i })
      fireEvent.click(backButton)

      // Should be back at CaptainSelectionScreen
      expect(screen.getByText('CHOOSE YOUR CAPTAIN')).toBeInTheDocument()
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
    })

    it('back buttons work correctly in sequence: Train -> Captain -> Intro', () => {
      render(<App />)

      // Navigate to TrainSelectionScreen
      fireEvent.click(screen.getByRole('button', { name: /start game/i }))
      fireEvent.click(screen.getByLabelText('Select captain Cooper'))
      expect(screen.getByTestId('train-selection-screen')).toBeInTheDocument()

      // Go back to CaptainSelectionScreen
      fireEvent.click(screen.getByRole('button', { name: /back/i }))
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()

      // Go back to IntroScreen
      fireEvent.click(screen.getByRole('button', { name: /back/i }))
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument()
    })
  })

  describe('game over flow', () => {
    it('from GameOverScreen, click TRY AGAIN -> should show CaptainSelectionScreen', () => {
      // Set the store to game over state directly
      act(() => {
        useGameStore.setState({ currentScreen: 'gameOver' })
      })

      render(<App />)

      // Verify we're at GameOverScreen
      expect(screen.getByText('GAME OVER')).toBeInTheDocument()
      expect(screen.getByTestId('game-over-screen')).toBeInTheDocument()

      // Click TRY AGAIN button
      const tryAgainButton = screen.getByRole('button', { name: /try again/i })
      fireEvent.click(tryAgainButton)

      // Should navigate to CaptainSelectionScreen
      expect(screen.getByText('CHOOSE YOUR CAPTAIN')).toBeInTheDocument()
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
    })
  })

  describe('navigation from end screens', () => {
    it('VictoryScreen NEW GAME navigates to captain selection, not intro', () => {
      act(() => {
        useGameStore.setState({ currentScreen: 'victory' })
      })

      render(<App />)

      expect(screen.getByText('VICTORY!')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /new game/i }))

      // Should go to captain selection, not intro
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('intro-screen')).not.toBeInTheDocument()
    })

    it('GameOverScreen TRY AGAIN navigates to captain selection, not intro', () => {
      act(() => {
        useGameStore.setState({ currentScreen: 'gameOver' })
      })

      render(<App />)

      expect(screen.getByText('GAME OVER')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /try again/i }))

      // Should go to captain selection, not intro
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('intro-screen')).not.toBeInTheDocument()
    })
  })
})
