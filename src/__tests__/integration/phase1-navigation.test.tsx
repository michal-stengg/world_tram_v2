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

      // 5. Click GO button -> executes turn and shows turn result
      // First, set state to near victory so one turn wins
      act(() => {
        useGameStore.setState({
          currentCountryIndex: 9, // Already at final country
        })
      })

      const goButton = screen.getByRole('button', { name: /go/i })
      fireEvent.click(goButton)
      act(() => { vi.advanceTimersByTime(1100) })

      // Should navigate to victory screen after turn processing
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
