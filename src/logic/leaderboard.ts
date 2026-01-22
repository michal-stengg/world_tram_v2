/**
 * Leaderboard logic module for World Tram game
 * Handles score calculation, leaderboard storage, and entry management
 */

import type { Resources } from '../types';
import type { LeaderboardEntry, LeaderboardQualification } from '../types/leaderboard';

// Constants
export const LEADERBOARD_STORAGE_KEY = 'world_tram_leaderboard';
export const MAX_ENTRIES = 10;
export const MAX_NAME_LENGTH = 20;

/**
 * Calculate total score from resources
 * Score is the sum of all resource values
 */
export function calculateScore(resources: Resources): number {
  return resources.food + resources.fuel + resources.water + resources.money;
}

/**
 * Format a date for leaderboard display
 * Returns format like "May 20, 2026"
 * Accepts either a Date object or ISO date string
 */
export function formatLeaderboardDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validate player name for leaderboard entry
 * Name must be 1-20 characters after trimming whitespace
 */
export function validatePlayerName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length >= 1 && trimmed.length <= MAX_NAME_LENGTH;
}

/**
 * Load leaderboard entries from localStorage
 * Returns sorted array (by score descending), limited to MAX_ENTRIES
 * Returns empty array if nothing stored or invalid JSON
 */
export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const stored = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const entries: LeaderboardEntry[] = JSON.parse(stored);

    // Sort by score descending and limit to MAX_ENTRIES
    return entries
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
  } catch {
    // Return empty array on parse error
    return [];
  }
}

/**
 * Save leaderboard entries to localStorage
 * Sorts by score descending and limits to MAX_ENTRIES before saving
 */
export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  // Sort by score descending and limit to MAX_ENTRIES
  const sorted = [...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(sorted));
}

/**
 * Check if a score qualifies for the leaderboard
 * Returns qualification status and rank position
 */
export function checkQualification(score: number): LeaderboardQualification {
  const entries = loadLeaderboard();

  // If less than MAX_ENTRIES, always qualifies
  if (entries.length < MAX_ENTRIES) {
    // Find the rank position (count how many have higher scores, add 1)
    const rank = entries.filter(e => e.score > score).length + 1;
    return { qualifies: true, rank };
  }

  // If MAX_ENTRIES exist, score must beat the lowest
  const lowestScore = entries[entries.length - 1].score;

  if (score > lowestScore) {
    // Find the rank position (count how many have higher scores, add 1)
    const rank = entries.filter(e => e.score > score).length + 1;
    return { qualifies: true, rank };
  }

  // Doesn't qualify
  return { qualifies: false, rank: 0 };
}

/**
 * Add a new entry to the leaderboard
 * Creates entry with UUID, truncates name if needed, and saves
 */
export function addLeaderboardEntry(name: string, score: number): LeaderboardEntry {
  const entry: LeaderboardEntry = {
    id: crypto.randomUUID(),
    name: name.slice(0, MAX_NAME_LENGTH),
    score,
    date: new Date().toISOString(),
  };

  const entries = loadLeaderboard();
  entries.push(entry);
  saveLeaderboard(entries);

  return entry;
}
