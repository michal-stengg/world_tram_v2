import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CrewMember } from '../../components/game/CrewMember'
import type { CrewMember as CrewMemberType } from '../../types'
import { useGameStore } from '../../stores/gameStore'

const mockEngineer: CrewMemberType = {
  id: 'tom',
  name: 'Tom',
  role: 'engineer',
  avatar: '👨‍🔧',
}

const mockCook: CrewMemberType = {
  id: 'maria',
  name: 'Maria',
  role: 'cook',
  avatar: '👩‍🍳',
}

const mockSecurity: CrewMemberType = {
  id: 'jack',
  name: 'Jack',
  role: 'security',
  avatar: '💂',
}

const mockFree: CrewMemberType = {
  id: 'sam',
  name: 'Sam',
  role: 'free',
  avatar: '👤',
}

describe('CrewMember', () => {
  describe('rendering', () => {
    it('renders crew member name', () => {
      render(<CrewMember member={mockEngineer} />)
      expect(screen.getByText('Tom')).toBeInTheDocument()
    })

    it('renders crew member avatar', () => {
      render(<CrewMember member={mockEngineer} />)
      expect(screen.getByRole('img', { name: 'Tom' })).toHaveTextContent('👨‍🔧')
    })

    it('renders correct testid', () => {
      render(<CrewMember member={mockEngineer} />)
      expect(screen.getByTestId('crew-member-tom')).toBeInTheDocument()
    })
  })

  describe('role display', () => {
    it('shows engineer role with icon', () => {
      render(<CrewMember member={mockEngineer} />)
      expect(screen.getByTestId('role-tom')).toHaveTextContent('Engineer')
      expect(screen.getByRole('img', { name: 'Engineer' })).toHaveTextContent('🔧')
    })

    it('shows cook role with icon', () => {
      render(<CrewMember member={mockCook} />)
      expect(screen.getByTestId('role-maria')).toHaveTextContent('Cook')
      expect(screen.getByRole('img', { name: 'Cook' })).toHaveTextContent('🍳')
    })

    it('shows security role with icon', () => {
      render(<CrewMember member={mockSecurity} />)
      expect(screen.getByTestId('role-jack')).toHaveTextContent('Security')
      expect(screen.getByRole('img', { name: 'Security' })).toHaveTextContent('🛡️')
    })

    it('shows free role with icon', () => {
      render(<CrewMember member={mockFree} />)
      expect(screen.getByTestId('role-sam')).toHaveTextContent('Free')
      expect(screen.getByRole('img', { name: 'Free' })).toHaveTextContent('💤')
    })
  })

  describe('interaction', () => {
    it('calls onRoleClick when clicked', () => {
      const onRoleClick = vi.fn()
      render(<CrewMember member={mockEngineer} onRoleClick={onRoleClick} />)

      fireEvent.click(screen.getByTestId('crew-member-tom'))
      expect(onRoleClick).toHaveBeenCalledTimes(1)
    })

    it('does not throw when clicked without handler', () => {
      render(<CrewMember member={mockEngineer} />)
      expect(() => fireEvent.click(screen.getByTestId('crew-member-tom'))).not.toThrow()
    })

    it('has button role when clickable', () => {
      const onRoleClick = vi.fn()
      render(<CrewMember member={mockEngineer} onRoleClick={onRoleClick} />)
      expect(screen.getByTestId('crew-member-tom')).toHaveAttribute('role', 'button')
    })

    it('always has button role since it is always clickable', () => {
      render(<CrewMember member={mockEngineer} />)
      expect(screen.getByTestId('crew-member-tom')).toHaveAttribute('role', 'button')
    })

    it('responds to Enter key when clickable', () => {
      const onRoleClick = vi.fn()
      render(<CrewMember member={mockEngineer} onRoleClick={onRoleClick} />)

      fireEvent.keyDown(screen.getByTestId('crew-member-tom'), { key: 'Enter' })
      expect(onRoleClick).toHaveBeenCalledTimes(1)
    })

    it('responds to Space key when clickable', () => {
      const onRoleClick = vi.fn()
      render(<CrewMember member={mockEngineer} onRoleClick={onRoleClick} />)

      fireEvent.keyDown(screen.getByTestId('crew-member-tom'), { key: ' ' })
      expect(onRoleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('different crew members', () => {
    it('renders all starting crew members correctly', () => {
      const { rerender } = render(<CrewMember member={mockEngineer} />)
      expect(screen.getByText('Tom')).toBeInTheDocument()

      rerender(<CrewMember member={mockCook} />)
      expect(screen.getByText('Maria')).toBeInTheDocument()

      rerender(<CrewMember member={mockSecurity} />)
      expect(screen.getByText('Jack')).toBeInTheDocument()

      rerender(<CrewMember member={mockFree} />)
      expect(screen.getByText('Sam')).toBeInTheDocument()
    })
  })

  describe('tooltips', () => {
    it('shows tooltip with engineer effect description', () => {
      render(<CrewMember member={mockEngineer} />)
      const element = screen.getByTestId('crew-member-tom')
      expect(element).toHaveAttribute('title', 'Engineers reduce fuel consumption')
    })

    it('shows tooltip with cook effect description', () => {
      render(<CrewMember member={mockCook} />)
      const element = screen.getByTestId('crew-member-maria')
      expect(element).toHaveAttribute('title', 'Cooks produce food each turn')
    })

    it('shows tooltip with security effect description', () => {
      render(<CrewMember member={mockSecurity} />)
      const element = screen.getByTestId('crew-member-jack')
      expect(element).toHaveAttribute('title', 'Security earns more money at stations')
    })

    it('shows tooltip with free effect description', () => {
      render(<CrewMember member={mockFree} />)
      const element = screen.getByTestId('crew-member-sam')
      expect(element).toHaveAttribute('title', 'Free crew have no special bonus')
    })
  })

  describe('store integration', () => {
    beforeEach(() => {
      // Reset the store to initial state before each test
      useGameStore.setState({
        crew: [mockEngineer, mockCook, mockSecurity, mockFree],
      })
    })

    it('calls cycleCrewRole from store when clicked', () => {
      const cycleCrewRoleSpy = vi.fn()
      useGameStore.setState({ cycleCrewRole: cycleCrewRoleSpy } as unknown as Parameters<typeof useGameStore.setState>[0])

      render(<CrewMember member={mockEngineer} />)

      fireEvent.click(screen.getByTestId('crew-member-tom'))
      expect(cycleCrewRoleSpy).toHaveBeenCalledWith('tom')
    })

    it('has pointer cursor style for clickable appearance', () => {
      render(<CrewMember member={mockEngineer} />)
      const element = screen.getByTestId('crew-member-tom')
      expect(element).toHaveStyle({ cursor: 'pointer' })
    })
  })
})
