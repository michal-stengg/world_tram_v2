import { describe, it, expect } from 'vitest';
import { calculateQuizReward, getQuizRating } from '../../logic/quizzes';

describe('quizzes logic', () => {
  describe('calculateQuizReward', () => {
    it('returns 30 for 3 correct answers', () => {
      expect(calculateQuizReward(3)).toBe(30);
    });

    it('returns 20 for 2 correct answers', () => {
      expect(calculateQuizReward(2)).toBe(20);
    });

    it('returns 10 for 1 correct answer', () => {
      expect(calculateQuizReward(1)).toBe(10);
    });

    it('returns 5 for 0 correct answers (participation reward)', () => {
      expect(calculateQuizReward(0)).toBe(5);
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
