export interface PerformanceRating {
  stars: number; // 1-3
  title: string;
}

/**
 * Calculate performance rating based on turn count.
 * - ≤15 turns = 3 stars, "Express Master"
 * - ≤25 turns = 2 stars, "Skilled Conductor"
 * - >25 turns = 1 star, "Journey Complete"
 */
export function calculateRating(turnCount: number): PerformanceRating {
  if (turnCount <= 15) {
    return {
      stars: 3,
      title: 'Express Master',
    };
  }

  if (turnCount <= 25) {
    return {
      stars: 2,
      title: 'Skilled Conductor',
    };
  }

  return {
    stars: 1,
    title: 'Journey Complete',
  };
}
