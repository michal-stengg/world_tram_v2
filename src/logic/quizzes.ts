/**
 * Calculate quiz reward based on number of correct answers
 * @param correctCount Number of correct answers (0-3)
 * @returns Money reward amount
 */
export function calculateQuizReward(correctCount: number): number {
  // 3/3 = $45, 2/3 = $30, 1/3 = $15, 0/3 = $8 (participation) - increased by 50%
  switch (correctCount) {
    case 3:
      return 45;
    case 2:
      return 30;
    case 1:
      return 15;
    default:
      return 8;
  }
}

/**
 * Get rating text based on quiz performance
 * @param correctCount Number of correct answers (0-3)
 * @returns Rating string with emoji
 */
export function getQuizRating(correctCount: number): string {
  switch (correctCount) {
    case 3:
      return '🌟 Quiz Master!';
    case 2:
      return '⭐ Great Job!';
    case 1:
      return '👍 Good Try!';
    default:
      return '📚 Keep Learning!';
  }
}
