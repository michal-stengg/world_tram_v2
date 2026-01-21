import { describe, it, expect } from 'vitest';
import {
  countries,
  TOTAL_COUNTRIES,
  getCountryById,
  getCountryByIndex,
} from '../../data/countries';
import type { Country } from '../../types';

describe('countries data', () => {
  describe('countries array', () => {
    it('should have exactly 10 countries', () => {
      expect(countries).toHaveLength(10);
    });

    it('should have France as the first country', () => {
      expect(countries[0].id).toBe('france');
      expect(countries[0].name).toBe('France');
    });

    it('should have USA as the last country', () => {
      expect(countries[9].id).toBe('usa');
      expect(countries[9].name).toBe('USA');
    });

    it('should have countries in correct order', () => {
      const expectedOrder = [
        'france',
        'germany',
        'russia',
        'china',
        'japan',
        'singapore',
        'australia',
        'brazil',
        'canada',
        'usa',
      ];
      const actualOrder = countries.map((c) => c.id);
      expect(actualOrder).toEqual(expectedOrder);
    });

    it('should have all required fields for each country', () => {
      countries.forEach((country: Country) => {
        expect(country.id).toBeDefined();
        expect(typeof country.id).toBe('string');
        expect(country.id.length).toBeGreaterThan(0);

        expect(country.name).toBeDefined();
        expect(typeof country.name).toBe('string');
        expect(country.name.length).toBeGreaterThan(0);

        expect(country.icon).toBeDefined();
        expect(typeof country.icon).toBe('string');
        expect(country.icon.length).toBeGreaterThan(0);

        expect(country.landmark).toBeDefined();
        expect(typeof country.landmark).toBe('string');
        expect(country.landmark.length).toBeGreaterThan(0);

        expect(country.distanceRequired).toBeDefined();
        expect(typeof country.distanceRequired).toBe('number');
        expect(country.distanceRequired).toBeGreaterThan(0);
      });
    });

    it('should have correct data for each country', () => {
      const countryData: Record<string, Partial<Country>> = {
        france: { icon: '🗼', landmark: 'Eiffel Tower in Paris', distanceRequired: 10 },
        germany: { icon: '🏰', landmark: 'Neuschwanstein Castle', distanceRequired: 10 },
        russia: { icon: '🏛️', landmark: 'Red Square in Moscow', distanceRequired: 10 },
        china: { icon: '🏯', landmark: 'The Great Wall', distanceRequired: 10 },
        japan: { icon: '🗻', landmark: 'Mount Fuji', distanceRequired: 10 },
        singapore: { icon: '🌴', landmark: 'Marina Bay Sands', distanceRequired: 10 },
        australia: { icon: '🦘', landmark: 'Sydney Opera House', distanceRequired: 10 },
        brazil: { icon: '🎭', landmark: 'Christ the Redeemer', distanceRequired: 10 },
        canada: { icon: '🍁', landmark: 'Niagara Falls', distanceRequired: 10 },
        usa: { icon: '🗽', landmark: 'Statue of Liberty', distanceRequired: 10 },
      };

      countries.forEach((country) => {
        const expected = countryData[country.id];
        expect(country.icon).toBe(expected.icon);
        expect(country.landmark).toBe(expected.landmark);
        expect(country.distanceRequired).toBe(expected.distanceRequired);
      });
    });
  });

  describe('TOTAL_COUNTRIES', () => {
    it('should equal 10', () => {
      expect(TOTAL_COUNTRIES).toBe(10);
    });

    it('should match the countries array length', () => {
      expect(TOTAL_COUNTRIES).toBe(countries.length);
    });
  });

  describe('getCountryById', () => {
    it('should return France when given "france"', () => {
      const country = getCountryById('france');
      expect(country).toBeDefined();
      expect(country?.name).toBe('France');
      expect(country?.icon).toBe('🗼');
    });

    it('should return USA when given "usa"', () => {
      const country = getCountryById('usa');
      expect(country).toBeDefined();
      expect(country?.name).toBe('USA');
      expect(country?.icon).toBe('🗽');
    });

    it('should return correct country for each valid ID', () => {
      countries.forEach((expected) => {
        const actual = getCountryById(expected.id);
        expect(actual).toEqual(expected);
      });
    });

    it('should return undefined for invalid ID', () => {
      expect(getCountryById('invalid')).toBeUndefined();
      expect(getCountryById('')).toBeUndefined();
      expect(getCountryById('FRANCE')).toBeUndefined(); // case sensitive
    });
  });

  describe('getCountryByIndex', () => {
    it('should return France at index 0', () => {
      const country = getCountryByIndex(0);
      expect(country).toBeDefined();
      expect(country?.id).toBe('france');
      expect(country?.name).toBe('France');
    });

    it('should return USA at index 9', () => {
      const country = getCountryByIndex(9);
      expect(country).toBeDefined();
      expect(country?.id).toBe('usa');
      expect(country?.name).toBe('USA');
    });

    it('should return correct country for each valid index', () => {
      countries.forEach((expected, index) => {
        const actual = getCountryByIndex(index);
        expect(actual).toEqual(expected);
      });
    });

    it('should return undefined for out-of-bounds index', () => {
      expect(getCountryByIndex(-1)).toBeUndefined();
      expect(getCountryByIndex(10)).toBeUndefined();
      expect(getCountryByIndex(100)).toBeUndefined();
    });
  });
});
