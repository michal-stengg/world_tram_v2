/**
 * Leaderboard type definitions for World Tram game
 */

// Individual leaderboard entry
export interface LeaderboardEntry {
  id: string;           // UUID
  name: string;         // max 20 characters
  score: number;        // total resources (food + fuel + water + money)
  date: string;         // ISO date for storage
}

// Result of checking if a score qualifies for leaderboard
export interface LeaderboardQualification {
  qualifies: boolean;
  rank: number;         // 1-10, or 0 if doesn't qualify
}
