import { describe, it, expect } from 'vitest';
import { calculateQuizReward, getQuizRating } from '../../logic/quizzes';

describe('quizzes logic', () => {
  describe('calculateQuizReward', () => {
    it('returns 45 for 3 correct answers', () => {
      expect(calculateQuizReward(3)).toBe(45);
    });

    it('returns 30 for 2 correct answers', () => {
      expect(calculateQuizReward(2)).toBe(30);
    });

    it('returns 15 for 1 correct answer', () => {
      expect(calculateQuizReward(1)).toBe(15);
    });

    it('returns 8 for 0 correct answers (participation reward)', () => {
      expect(calculateQuizReward(0)).toBe(8);
    });
  });

  describe('getQuizRating', () => {
    it('returns "🌟 Quiz Master!" for 3 correct answers', () => {
      expect(getQuizRating(3)).toBe('🌟 Quiz Master!');
    });

    it('returns "⭐ Great Job!" for 2 correct answers', () => {
      expect(getQuizRating(2)).toBe('⭐ Great Job!');
    });

    it('returns "👍 Good Try!" for 1 correct answer', () => {
      expect(getQuizRating(1)).toBe('👍 Good Try!');
    });

    it('returns "📚 Keep Learning!" for 0 correct answers', () => {
      expect(getQuizRating(0)).toBe('📚 Keep Learning!');
    });
  });
});
