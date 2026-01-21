import { describe, it, expect } from 'vitest';
import { drawInitialHand, playCards, replenishHand } from '../../logic/cards';
import { cards } from '../../data/cards';
import type { BonusCard } from '../../data/cards';

describe('card hand management', () => {
  describe('drawInitialHand', () => {
    it('should return exactly 3 cards', () => {
      const hand = drawInitialHand();
      expect(hand.length).toBe(3);
    });

    it('should return valid BonusCards with all required properties', () => {
      const hand = drawInitialHand();
      hand.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('stat');
        expect(card).toHaveProperty('bonus');
        expect(card).toHaveProperty('description');
      });
    });

    it('should return cards from the cards pool', () => {
      const hand = drawInitialHand();
      const cardIds = cards.map((c) => c.id);
      hand.forEach((card) => {
        expect(cardIds).toContain(card.id);
      });
    });

    it('should return different cards on multiple draws (randomness check)', () => {
      const hands: string[][] = [];
      for (let i = 0; i < 20; i++) {
        const hand = drawInitialHand();
        hands.push(hand.map((c) => c.id).sort());
      }
      // Check that we don't get the exact same hand every time
      const uniqueHands = new Set(hands.map((h) => h.join(',')));
      expect(uniqueHands.size).toBeGreaterThan(1);
    });
  });

  describe('playCards', () => {
    it('should remove specified cards from hand', () => {
      const hand: BonusCard[] = [
        cards[0], // security-patrol
        cards[1], // quick-repairs
        cards[2], // emergency-rations
      ];
      const result = playCards(hand, [cards[0].id]);
      expect(result.length).toBe(2);
      expect(result.find((c) => c.id === cards[0].id)).toBeUndefined();
    });

    it('should remove multiple cards at once', () => {
      const hand: BonusCard[] = [
        cards[0], // security-patrol
        cards[1], // quick-repairs
        cards[2], // emergency-rations
      ];
      const result = playCards(hand, [cards[0].id, cards[2].id]);
      expect(result.length).toBe(1);
      expect(result[0].id).toBe(cards[1].id);
    });

    it('should return original hand if no cards specified', () => {
      const hand: BonusCard[] = [cards[0], cards[1], cards[2]];
      const result = playCards(hand, []);
      expect(result.length).toBe(3);
    });

    it('should ignore card ids that are not in hand', () => {
      const hand: BonusCard[] = [cards[0], cards[1]];
      const result = playCards(hand, ['nonexistent-card']);
      expect(result.length).toBe(2);
    });

    it('should not modify the original hand array', () => {
      const hand: BonusCard[] = [cards[0], cards[1], cards[2]];
      const originalLength = hand.length;
      playCards(hand, [cards[0].id]);
      expect(hand.length).toBe(originalLength);
    });
  });

  describe('replenishHand', () => {
    it('should bring hand back to 3 cards when hand has fewer', () => {
      const hand: BonusCard[] = [cards[0]];
      const result = replenishHand(hand);
      expect(result.length).toBe(3);
    });

    it('should add 2 cards when hand has 1 card', () => {
      const hand: BonusCard[] = [cards[0]];
      const result = replenishHand(hand);
      expect(result.length).toBe(3);
      // Original card should still be there
      expect(result.find((c) => c.id === cards[0].id)).toBeDefined();
    });

    it('should add 1 card when hand has 2 cards', () => {
      const hand: BonusCard[] = [cards[0], cards[1]];
      const result = replenishHand(hand);
      expect(result.length).toBe(3);
      // Original cards should still be there
      expect(result.find((c) => c.id === cards[0].id)).toBeDefined();
      expect(result.find((c) => c.id === cards[1].id)).toBeDefined();
    });

    it('should not exceed 3 cards when hand already has 3', () => {
      const hand: BonusCard[] = [cards[0], cards[1], cards[2]];
      const result = replenishHand(hand);
      expect(result.length).toBe(3);
    });

    it('should return new cards that are valid BonusCards', () => {
      const hand: BonusCard[] = [];
      const result = replenishHand(hand);
      const cardIds = cards.map((c) => c.id);
      result.forEach((card) => {
        expect(cardIds).toContain(card.id);
      });
    });

    it('should not modify the original hand array', () => {
      const hand: BonusCard[] = [cards[0]];
      const originalLength = hand.length;
      replenishHand(hand);
      expect(hand.length).toBe(originalLength);
    });

    it('should handle empty hand by returning 3 cards', () => {
      const hand: BonusCard[] = [];
      const result = replenishHand(hand);
      expect(result.length).toBe(3);
    });
  });
});
