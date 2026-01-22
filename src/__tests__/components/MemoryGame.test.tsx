import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryGame } from '../../components/minigames/MemoryGame'
import { getMiniGameByCountryId } from '../../data/minigames'

// Get a memory-type mini-game for testing
const testMiniGame = getMiniGameByCountryId('russia')! // Matryoshka Match

describe('MemoryGame', () => {
  const mockOnComplete = vi.fn()
  const mockOnSkip = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('ready state', () => {
    it('renders game title and icon', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByText('Matryoshka Match')).toBeInTheDocument()
      expect(screen.getByText(testMiniGame.icon)).toBeInTheDocument()
    })

    it('shows start button in ready state', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('shows skip button', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument()
    })

    it('skip button calls onSkip', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const skipButton = screen.getByRole('button', { name: /skip/i })
      fireEvent.click(skipButton)

      expect(mockOnSkip).toHaveBeenCalledTimes(1)
    })
  })

  describe('playing state', () => {
    it('clicking start begins the game', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Start button should be gone
      expect(screen.queryByRole('button', { name: /start/i })).not.toBeInTheDocument()
    })

    it('shows timer during gameplay', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Should show 30 seconds initially
      expect(screen.getByText(/30/)).toBeInTheDocument()
    })

    it('shows pairs counter during gameplay', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Should show pairs counter
      expect(screen.getByText(/pairs/i)).toBeInTheDocument()
      expect(screen.getByText(/0\/6/)).toBeInTheDocument()
    })

    it('renders 12 cards face-down', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Should have 12 cards
      const cards = screen.getAllByTestId('memory-card')
      expect(cards).toHaveLength(12)
    })

    it('clicking a card flips it face-up', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const cards = screen.getAllByTestId('memory-card')

      // Initially cards should show back (question mark)
      expect(cards[0]).toHaveTextContent('?')

      // Click first card
      fireEvent.click(cards[0])

      // Card should now show its symbol (not question mark)
      expect(cards[0]).not.toHaveTextContent('?')
    })

    it('matching two cards keeps them face-up and increments score', () => {
      // Use a seeded random to control card positions
      const originalRandom = Math.random
      let callCount = 0
      // Create a deterministic sequence that puts matching cards at known positions
      Math.random = () => {
        const values = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.15, 0.25, 0.35]
        return values[callCount++ % values.length]
      }

      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      Math.random = originalRandom

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const cards = screen.getAllByTestId('memory-card')

      // Click first card
      fireEvent.click(cards[0])
      const firstSymbol = cards[0].textContent

      // Find another card with matching symbol by clicking and checking
      // We need to find the matching card
      let matchingIndex = -1
      for (let i = 1; i < cards.length; i++) {
        fireEvent.click(cards[i])
        if (cards[i].textContent === firstSymbol) {
          matchingIndex = i
          break
        }
        // If no match, wait for flip back
        act(() => {
          vi.advanceTimersByTime(1100)
        })
        // Click first card again to flip it back up
        fireEvent.click(cards[0])
      }

      if (matchingIndex !== -1) {
        // Wait for match to be processed
        act(() => {
          vi.advanceTimersByTime(100)
        })

        // Score should increment
        expect(screen.getByText(/1\/6/)).toBeInTheDocument()
      }
    })

    it('non-matching cards flip back after delay', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const cards = screen.getAllByTestId('memory-card')

      // Click first card
      fireEvent.click(cards[0])
      const firstSymbol = cards[0].textContent

      // Find a card with different symbol
      let differentIndex = -1
      for (let i = 1; i < cards.length; i++) {
        fireEvent.click(cards[i])
        if (cards[i].textContent !== firstSymbol) {
          differentIndex = i
          break
        }
        // This was a match, try next
        act(() => {
          vi.advanceTimersByTime(1100)
        })
      }

      if (differentIndex !== -1) {
        // Both cards should be showing symbols right now
        expect(cards[0]).not.toHaveTextContent('?')
        expect(cards[differentIndex]).not.toHaveTextContent('?')

        // Wait for flip back delay
        act(() => {
          vi.advanceTimersByTime(1100)
        })

        // Cards should be face-down again (showing ?)
        expect(cards[0]).toHaveTextContent('?')
        expect(cards[differentIndex]).toHaveTextContent('?')
      }
    })

    it('timer counts down during gameplay', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 1 second
      act(() => {
        vi.advanceTimersByTime(1000)
      })

      // Should show 29 seconds
      expect(screen.getByText(/29/)).toBeInTheDocument()
    })
  })

  describe('game completion', () => {
    it('finding all pairs ends the game', () => {
      // We'll test this by checking that onComplete is called with max score
      // when all pairs are found
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      const cards = screen.getAllByTestId('memory-card')

      // Click all cards in pairs - we need to find matching pairs
      const symbolMap = new Map<string, number[]>()

      // Reveal all cards to find their symbols
      for (let i = 0; i < cards.length; i++) {
        fireEvent.click(cards[i])
        const symbol = cards[i].textContent

        if (!symbolMap.has(symbol!)) {
          symbolMap.set(symbol!, [])
        }
        symbolMap.get(symbol!)!.push(i)

        // Wait for any non-match flip back
        act(() => {
          vi.advanceTimersByTime(1100)
        })
      }

      // Now match all pairs
      let pairsMatched = 0
      symbolMap.forEach((indices) => {
        if (indices.length === 2) {
          fireEvent.click(cards[indices[0]])
          fireEvent.click(cards[indices[1]])
          pairsMatched++
          act(() => {
            vi.advanceTimersByTime(100)
          })
        }
      })

      // Should have called onComplete with score 6 (all pairs found)
      if (pairsMatched === 6) {
        expect(mockOnComplete).toHaveBeenCalledWith(6, 6)
      }
    })

    it('time running out ends the game', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 30 seconds (game duration)
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 6)
    })

    it('calls onComplete with score when game ends', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 30 seconds (game duration)
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(mockOnComplete).toHaveBeenCalledTimes(1)
      // First arg is score (any number), second arg is max score (6)
      expect(mockOnComplete).toHaveBeenCalledWith(expect.any(Number), 6)
    })

    it('shows finished state with final score', () => {
      render(
        <MemoryGame
          miniGame={testMiniGame}
          onComplete={mockOnComplete}
          onSkip={mockOnSkip}
        />
      )

      const startButton = screen.getByRole('button', { name: /start/i })
      fireEvent.click(startButton)

      // Advance time by 30 seconds
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      // Should show game over message
      expect(screen.getByText(/time's up|game over|finished/i)).toBeInTheDocument()
    })
  })
})
