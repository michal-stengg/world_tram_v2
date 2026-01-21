import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { CrewPanel } from '../../components/game/CrewPanel'
import { useGameStore } from '../../stores/gameStore'
import { startingCrew } from '../../data/crew'
import { STARTING_RESOURCES } from '../../data/constants'

describe('CrewPanel', () => {
  beforeEach(() => {
    act(() => {
      useGameStore.setState({
        crew: [...startingCrew],
        resources: { ...STARTING_RESOURCES },
      })
    })
  })

  describe('rendering', () => {
    it('renders the crew panel container', () => {
      render(<CrewPanel />)
      expect(screen.getByTestId('crew-panel')).toBeInTheDocument()
    })

    it('renders "Crew" header', () => {
      render(<CrewPanel />)
      expect(screen.getByText('Crew')).toBeInTheDocument()
    })

    it('renders all 4 crew members', () => {
      render(<CrewPanel />)
      expect(screen.getByTestId('crew-member-tom')).toBeInTheDocument()
      expect(screen.getByTestId('crew-member-maria')).toBeInTheDocument()
      expect(screen.getByTestId('crew-member-jack')).toBeInTheDocument()
      expect(screen.getByTestId('crew-member-sam')).toBeInTheDocument()
    })
  })

  describe('crew member details', () => {
    it('shows Tom as engineer', () => {
      render(<CrewPanel />)
      expect(screen.getByText('Tom')).toBeInTheDocument()
      expect(screen.getByTestId('role-tom')).toHaveTextContent('Engineer')
    })

    it('shows Maria as cook', () => {
      render(<CrewPanel />)
      expect(screen.getByText('Maria')).toBeInTheDocument()
      expect(screen.getByTestId('role-maria')).toHaveTextContent('Cook')
    })

    it('shows Jack as security', () => {
      render(<CrewPanel />)
      expect(screen.getByText('Jack')).toBeInTheDocument()
      expect(screen.getByTestId('role-jack')).toHaveTextContent('Security')
    })

    it('shows Sam as free', () => {
      render(<CrewPanel />)
      expect(screen.getByText('Sam')).toBeInTheDocument()
      expect(screen.getByTestId('role-sam')).toHaveTextContent('Free')
    })
  })

  describe('state updates', () => {
    it('updates when crew changes', () => {
      render(<CrewPanel />)

      act(() => {
        useGameStore.setState({
          crew: [
            { id: 'tom', name: 'Tom', role: 'cook', avatar: '👨‍🔧' },
            { id: 'maria', name: 'Maria', role: 'cook', avatar: '👩‍🍳' },
            { id: 'jack', name: 'Jack', role: 'security', avatar: '💂' },
            { id: 'sam', name: 'Sam', role: 'free', avatar: '👤' },
          ],
        })
      })

      expect(screen.getByTestId('role-tom')).toHaveTextContent('Cook')
    })

    it('handles empty crew array', () => {
      act(() => {
        useGameStore.setState({ crew: [] })
      })

      render(<CrewPanel />)
      expect(screen.getByTestId('crew-panel')).toBeInTheDocument()
      expect(screen.queryByTestId('crew-member-tom')).not.toBeInTheDocument()
    })
  })
})
