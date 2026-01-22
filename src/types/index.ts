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

// Maximum resource limits (can be modified by carts)
export interface MaxResources {
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

// Cart effect types
export type CartEffectType = 'maxFuel' | 'maxFood' | 'maxWater' | 'fuelEfficiency' | 'security' | 'income';

// Cart definition
export interface Cart {
  id: string;
  name: string;
  icon: string;
  price: number;
  effectType: CartEffectType;
  effectValue: number;
  description: string;
}

// Mini-game types - different gameplay mechanics
export type MiniGameType = 'catcher' | 'memory' | 'timing';

// Mini-game reward types - what resource the player earns
export type MiniGameRewardType = 'food' | 'money';

// Mini-game definition
export interface MiniGame {
  id: string;
  name: string;
  countryId: string;       // references Country.id
  type: MiniGameType;
  icon: string;            // emoji representing the mini-game
  description: string;
  rewardType: MiniGameRewardType;
  maxReward: number;
}

// Mini-game result after completion
export interface MiniGameResult {
  score: number;
  maxScore: number;
  reward: number;
}

// Cargo rarity levels
export type CargoRarity = 'common' | 'rare' | 'legendary';

// Cargo reward types - what resource the cargo provides
export type CargoRewardType = 'money' | 'fuel' | 'food' | 'water';

// Cargo item definition
export interface CargoItem {
  id: string;
  name: string;
  icon: string;
  rarity: CargoRarity;
  rewardType: CargoRewardType;
  rewardAmount: number;
  description: string;
}

// Represents a cargo item that was discovered
export interface CargoDiscovery {
  item: CargoItem;
  foundAtCountry: string;  // country id where it was found
  turnFound: number;
}

// Result of opening a cargo item
export interface CargoReward {
  rewardType: CargoRewardType;
  amount: number;
}

// Quiz question definition
export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];          // array of 4 answer choices
  correctAnswer: string;      // the correct answer text
  funFact: string;            // interesting fact shown after answering
  imageUrl?: string;          // path to image in public folder (shown in feedback)
}

// Country quiz definition
export interface CountryQuiz {
  id: string;
  countryId: string;          // references Country.id
  name: string;               // country name for display
  questions: QuizQuestion[];  // array of 3 questions
}

// Quiz result after completion
export interface QuizResult {
  score: number;              // 0-3
  totalQuestions: number;     // always 3
  reward: number;             // money earned
  rating: string;             // e.g., "Quiz Master!", "Great Job!"
}

// Resource shop cart for purchasing supplies
export interface ResourceCart {
  food: number;
  fuel: number;
  water: number;
}

// Prices for resources at a station
export interface ResourcePrices {
  food: number;    // price per unit
  fuel: number;
  water: number;
}

// Country-specific pricing
export interface CountryPrices {
  countryId: string;
  prices: ResourcePrices;
  theme: string;  // flavor text like "French Market"
}

// Re-export leaderboard types
export * from './leaderboard'
