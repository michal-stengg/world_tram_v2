import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Leaderboard } from '../../components/game/Leaderboard'
import type { LeaderboardEntry } from '../../types/leaderboard'

// Mock the formatLeaderboardDate function
vi.mock('../../logic/leaderboard', () => ({
  formatLeaderboardDate: (isoDate: string) => {
    // Simple mock that returns a formatted date
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  },
}))

describe('Leaderboard', () => {
  const createMockEntries = (count: number): LeaderboardEntry[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `entry-${i + 1}`,
      name: `Player ${i + 1}`,
      score: 1000 - i * 50,
      date: `2026-05-${String(20 - i).padStart(2, '0')}T12:00:00Z`,
    }))
  }

  describe('rendering', () => {
    it('renders "TOP 10 SCORES" header', () => {
      render(<Leaderboard entries={[]} />)

      expect(screen.getByText('TOP 10 SCORES')).toBeInTheDocument()
    })

    it('shows empty state when entries is empty', () => {
      render(<Leaderboard entries={[]} />)

      expect(screen.getByText('No scores yet - be the first!')).toBeInTheDocument()
    })

    it('does not show empty state when entries exist', () => {
      const entries = createMockEntries(3)
      render(<Leaderboard entries={entries} />)

      expect(screen.queryByText('No scores yet - be the first!')).not.toBeInTheDocument()
    })
  })

  describe('entry display', () => {
    it('displays entries with rank, name, score, and date', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'entry-1', name: 'Alice', score: 1000, date: '2026-05-20T12:00:00Z' },
      ]
      render(<Leaderboard entries={entries} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('1000')).toBeInTheDocument()
      expect(screen.getByText('May 20, 2026')).toBeInTheDocument()
    })

    it('shows correct rank numbers for multiple entries', () => {
      const entries = createMockEntries(5)
      render(<Leaderboard entries={entries} />)

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('displays all entry names', () => {
      const entries = createMockEntries(3)
      render(<Leaderboard entries={entries} />)

      expect(screen.getByText('Player 1')).toBeInTheDocument()
      expect(screen.getByText('Player 2')).toBeInTheDocument()
      expect(screen.getByText('Player 3')).toBeInTheDocument()
    })

    it('displays all entry scores', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'e1', name: 'P1', score: 500, date: '2026-01-01T00:00:00Z' },
        { id: 'e2', name: 'P2', score: 400, date: '2026-01-02T00:00:00Z' },
        { id: 'e3', name: 'P3', score: 300, date: '2026-01-03T00:00:00Z' },
      ]
      render(<Leaderboard entries={entries} />)

      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('400')).toBeInTheDocument()
      expect(screen.getByText('300')).toBeInTheDocument()
    })
  })

  describe('current entry highlighting', () => {
    it('highlights entry when currentEntryId matches', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'entry-1', name: 'Alice', score: 1000, date: '2026-05-20T12:00:00Z' },
        { id: 'entry-2', name: 'Bob', score: 900, date: '2026-05-19T12:00:00Z' },
      ]
      render(<Leaderboard entries={entries} currentEntryId="entry-2" />)

      // Find the row containing Bob and check it has highlight styling
      const bobRow = screen.getByText('Bob').closest('[data-testid="leaderboard-row"]')
      expect(bobRow).toHaveAttribute('data-highlighted', 'true')
    })

    it('does not highlight entries when currentEntryId does not match', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'entry-1', name: 'Alice', score: 1000, date: '2026-05-20T12:00:00Z' },
      ]
      render(<Leaderboard entries={entries} currentEntryId="non-existent" />)

      const aliceRow = screen.getByText('Alice').closest('[data-testid="leaderboard-row"]')
      expect(aliceRow).toHaveAttribute('data-highlighted', 'false')
    })

    it('does not highlight any entries when currentEntryId is not provided', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'entry-1', name: 'Alice', score: 1000, date: '2026-05-20T12:00:00Z' },
      ]
      render(<Leaderboard entries={entries} />)

      const aliceRow = screen.getByText('Alice').closest('[data-testid="leaderboard-row"]')
      expect(aliceRow).toHaveAttribute('data-highlighted', 'false')
    })

    it('applies gold background to highlighted entry', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'entry-1', name: 'Alice', score: 1000, date: '2026-05-20T12:00:00Z' },
      ]
      render(<Leaderboard entries={entries} currentEntryId="entry-1" />)

      const aliceRow = screen.getByText('Alice').closest('[data-testid="leaderboard-row"]')
      expect(aliceRow).toHaveStyle({ backgroundColor: 'rgba(247, 181, 56, 0.2)' })
    })
  })

  describe('styling', () => {
    it('renders header with gold color', () => {
      render(<Leaderboard entries={[]} />)

      const header = screen.getByText('TOP 10 SCORES')
      expect(header).toHaveStyle({ color: '#F7B538' })
    })

    it('renders container with border styling', () => {
      render(<Leaderboard entries={[]} />)

      const container = screen.getByTestId('leaderboard-container')
      expect(container).toHaveStyle({ border: '2px solid rgba(247, 181, 56, 0.3)' })
    })
  })

  describe('edge cases', () => {
    it('handles full 10 entries', () => {
      const entries = createMockEntries(10)
      render(<Leaderboard entries={entries} />)

      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('Player 10')).toBeInTheDocument()
    })

    it('handles entries with same scores', () => {
      const entries: LeaderboardEntry[] = [
        { id: 'e1', name: 'Alice', score: 500, date: '2026-01-01T00:00:00Z' },
        { id: 'e2', name: 'Bob', score: 500, date: '2026-01-02T00:00:00Z' },
      ]
      render(<Leaderboard entries={entries} />)

      expect(screen.getByText('Alice')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
      // Both should show their scores
      const scores = screen.getAllByText('500')
      expect(scores).toHaveLength(2)
    })
  })
})
