// Game Balance Constants for World Tram

// Starting resources
export const STARTING_RESOURCES = {
  food: 50,
  fuel: 100,
  water: 50,
  money: 200,
} as const;

// Maximum resources
export const MAX_RESOURCES = {
  food: 100,
  fuel: 200,
  water: 100,
  money: 1000,
} as const;

// Resource thresholds (for warnings)
export const LOW_RESOURCE_THRESHOLD = 20; // Percentage at which resource bar turns red

// Turn limits
export const MAX_TURNS = 100; // Safety limit

// Movement
export const DICE_MIN = 0;
export const DICE_MAX = 10;
export const DISTANCE_PER_COUNTRY = 10;

// Consumption rates (per turn)
export const BASE_FUEL_CONSUMPTION = 5;
export const BASE_FOOD_CONSUMPTION = 3;
export const BASE_WATER_CONSUMPTION = 2;
export const BASE_MONEY_WAGES = 10;

// Production rates
export const COOK_FOOD_PRODUCTION = 5;
export const ENGINEER_FUEL_SAVINGS = 2;

// Crew
export const CREW_SIZE = 4;

// Security
export const SECURITY_PENALTY_REDUCTION = 0.15;  // 15% per security crew
