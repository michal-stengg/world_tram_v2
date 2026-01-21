/**
 * Core type definitions for World Tram game
 */

// Game screens - using string literal union type for flexibility
export type GameScreen = 'intro' | 'captainSelect' | 'trainSelect' | 'dashboard' | 'victory' | 'gameOver';

// Captain statistics (each stat ranges 1-6)
export interface CaptainStats {
  engineering: number;  // 1-6
  food: number;         // 1-6
  security: number;     // 1-6
}

// Captain character definition
export interface Captain {
  id: string;
  name: string;
  origin: string;
  description: string;
  portrait: string;      // emoji representing the captain
  stats: CaptainStats;
}

// Train statistics (each stat ranges 1-6)
export interface TrainStats {
  speed: number;        // 1-6
  reliability: number;  // 1-6
  power: number;        // 1-6
}

// Train definition
export interface Train {
  id: string;
  name: string;
  origin: string;
  character: string;    // description of train's personality
  sprite: string;       // emoji representation
  stats: TrainStats;
}

// Crew member roles - using string literal union type for flexibility
export type CrewRole = 'engineer' | 'cook' | 'security' | 'free';

// Crew member definition
export interface CrewMember {
  id: string;
  name: string;
  role: CrewRole;
  avatar: string;  // emoji representing the crew member
}

// Game resources
export interface Resources {
  food: number;
  fuel: number;
  water: number;
  money: number;
}

// Country/route definition
export interface Country {
  id: string;
  name: string;
  icon: string;           // emoji representing the country
  landmark: string;       // famous landmark description
  distanceRequired: number; // distance units needed to reach next country
}
