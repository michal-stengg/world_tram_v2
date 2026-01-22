import { calculateRating, PerformanceRating } from '../../logic/rating';

describe('calculateRating', () => {
  describe('3 stars - Express Master', () => {
    it('should return 3 stars for exactly 15 turns', () => {
      const result = calculateRating(15);
      expect(result.stars).toBe(3);
      expect(result.title).toBe('Express Master');
    });

    it('should return 3 stars for less than 15 turns', () => {
      const result = calculateRating(10);
      expect(result.stars).toBe(3);
      expect(result.title).toBe('Express Master');
    });

    it('should return 3 stars for minimum turns (1)', () => {
      const result = calculateRating(1);
      expect(result.stars).toBe(3);
      expect(result.title).toBe('Express Master');
    });
  });

  describe('2 stars - Skilled Conductor', () => {
    it('should return 2 stars for 16 turns (just over 15)', () => {
      const result = calculateRating(16);
      expect(result.stars).toBe(2);
      expect(result.title).toBe('Skilled Conductor');
    });

    it('should return 2 stars for exactly 25 turns', () => {
      const result = calculateRating(25);
      expect(result.stars).toBe(2);
      expect(result.title).toBe('Skilled Conductor');
    });

    it('should return 2 stars for 20 turns (middle of range)', () => {
      const result = calculateRating(20);
      expect(result.stars).toBe(2);
      expect(result.title).toBe('Skilled Conductor');
    });
  });

  describe('1 star - Journey Complete', () => {
    it('should return 1 star for 26 turns (just over 25)', () => {
      const result = calculateRating(26);
      expect(result.stars).toBe(1);
      expect(result.title).toBe('Journey Complete');
    });

    it('should return 1 star for many turns', () => {
      const result = calculateRating(100);
      expect(result.stars).toBe(1);
      expect(result.title).toBe('Journey Complete');
    });

    it('should return 1 star for 30 turns', () => {
      const result = calculateRating(30);
      expect(result.stars).toBe(1);
      expect(result.title).toBe('Journey Complete');
    });
  });

  describe('return type structure', () => {
    it('should return an object with stars and title properties', () => {
      const result = calculateRating(15);
      expect(result).toHaveProperty('stars');
      expect(result).toHaveProperty('title');
      expect(typeof result.stars).toBe('number');
      expect(typeof result.title).toBe('string');
    });

    it('should return stars in range 1-3', () => {
      const results = [
        calculateRating(10),
        calculateRating(20),
        calculateRating(30),
      ];
      results.forEach((result) => {
        expect(result.stars).toBeGreaterThanOrEqual(1);
        expect(result.stars).toBeLessThanOrEqual(3);
      });
    });
  });
});
