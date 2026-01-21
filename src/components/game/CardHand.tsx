import type { BonusCard } from '../../data/cards'
import { CardDisplay } from './CardDisplay'

export interface CardHandProps {
  cards: BonusCard[]
  selectedCardIds: string[]
  onSelectCard: (cardId: string) => void
}

const handStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  gap: '1rem',
  justifyContent: 'center',
  alignItems: 'center',
}

export function CardHand({ cards, selectedCardIds, onSelectCard }: CardHandProps) {
  return (
    <div data-testid="card-hand" style={handStyles}>
      {cards.map((card) => (
        <CardDisplay
          key={card.id}
          card={card}
          selected={selectedCardIds.includes(card.id)}
          onSelect={() => onSelectCard(card.id)}
        />
      ))}
    </div>
  )
}
