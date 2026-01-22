import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EventModal } from '../../components/game/EventModal'
import type { GameEvent } from '../../data/events'
import type { BonusCard } from '../../data/cards'
import type { EventResult } from '../../logic/events'
import type { CrewMember, CrewRole } from '../../types'

const mockEvent: GameEvent = {
  id: 'bandit-attack',
  name: 'Bandit Attack',
  description: 'A gang of bandits has spotted your train and is attempting to board!',
  statTested: 'security',
  difficulty: 10,
  penalty: {
    type: 'resource',
    resource: 'money',
    amount: 50,
  },
}

const mockCards: BonusCard[] = [
  {
    id: 'security-patrol',
    name: 'Security Patrol',
    stat: 'security',
    bonus: 3,
    description: 'Deploy a trained patrol team.',
  },
  {
    id: 'quick-repairs',
    name: 'Quick Repairs',
    stat: 'engineering',
    bonus: 3,
    description: 'Emergency tools and spare parts.',
  },
]

describe('EventModal', () => {
  describe('rendering before roll', () => {
    it('renders the event modal container', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-modal')).toBeInTheDocument()
    })

    it('displays the event name', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText('Bandit Attack')).toBeInTheDocument()
    })

    it('displays the event description', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText(/A gang of bandits has spotted your train/)).toBeInTheDocument()
    })

    it('displays the difficulty', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-difficulty')).toHaveTextContent('10')
    })

    it('displays the stat being tested', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-stat-tested')).toHaveTextContent('security')
    })

    it('displays the penalty', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-penalty')).toHaveTextContent('50')
      expect(screen.getByTestId('event-penalty')).toHaveTextContent('money')
    })

    it('renders the CardHand component', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('card-hand')).toBeInTheDocument()
    })

    it('renders the Roll button', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /roll/i })).toBeInTheDocument()
    })

    it('does not render Continue button before roll', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
    })
  })

  describe('interaction before roll', () => {
    it('calls onRoll when Roll button is clicked', () => {
      const onRoll = vi.fn()
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={onRoll}
          onContinue={vi.fn()}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /roll/i }))

      expect(onRoll).toHaveBeenCalledTimes(1)
    })

    it('calls onSelectCard when a card is clicked', () => {
      const onSelectCard = vi.fn()
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={onSelectCard}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )

      fireEvent.click(screen.getByTestId('card-display-security-patrol'))

      expect(onSelectCard).toHaveBeenCalledWith('security-patrol')
    })

    it('passes selectedCardIds to CardHand', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={['security-patrol']}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )

      expect(screen.getByTestId('card-display-security-patrol')).toHaveAttribute('data-selected', 'true')
      expect(screen.getByTestId('card-display-quick-repairs')).toHaveAttribute('data-selected', 'false')
    })
  })

  describe('rendering after roll - success', () => {
    const successResult: EventResult = {
      success: true,
      total: 12,
    }

    it('displays success message', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-result')).toHaveTextContent(/success/i)
    })

    it('displays the total rolled', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-total')).toHaveTextContent('12')
    })

    it('renders Continue button after roll', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('does not render Roll button after roll', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.queryByRole('button', { name: /roll/i })).not.toBeInTheDocument()
    })

    it('does not display penalty on success', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.queryByTestId('event-penalty-applied')).not.toBeInTheDocument()
    })
  })

  describe('rendering after roll - failure', () => {
    const failureResult: EventResult = {
      success: false,
      total: 7,
      penalty: {
        type: 'resource',
        resource: 'money',
        amount: 50,
      },
    }

    it('displays failure message', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={failureResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-result')).toHaveTextContent(/fail/i)
    })

    it('displays the total rolled on failure', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={failureResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-total')).toHaveTextContent('7')
    })

    it('displays the penalty applied', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={failureResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-penalty-applied')).toHaveTextContent('50')
      expect(screen.getByTestId('event-penalty-applied')).toHaveTextContent('money')
    })

    it('renders Continue button after failed roll', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={failureResult}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })
  })

  describe('interaction after roll', () => {
    const successResult: EventResult = {
      success: true,
      total: 12,
    }

    it('calls onContinue when Continue button is clicked', () => {
      const onContinue = vi.fn()
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={onContinue}
        />
      )

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      expect(onContinue).toHaveBeenCalledTimes(1)
    })
  })

  describe('different events', () => {
    const engineEvent: GameEvent = {
      id: 'engine-failure',
      name: 'Engine Failure',
      description: 'The main engine is making terrible sounds!',
      statTested: 'engineering',
      difficulty: 9,
      penalty: {
        type: 'resource',
        resource: 'fuel',
        amount: 30,
      },
    }

    it('displays different event name', () => {
      render(
        <EventModal
          event={engineEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByText('Engine Failure')).toBeInTheDocument()
    })

    it('displays different difficulty', () => {
      render(
        <EventModal
          event={engineEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-difficulty')).toHaveTextContent('9')
    })

    it('displays different stat tested', () => {
      render(
        <EventModal
          event={engineEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-stat-tested')).toHaveTextContent('engineering')
    })
  })

  describe('progress penalty', () => {
    const stormEvent: GameEvent = {
      id: 'storm',
      name: 'Storm',
      description: 'A violent storm is battering the train!',
      statTested: 'engineering',
      difficulty: 11,
      penalty: {
        type: 'progress',
        amount: 5,
      },
    }

    it('displays progress penalty type', () => {
      render(
        <EventModal
          event={stormEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.getByTestId('event-penalty')).toHaveTextContent('progress')
      expect(screen.getByTestId('event-penalty')).toHaveTextContent('5')
    })
  })

  describe('dice rolling animation', () => {
    it('shows rolling indicator when isRolling is true', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          isRolling={true}
          diceValue={4}
        />
      )
      expect(screen.getByTestId('dice-rolling')).toBeInTheDocument()
      expect(screen.getByText(/rolling/i)).toBeInTheDocument()
    })

    it('hides the Roll button when isRolling is true', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          isRolling={true}
          diceValue={4}
        />
      )
      expect(screen.queryByRole('button', { name: /roll/i })).not.toBeInTheDocument()
    })

    it('hides the CardHand when isRolling is true', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          isRolling={true}
          diceValue={4}
        />
      )
      expect(screen.queryByTestId('card-hand')).not.toBeInTheDocument()
    })

    it('displays the dice value when isRolling is true', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          isRolling={true}
          diceValue={4}
        />
      )
      expect(screen.getByTestId('dice-value')).toHaveTextContent('4')
    })

    it('shows normal behavior when isRolling is false (default)', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          isRolling={false}
        />
      )
      // Should show normal pre-roll state
      expect(screen.getByTestId('card-hand')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll/i })).toBeInTheDocument()
      expect(screen.queryByTestId('dice-rolling')).not.toBeInTheDocument()
    })

    it('shows normal behavior when isRolling is undefined', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      // Should show normal pre-roll state
      expect(screen.getByTestId('card-hand')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /roll/i })).toBeInTheDocument()
      expect(screen.queryByTestId('dice-rolling')).not.toBeInTheDocument()
    })
  })

  describe('effective roll display', () => {
    const captainStats = { engineering: 3, food: 2, security: 4 }

    const createCrew = (roles: CrewRole[]): CrewMember[] => {
      return roles.map((role, i) => ({
        id: `crew-${i}`,
        name: `Crew ${i}`,
        role,
        avatar: '👤',
      }))
    }

    it('displays captain bonus when captainStats provided', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
        />
      )
      expect(screen.getByTestId('captain-bonus')).toHaveTextContent('+4 Captain')
    })

    it('calculates effective roll needed correctly with captain bonus only', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
        />
      )
      // Difficulty 10 - Captain security 4 = need 6
      expect(screen.getByTestId('effective-roll')).toHaveTextContent('Need to Roll: 6+')
    })

    it('displays crew bonus when crew has matching roles', () => {
      const crew = createCrew(['security', 'security', 'cook'])
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
          crew={crew}
        />
      )
      expect(screen.getByTestId('crew-bonus')).toHaveTextContent('+2 Crew')
    })

    it('does not display crew bonus when no crew match', () => {
      const crew = createCrew(['engineer', 'cook'])
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
          crew={crew}
        />
      )
      expect(screen.queryByTestId('crew-bonus')).not.toBeInTheDocument()
    })

    it('calculates effective roll with captain and crew bonuses', () => {
      const crew = createCrew(['security', 'security', 'cook'])
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
          crew={crew}
        />
      )
      // Difficulty 10 - Captain security 4 - Crew security 2 = need 4
      expect(screen.getByTestId('effective-roll')).toHaveTextContent('Need to Roll: 4+')
    })

    it('displays card bonus when matching cards are selected', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={['security-patrol']}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
        />
      )
      expect(screen.getByTestId('card-bonus')).toHaveTextContent('+3 Cards')
    })

    it('does not display card bonus when selected cards do not match stat', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={['quick-repairs']}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
        />
      )
      expect(screen.queryByTestId('card-bonus')).not.toBeInTheDocument()
    })

    it('calculates effective roll with all bonuses combined', () => {
      const crew = createCrew(['security', 'cook'])
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={['security-patrol']}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={captainStats}
          crew={crew}
        />
      )
      // Difficulty 10 - Captain security 4 - Crew security 1 - Card 3 = need 2
      expect(screen.getByTestId('effective-roll')).toHaveTextContent('Need to Roll: 2+')
    })

    it('shows minimum effective roll of 1 when bonuses exceed difficulty', () => {
      const highCaptain = { engineering: 5, food: 5, security: 8 }
      const crew = createCrew(['security', 'security', 'security'])
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={['security-patrol']}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
          captainStats={highCaptain}
          crew={crew}
        />
      )
      // Difficulty 10 - Captain 8 - Crew 3 - Card 3 = -4, but minimum is 1
      expect(screen.getByTestId('effective-roll')).toHaveTextContent('Need to Roll: 1+')
    })

    it('does not display bonuses section when captainStats not provided', () => {
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          onContinue={vi.fn()}
        />
      )
      expect(screen.queryByTestId('event-bonuses')).not.toBeInTheDocument()
    })

    it('does not display bonuses section after result is shown', () => {
      const successResult: EventResult = {
        success: true,
        total: 12,
      }
      render(
        <EventModal
          event={mockEvent}
          cardHand={mockCards}
          selectedCardIds={[]}
          onSelectCard={vi.fn()}
          onRoll={vi.fn()}
          result={successResult}
          onContinue={vi.fn()}
          captainStats={captainStats}
        />
      )
      expect(screen.queryByTestId('event-bonuses')).not.toBeInTheDocument()
    })
  })
})
