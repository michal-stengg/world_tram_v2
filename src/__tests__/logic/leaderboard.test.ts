/**
 * Tests for leaderboard logic module
 * TDD: Write tests first, then implement
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  calculateScore,
  formatLeaderboardDate,
  loadLeaderboard,
  saveLeaderboard,
  checkQualification,
  addLeaderboardEntry,
  validatePlayerName,
  LEADERBOARD_STORAGE_KEY,
  MAX_ENTRIES,
  MAX_NAME_LENGTH,
} from '../../logic/leaderboard';
import type { Resources } from '../../types';
import type { LeaderboardEntry } from '../../types/leaderboard';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// Mock crypto.randomUUID
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
vi.stubGlobal('crypto', {
  randomUUID: vi.fn(() => mockUUID),
});

describe('Leaderboard Constants', () => {
  it('should export correct storage key', () => {
    expect(LEADERBOARD_STORAGE_KEY).toBe('world_tram_leaderboard');
  });

  it('should export max entries as 10', () => {
    expect(MAX_ENTRIES).toBe(10);
  });

  it('should export max name length as 20', () => {
    expect(MAX_NAME_LENGTH).toBe(20);
  });
});

describe('calculateScore', () => {
  it('should sum all resources correctly', () => {
    const resources: Resources = { food: 10, fuel: 20, water: 30, money: 40 };
    expect(calculateScore(resources)).toBe(100);
  });

  it('should handle zero resources', () => {
    const resources: Resources = { food: 0, fuel: 0, water: 0, money: 0 };
    expect(calculateScore(resources)).toBe(0);
  });

  it('should handle large values', () => {
    const resources: Resources = { food: 1000, fuel: 2000, water: 3000, money: 4000 };
    expect(calculateScore(resources)).toBe(10000);
  });
});

describe('formatLeaderboardDate', () => {
  it('should format date as "Month Day, Year"', () => {
    const date = new Date('2026-05-20');
    expect(formatLeaderboardDate(date)).toBe('May 20, 2026');
  });

  it('should format January date correctly', () => {
    const date = new Date('2026-01-01');
    expect(formatLeaderboardDate(date)).toBe('January 1, 2026');
  });

  it('should format December date correctly', () => {
    const date = new Date('2025-12-25');
    expect(formatLeaderboardDate(date)).toBe('December 25, 2025');
  });

  it('should accept ISO date string', () => {
    expect(formatLeaderboardDate('2026-05-20T12:00:00.000Z')).toBe('May 20, 2026');
  });
});

describe('validatePlayerName', () => {
  it('should return true for valid name', () => {
    expect(validatePlayerName('Captain')).toBe(true);
  });

  it('should return true for name at max length', () => {
    expect(validatePlayerName('A'.repeat(20))).toBe(true);
  });

  it('should return false for empty string', () => {
    expect(validatePlayerName('')).toBe(false);
  });

  it('should return false for whitespace only', () => {
    expect(validatePlayerName('   ')).toBe(false);
  });

  it('should return false for name exceeding 20 characters', () => {
    expect(validatePlayerName('A'.repeat(21))).toBe(false);
  });

  it('should trim whitespace before validation', () => {
    expect(validatePlayerName('  Valid  ')).toBe(true);
  });

  it('should return true for single character name', () => {
    expect(validatePlayerName('A')).toBe(true);
  });
});

describe('loadLeaderboard', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('should return empty array when nothing stored', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    expect(loadLeaderboard()).toEqual([]);
  });

  it('should return stored entries', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Player1', score: 100, date: '2026-01-01' },
      { id: '2', name: 'Player2', score: 90, date: '2026-01-02' },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    expect(loadLeaderboard()).toEqual(entries);
  });

  it('should return entries sorted by score descending', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Low', score: 50, date: '2026-01-01' },
      { id: '2', name: 'High', score: 100, date: '2026-01-02' },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = loadLeaderboard();
    expect(result[0].score).toBe(100);
    expect(result[1].score).toBe(50);
  });

  it('should limit to 10 entries', () => {
    const entries: LeaderboardEntry[] = Array.from({ length: 15 }, (_, i) => ({
      id: `${i}`,
      name: `Player${i}`,
      score: 100 - i,
      date: '2026-01-01',
    }));
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    expect(loadLeaderboard()).toHaveLength(10);
  });

  it('should return empty array on invalid JSON', () => {
    localStorageMock.getItem.mockReturnValueOnce('invalid json');
    expect(loadLeaderboard()).toEqual([]);
  });
});

describe('saveLeaderboard', () => {
  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem.mockClear();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('should save entries to localStorage', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Player1', score: 100, date: '2026-01-01' },
    ];
    saveLeaderboard(entries);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      LEADERBOARD_STORAGE_KEY,
      JSON.stringify(entries)
    );
  });

  it('should sort entries by score descending before saving', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Low', score: 50, date: '2026-01-01' },
      { id: '2', name: 'High', score: 100, date: '2026-01-02' },
    ];
    saveLeaderboard(entries);
    const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedData[0].score).toBe(100);
    expect(savedData[1].score).toBe(50);
  });

  it('should limit to 10 entries before saving', () => {
    const entries: LeaderboardEntry[] = Array.from({ length: 15 }, (_, i) => ({
      id: `${i}`,
      name: `Player${i}`,
      score: 100 - i,
      date: '2026-01-01',
    }));
    saveLeaderboard(entries);
    const savedData = JSON.parse(localStorageMock.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(10);
  });
});

describe('checkQualification', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
  });

  it('should qualify if leaderboard is empty', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const result = checkQualification(100);
    expect(result.qualifies).toBe(true);
    expect(result.rank).toBe(1);
  });

  it('should qualify with correct rank if less than 10 entries', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Player1', score: 200, date: '2026-01-01' },
      { id: '2', name: 'Player2', score: 100, date: '2026-01-02' },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = checkQualification(150);
    expect(result.qualifies).toBe(true);
    expect(result.rank).toBe(2);
  });

  it('should qualify at last position if less than 10 entries and lowest score', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Player1', score: 200, date: '2026-01-01' },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = checkQualification(50);
    expect(result.qualifies).toBe(true);
    expect(result.rank).toBe(2);
  });

  it('should qualify if score beats lowest entry in full leaderboard', () => {
    const entries: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: `Player${i}`,
      score: 100 - i * 5, // 100, 95, 90, 85, 80, 75, 70, 65, 60, 55
      date: '2026-01-01',
    }));
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = checkQualification(60); // Beats 55
    expect(result.qualifies).toBe(true);
    expect(result.rank).toBe(9);
  });

  it('should not qualify if score equals lowest in full leaderboard', () => {
    const entries: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: `Player${i}`,
      score: 100 - i * 5, // lowest is 55
      date: '2026-01-01',
    }));
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = checkQualification(55);
    expect(result.qualifies).toBe(false);
    expect(result.rank).toBe(0);
  });

  it('should not qualify if score is below lowest in full leaderboard', () => {
    const entries: LeaderboardEntry[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: `Player${i}`,
      score: 100 - i * 5,
      date: '2026-01-01',
    }));
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = checkQualification(50);
    expect(result.qualifies).toBe(false);
    expect(result.rank).toBe(0);
  });

  it('should calculate correct rank for top score', () => {
    const entries: LeaderboardEntry[] = [
      { id: '1', name: 'Player1', score: 100, date: '2026-01-01' },
      { id: '2', name: 'Player2', score: 50, date: '2026-01-02' },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(entries));
    const result = checkQualification(200);
    expect(result.qualifies).toBe(true);
    expect(result.rank).toBe(1);
  });
});

describe('addLeaderboardEntry', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.stubGlobal('localStorage', localStorageMock);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should create entry with UUID', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const entry = addLeaderboardEntry('Captain', 100);
    expect(entry.id).toBe(mockUUID);
  });

  it('should create entry with provided name', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const entry = addLeaderboardEntry('Captain', 100);
    expect(entry.name).toBe('Captain');
  });

  it('should truncate name to 20 characters', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const longName = 'A'.repeat(25);
    const entry = addLeaderboardEntry(longName, 100);
    expect(entry.name).toBe('A'.repeat(20));
  });

  it('should create entry with provided score', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const entry = addLeaderboardEntry('Captain', 100);
    expect(entry.score).toBe(100);
  });

  it('should create entry with current ISO date', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const entry = addLeaderboardEntry('Captain', 100);
    expect(entry.date).toBe('2026-05-20T12:00:00.000Z');
  });

  it('should add entry to leaderboard and save', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    addLeaderboardEntry('Captain', 100);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should return the created entry', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    const entry = addLeaderboardEntry('Captain', 100);
    expect(entry).toEqual({
      id: mockUUID,
      name: 'Captain',
      score: 100,
      date: '2026-05-20T12:00:00.000Z',
    });
  });
});
