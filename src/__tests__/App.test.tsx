import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import App from '../App'
import { useGameStore } from '../stores/gameStore'

describe('App', () => {
  // Reset store state before each test
  beforeEach(() => {
    useGameStore.setState({ currentScreen: 'intro' })
  })

  describe('screen routing', () => {
    it('renders IntroScreen by default', () => {
      render(<App />)
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument()
    })

    it('renders CaptainSelectionScreen when currentScreen is captainSelect', () => {
      useGameStore.setState({ currentScreen: 'captainSelect' })
      render(<App />)
      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
    })

    it('renders TrainSelectionScreen when currentScreen is trainSelect', () => {
      useGameStore.setState({ currentScreen: 'trainSelect' })
      render(<App />)
      expect(screen.getByTestId('train-selection-screen')).toBeInTheDocument()
    })

    it('renders DashboardScreen when currentScreen is dashboard', () => {
      useGameStore.setState({ currentScreen: 'dashboard' })
      render(<App />)
      expect(screen.getByTestId('dashboard-screen')).toBeInTheDocument()
    })

    it('renders VictoryScreen when currentScreen is victory', () => {
      useGameStore.setState({ currentScreen: 'victory' })
      render(<App />)
      expect(screen.getByTestId('victory-screen')).toBeInTheDocument()
    })

    it('renders GameOverScreen when currentScreen is gameOver', () => {
      useGameStore.setState({ currentScreen: 'gameOver' })
      render(<App />)
      expect(screen.getByTestId('game-over-screen')).toBeInTheDocument()
    })
  })

  describe('screen transitions', () => {
    it('updates when store state changes', () => {
      render(<App />)
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument()

      // Change store state wrapped in act
      act(() => {
        useGameStore.setState({ currentScreen: 'captainSelect' })
      })

      expect(screen.getByTestId('captain-selection-screen')).toBeInTheDocument()
      expect(screen.queryByTestId('intro-screen')).not.toBeInTheDocument()
    })
  })
})
