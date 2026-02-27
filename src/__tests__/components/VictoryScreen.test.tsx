import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { VictoryScreen } from '../../components/screens/VictoryScreen'
import { useGameStore } from '../../stores/gameStore'
import * as leaderboardLogic from '../../logic/leaderboard'

// Mock the game store
vi.mock('../../stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

// Mock the leaderboard logic
vi.mock('../../logic/leaderboard', () => ({
  calculateScore: vi.fn(),
  loadLeaderboard: vi.fn(),
  checkQualification: vi.fn(),
  addLeaderboardEntry: vi.fn(),
  formatLeaderboardDate: vi.fn((date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }),
}))

describe('VictoryScreen', () => {
  const mockSetScreen = vi.fn()

  const createMockState = (overrides = {}) => ({
    currentScreen: 'victory' as const,
    setScreen: mockSetScreen,
    goBack: vi.fn(),
    turnCount: 25,
    resources: { food: 45, fuel: 80, water: 60, money: 350 },
    crew: [
      { id: '1', name: 'Tom', role: 'engineer' as const, avatar: '👷' },
      { id: '2', name: 'Maria', role: 'cook' as const, avatar: '👩‍🍳' },
      { id: '3', name: 'Jack', role: 'engineer' as const, avatar: '👷' },
      { id: '4', name: 'Sam', role: 'security' as const, avatar: '💂' },
    ],
    ownedCarts: [
      { id: 'fuel-cart', name: 'Fuel Tank', icon: '⛽', price: 100, effectType: 'maxFuel' as const, effectValue: 50, description: 'Extra fuel' },
      { id: 'food-cart', name: 'Pantry', icon: '🍞', price: 80, effectType: 'maxFood' as const, effectValue: 30, description: 'Extra food' },
    ],
    selectedCaptain: { id: 'renji', name: 'Renji', origin: 'Japan', description: '', portrait: '👨', stats: { engineering: 4, food: 3, security: 3 } },
    selectedTrain: { id: 'blitzzug', name: 'Blitzzug', origin: 'Germany', character: '', sprite: '🚂', stats: { speed: 5, reliability: 4, power: 4 } },
    ...overrides,
  })

  beforeEach(() => {
    vi.clearAllMocks()
    // Cache the state to avoid creating new object references on each call
    const cachedState = createMockState()
    vi.mocked(useGameStore).mockImplementation((selector) => {
      return selector(cachedState as unknown as ReturnType<typeof useGameStore.getState>)
    })
    // Default mock implementations for leaderboard functions
    vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(535)
    vi.mocked(leaderboardLogic.loadLeaderboard).mockReturnValue([])
    vi.mocked(leaderboardLogic.checkQualification).mockReturnValue({ qualifies: false, rank: 0 })
    vi.mocked(leaderboardLogic.addLeaderboardEntry).mockReturnValue({
      id: 'test-entry-id',
      name: 'Test Player',
      score: 535,
      date: '2026-01-22T00:00:00.000Z',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('renders "VICTORY!" text', () => {
      render(<VictoryScreen />)

      expect(screen.getByText('VICTORY!')).toBeInTheDocument()
    })

    it('renders trophy emoji', () => {
      render(<VictoryScreen />)

      // Trophy is part of the celebration emojis
      expect(screen.getByText(/🏆/)).toBeInTheDocument()
    })

    it('renders turn count message', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/You completed the journey/)).toBeInTheDocument()
      expect(screen.getByText(/turns!/)).toBeInTheDocument()
    })

    it('displays actual turn count from store', () => {
      render(<VictoryScreen />)

      expect(screen.getByText('25')).toBeInTheDocument()
      expect(screen.getByText(/25/)).toBeInTheDocument()
    })

    it('updates when turn count changes', () => {
      const { rerender } = render(<VictoryScreen />)
      expect(screen.getByText('25')).toBeInTheDocument()

      // Update mock to return different turn count
      const newState = createMockState({ turnCount: 30 })
      vi.mocked(useGameStore).mockImplementation((selector) => {
        return selector(newState as unknown as ReturnType<typeof useGameStore.getState>)
      })

      rerender(<VictoryScreen />)
      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('renders NEW GAME button', () => {
      render(<VictoryScreen />)

      expect(screen.getByRole('button', { name: 'NEW GAME' })).toBeInTheDocument()
    })

    it('renders celebration emojis', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/🏆/)).toBeInTheDocument()
    })

    it('renders congratulations message', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/Congratulations, Captain!/)).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('renders VICTORY text with gold color', () => {
      render(<VictoryScreen />)

      const victoryText = screen.getByText('VICTORY!')
      expect(victoryText).toHaveStyle({ color: 'var(--color-gold, #F7B538)' })
    })

    it('renders NEW GAME button with gold variant', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      expect(button).toHaveAttribute('data-variant', 'gold')
    })

    it('renders NEW GAME button with glow effect', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      expect(button).toHaveAttribute('data-glow', 'true')
    })

    it('renders NEW GAME button with large size', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      expect(button).toHaveAttribute('data-size', 'large')
    })
  })

  describe('navigation', () => {
    it('navigates to captainSelect when NEW GAME is clicked', () => {
      render(<VictoryScreen />)

      const newGameButton = screen.getByRole('button', { name: 'NEW GAME' })
      fireEvent.click(newGameButton)

      expect(mockSetScreen).toHaveBeenCalledTimes(1)
      expect(mockSetScreen).toHaveBeenCalledWith('captainSelect')
    })
  })

  describe('accessibility', () => {
    it('has celebration emojis marked as decorative', () => {
      render(<VictoryScreen />)

      // The emoji containers should have aria-hidden
      const emojiContainers = document.querySelectorAll('[aria-hidden="true"]')
      expect(emojiContainers.length).toBeGreaterThan(0)
    })

    it('has a focusable NEW GAME button', () => {
      render(<VictoryScreen />)

      const button = screen.getByRole('button', { name: 'NEW GAME' })
      button.focus()
      expect(document.activeElement).toBe(button)
    })
  })

  describe('performance rating', () => {
    it('displays 3 stars for 15 turns or less', () => {
      const state = createMockState({ turnCount: 15 })
      vi.mocked(useGameStore).mockImplementation((selector) => {
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })

      render(<VictoryScreen />)

      expect(screen.getByText('⭐⭐⭐')).toBeInTheDocument()
      expect(screen.getByText('Express Master')).toBeInTheDocument()
    })

    it('displays 2 stars for 16-25 turns', () => {
      const state = createMockState({ turnCount: 20 })
      vi.mocked(useGameStore).mockImplementation((selector) => {
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })

      render(<VictoryScreen />)

      expect(screen.getByText('⭐⭐')).toBeInTheDocument()
      expect(screen.getByText('Skilled Conductor')).toBeInTheDocument()
    })

    it('displays 1 star for more than 25 turns', () => {
      const state = createMockState({ turnCount: 30 })
      vi.mocked(useGameStore).mockImplementation((selector) => {
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })

      render(<VictoryScreen />)

      expect(screen.getByText('⭐')).toBeInTheDocument()
      expect(screen.getByText('Journey Complete')).toBeInTheDocument()
    })

    it('shows rating title prominently', () => {
      render(<VictoryScreen />)

      const ratingTitle = screen.getByText('Skilled Conductor')
      expect(ratingTitle).toBeInTheDocument()
    })
  })

  describe('game statistics', () => {
    it('displays final resources with icons', () => {
      render(<VictoryScreen />)

      // Check for resource values with icons
      expect(screen.getByText(/🍞/)).toBeInTheDocument()
      expect(screen.getByText(/45/)).toBeInTheDocument()
      expect(screen.getByText(/⛽/)).toBeInTheDocument()
      expect(screen.getByText(/80/)).toBeInTheDocument()
      expect(screen.getByText(/💧/)).toBeInTheDocument()
      expect(screen.getByText(/60/)).toBeInTheDocument()
      expect(screen.getByText(/💰/)).toBeInTheDocument()
      expect(screen.getByText(/350/)).toBeInTheDocument()
    })

    it('shows crew role counts', () => {
      render(<VictoryScreen />)

      // Should show crew summary by role
      expect(screen.getByText(/2 Engineers/i)).toBeInTheDocument()
      expect(screen.getByText(/1 Cook/i)).toBeInTheDocument()
      expect(screen.getByText(/1 Security/i)).toBeInTheDocument()
    })

    it('shows cart count', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/2 Carts Acquired/i)).toBeInTheDocument()
    })

    it('shows captain name', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/Renji/)).toBeInTheDocument()
    })

    it('shows train name', () => {
      render(<VictoryScreen />)

      expect(screen.getByText(/Blitzzug/)).toBeInTheDocument()
    })

    it('handles empty crew', () => {
      const state = createMockState({ crew: [] })
      vi.mocked(useGameStore).mockImplementation((selector) => {
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })

      render(<VictoryScreen />)

      expect(screen.getByText('VICTORY!')).toBeInTheDocument()
    })

    it('handles no carts', () => {
      const state = createMockState({ ownedCarts: [] })
      vi.mocked(useGameStore).mockImplementation((selector) => {
        return selector(state as unknown as ReturnType<typeof useGameStore.getState>)
      })

      render(<VictoryScreen />)

      expect(screen.getByText(/0 Carts Acquired/i)).toBeInTheDocument()
    })
  })

  describe('leaderboard integration', () => {
    it('displays leaderboard section with "Your Score"', () => {
      vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(535)

      render(<VictoryScreen />)

      expect(screen.getByText(/Your Score:/)).toBeInTheDocument()
      expect(screen.getByText('535')).toBeInTheDocument()
    })

    it('shows name input when player qualifies for leaderboard', () => {
      vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(1000)
      vi.mocked(leaderboardLogic.checkQualification).mockReturnValue({ qualifies: true, rank: 1 })

      render(<VictoryScreen />)

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'SUBMIT' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'SKIP' })).toBeInTheDocument()
    })

    it('hides name input after submission', async () => {
      vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(1000)
      // Initially qualifies, but after submission should not re-show input
      vi.mocked(leaderboardLogic.checkQualification).mockReturnValue({ qualifies: true, rank: 1 })
      vi.mocked(leaderboardLogic.addLeaderboardEntry).mockReturnValue({
        id: 'new-entry-id',
        name: 'Test Player',
        score: 1000,
        date: '2026-01-22T00:00:00.000Z',
      })
      vi.mocked(leaderboardLogic.loadLeaderboard).mockReturnValue([
        { id: 'new-entry-id', name: 'Test Player', score: 1000, date: '2026-01-22T00:00:00.000Z' },
      ])

      render(<VictoryScreen />)

      const input = screen.getByPlaceholderText('Enter your name') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Test Player' } })

      // Verify input value was set
      expect(input.value).toBe('Test Player')

      const submitButton = screen.getByRole('button', { name: 'SUBMIT' })
      expect(submitButton).not.toBeDisabled()

      fireEvent.click(submitButton)

      // Check that addLeaderboardEntry was called
      expect(leaderboardLogic.addLeaderboardEntry).toHaveBeenCalledWith('Test Player', 1000)

      // Check that the entry is highlighted (this proves handleSubmitName ran)
      await waitFor(() => {
        const highlightedRow = screen.getByTestId('leaderboard-row')
        expect(highlightedRow).toHaveAttribute('data-highlighted', 'true')
      })

      // Now check that the name input is gone
      expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument()
    })

    it('shows current entry highlighted after submission', async () => {
      vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(1000)
      vi.mocked(leaderboardLogic.checkQualification).mockReturnValue({ qualifies: true, rank: 1 })
      vi.mocked(leaderboardLogic.addLeaderboardEntry).mockReturnValue({
        id: 'new-entry-id',
        name: 'Test Player',
        score: 1000,
        date: '2026-01-22T00:00:00.000Z',
      })
      vi.mocked(leaderboardLogic.loadLeaderboard).mockReturnValue([
        { id: 'new-entry-id', name: 'Test Player', score: 1000, date: '2026-01-22T00:00:00.000Z' },
      ])

      render(<VictoryScreen />)

      const input = screen.getByPlaceholderText('Enter your name')
      fireEvent.change(input, { target: { value: 'Test Player' } })
      fireEvent.click(screen.getByRole('button', { name: 'SUBMIT' }))

      await waitFor(() => {
        const highlightedRow = screen.getByTestId('leaderboard-row')
        expect(highlightedRow).toHaveAttribute('data-highlighted', 'true')
      })
    })

    it('uses two-column layout', () => {
      render(<VictoryScreen />)

      const victoryScreen = screen.getByTestId('victory-screen')
      expect(victoryScreen).toHaveStyle({ display: 'flex', flexDirection: 'row' })
    })

    it('hides name input when skip is clicked', async () => {
      vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(1000)
      vi.mocked(leaderboardLogic.checkQualification).mockReturnValue({ qualifies: true, rank: 1 })

      render(<VictoryScreen />)

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()

      const skipButton = screen.getByRole('button', { name: 'SKIP' })
      fireEvent.click(skipButton)

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument()
      })
    })

    it('does not show name input when player does not qualify', () => {
      vi.mocked(leaderboardLogic.calculateScore).mockReturnValue(100)
      vi.mocked(leaderboardLogic.checkQualification).mockReturnValue({ qualifies: false, rank: 0 })

      render(<VictoryScreen />)

      expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument()
    })

    it('displays existing leaderboard entries', () => {
      vi.mocked(leaderboardLogic.loadLeaderboard).mockReturnValue([
        { id: 'entry-1', name: 'Alice', score: 800, date: '2026-01-20T00:00:00.000Z' },
        { id: 'entry-2', name: 'Bob', score: 600, date: '2026-01-19T00:00:00.000Z' },
      ])

      render(<VictoryScreen />)

      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      expect(screen.getByText('800')).toBeInTheDocument()
      expect(screen.getByText('600')).toBeInTheDocument()
    })
  })
})
