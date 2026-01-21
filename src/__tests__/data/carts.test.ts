import { describe, it, expect } from 'vitest';
import { carts, getCartById } from '../../data/carts';

describe('carts data', () => {
  describe('carts array', () => {
    it('should have 6 carts', () => {
      expect(carts).toHaveLength(6);
    });

    it('should have all required properties for each cart', () => {
      carts.forEach((cart) => {
        expect(cart).toHaveProperty('id');
        expect(cart).toHaveProperty('name');
        expect(cart).toHaveProperty('icon');
        expect(cart).toHaveProperty('price');
        expect(cart).toHaveProperty('effectType');
        expect(cart).toHaveProperty('effectValue');
        expect(cart).toHaveProperty('description');
      });
    });

    it('should have all positive prices', () => {
      carts.forEach((cart) => {
        expect(cart.price).toBeGreaterThan(0);
      });
    });

    it('should have prices in the 50-150 range', () => {
      carts.forEach((cart) => {
        expect(cart.price).toBeGreaterThanOrEqual(50);
        expect(cart.price).toBeLessThanOrEqual(150);
      });
    });

    it('should have all positive effect values', () => {
      carts.forEach((cart) => {
        expect(cart.effectValue).toBeGreaterThan(0);
      });
    });

    it('should have unique ids', () => {
      const ids = carts.map((cart) => cart.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(carts.length);
    });
  });

  describe('Fuel Cart', () => {
    it('should have correct data', () => {
      const fuelCart = carts.find((c) => c.id === 'fuel-cart');
      expect(fuelCart).toBeDefined();
      expect(fuelCart!.name).toBe('Fuel Cart');
      expect(fuelCart!.icon).toBe('⛽');
      expect(fuelCart!.effectType).toBe('maxFuel');
      expect(fuelCart!.description).toBe('Extra fuel storage tank');
    });
  });

  describe('Food Cart', () => {
    it('should have correct data', () => {
      const foodCart = carts.find((c) => c.id === 'food-cart');
      expect(foodCart).toBeDefined();
      expect(foodCart!.name).toBe('Food Cart');
      expect(foodCart!.icon).toBe('🍱');
      expect(foodCart!.effectType).toBe('maxFood');
      expect(foodCart!.description).toBe('Refrigerated food storage');
    });
  });

  describe('Water Cart', () => {
    it('should have correct data', () => {
      const waterCart = carts.find((c) => c.id === 'water-cart');
      expect(waterCart).toBeDefined();
      expect(waterCart!.name).toBe('Water Cart');
      expect(waterCart!.icon).toBe('💧');
      expect(waterCart!.effectType).toBe('maxWater');
      expect(waterCart!.description).toBe('Clean water reservoir');
    });
  });

  describe('Spare Parts Cart', () => {
    it('should have correct data', () => {
      const sparePartsCart = carts.find((c) => c.id === 'spare-parts-cart');
      expect(sparePartsCart).toBeDefined();
      expect(sparePartsCart!.name).toBe('Spare Parts Cart');
      expect(sparePartsCart!.icon).toBe('🔧');
      expect(sparePartsCart!.effectType).toBe('fuelEfficiency');
      expect(sparePartsCart!.description).toBe('Tools and spare parts reduce fuel consumption');
    });
  });

  describe('Security Cart', () => {
    it('should have correct data', () => {
      const securityCart = carts.find((c) => c.id === 'security-cart');
      expect(securityCart).toBeDefined();
      expect(securityCart!.name).toBe('Security Cart');
      expect(securityCart!.icon).toBe('🛡️');
      expect(securityCart!.effectType).toBe('security');
      expect(securityCart!.description).toBe('Reinforced cart with security equipment');
    });
  });

  describe('Passenger Cart', () => {
    it('should have correct data', () => {
      const passengerCart = carts.find((c) => c.id === 'passenger-cart');
      expect(passengerCart).toBeDefined();
      expect(passengerCart!.name).toBe('Passenger Cart');
      expect(passengerCart!.icon).toBe('🚃');
      expect(passengerCart!.effectType).toBe('income');
      expect(passengerCart!.description).toBe('Carry passengers for extra income at stations');
    });
  });

  describe('getCartById', () => {
    it('should return correct cart for valid id', () => {
      const fuelCart = getCartById('fuel-cart');
      expect(fuelCart).toBeDefined();
      expect(fuelCart!.name).toBe('Fuel Cart');

      const foodCart = getCartById('food-cart');
      expect(foodCart).toBeDefined();
      expect(foodCart!.name).toBe('Food Cart');

      const waterCart = getCartById('water-cart');
      expect(waterCart).toBeDefined();
      expect(waterCart!.name).toBe('Water Cart');

      const sparePartsCart = getCartById('spare-parts-cart');
      expect(sparePartsCart).toBeDefined();
      expect(sparePartsCart!.name).toBe('Spare Parts Cart');

      const securityCart = getCartById('security-cart');
      expect(securityCart).toBeDefined();
      expect(securityCart!.name).toBe('Security Cart');

      const passengerCart = getCartById('passenger-cart');
      expect(passengerCart).toBeDefined();
      expect(passengerCart!.name).toBe('Passenger Cart');
    });

    it('should return undefined for invalid id', () => {
      expect(getCartById('invalid')).toBeUndefined();
      expect(getCartById('')).toBeUndefined();
      expect(getCartById('FUEL-CART')).toBeUndefined(); // case sensitive
    });
  });
});
