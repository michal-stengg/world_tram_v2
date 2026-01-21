import { describe, it, expect } from 'vitest'
import {
  STARTING_RESOURCES,
  MAX_RESOURCES,
  LOW_RESOURCE_THRESHOLD,
  MAX_TURNS,
  DICE_MIN,
  DICE_MAX,
  DISTANCE_PER_COUNTRY,
  BASE_FUEL_CONSUMPTION,
  BASE_FOOD_CONSUMPTION,
  BASE_WATER_CONSUMPTION,
  BASE_MONEY_WAGES,
  COOK_FOOD_PRODUCTION,
  ENGINEER_FUEL_SAVINGS,
  CREW_SIZE,
} from '../../data/constants'

describe('Game Balance Constants', () => {
  describe('STARTING_RESOURCES', () => {
    it('should have all 4 resource types', () => {
      expect(STARTING_RESOURCES).toHaveProperty('food');
      expect(STARTING_RESOURCES).toHaveProperty('fuel');
      expect(STARTING_RESOURCES).toHaveProperty('water');
      expect(STARTING_RESOURCES).toHaveProperty('money');
    });

    it('should have correct starting values', () => {
      expect(STARTING_RESOURCES.food).toBe(50);
      expect(STARTING_RESOURCES.fuel).toBe(100);
      expect(STARTING_RESOURCES.water).toBe(50);
      expect(STARTING_RESOURCES.money).toBe(200);
    });
  });

  describe('MAX_RESOURCES', () => {
    it('should have all 4 resource types', () => {
      expect(MAX_RESOURCES).toHaveProperty('food');
      expect(MAX_RESOURCES).toHaveProperty('fuel');
      expect(MAX_RESOURCES).toHaveProperty('water');
      expect(MAX_RESOURCES).toHaveProperty('money');
    });

    it('should have values greater than or equal to STARTING_RESOURCES', () => {
      expect(MAX_RESOURCES.food).toBeGreaterThanOrEqual(STARTING_RESOURCES.food);
      expect(MAX_RESOURCES.fuel).toBeGreaterThanOrEqual(STARTING_RESOURCES.fuel);
      expect(MAX_RESOURCES.water).toBeGreaterThanOrEqual(STARTING_RESOURCES.water);
      expect(MAX_RESOURCES.money).toBeGreaterThanOrEqual(STARTING_RESOURCES.money);
    });

    it('should have correct maximum values', () => {
      expect(MAX_RESOURCES.food).toBe(100);
      expect(MAX_RESOURCES.fuel).toBe(200);
      expect(MAX_RESOURCES.water).toBe(100);
      expect(MAX_RESOURCES.money).toBe(1000);
    });
  });

  describe('Resource thresholds', () => {
    it('should have LOW_RESOURCE_THRESHOLD at 20 percent', () => {
      expect(LOW_RESOURCE_THRESHOLD).toBe(20);
    });
  });

  describe('Turn limits', () => {
    it('should have MAX_TURNS set to 100', () => {
      expect(MAX_TURNS).toBe(100);
    });
  });

  describe('Movement constants', () => {
    it('should have DICE_MIN at 0', () => {
      expect(DICE_MIN).toBe(0);
    });

    it('should have DICE_MAX at 10', () => {
      expect(DICE_MAX).toBe(10);
    });

    it('should have DISTANCE_PER_COUNTRY at 10', () => {
      expect(DISTANCE_PER_COUNTRY).toBe(10);
    });
  });

  describe('Consumption rates', () => {
    it('should have BASE_FUEL_CONSUMPTION at 5', () => {
      expect(BASE_FUEL_CONSUMPTION).toBe(5);
    });

    it('should have BASE_FOOD_CONSUMPTION at 3', () => {
      expect(BASE_FOOD_CONSUMPTION).toBe(3);
    });

    it('should have BASE_WATER_CONSUMPTION at 2', () => {
      expect(BASE_WATER_CONSUMPTION).toBe(2);
    });

    it('should have BASE_MONEY_WAGES at 10', () => {
      expect(BASE_MONEY_WAGES).toBe(10);
    });
  });

  describe('Production rates', () => {
    it('should have COOK_FOOD_PRODUCTION at 5', () => {
      expect(COOK_FOOD_PRODUCTION).toBe(5);
    });

    it('should have ENGINEER_FUEL_SAVINGS at 2', () => {
      expect(ENGINEER_FUEL_SAVINGS).toBe(2);
    });
  });

  describe('Crew', () => {
    it('should have CREW_SIZE at 4', () => {
      expect(CREW_SIZE).toBe(4);
    });
  });
});
