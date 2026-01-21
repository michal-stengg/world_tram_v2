/**
 * Country route data for World Tram game
 *
 * The journey takes players through 10 countries,
 * starting in France and ending in the USA.
 */

import type { Country } from '../types';

/**
 * All countries in the game, in order of the journey
 */
export const countries: Country[] = [
  {
    id: 'france',
    name: 'France',
    icon: '🗼',
    landmark: 'Eiffel Tower in Paris',
    distanceRequired: 10,
  },
  {
    id: 'germany',
    name: 'Germany',
    icon: '🏰',
    landmark: 'Neuschwanstein Castle',
    distanceRequired: 10,
  },
  {
    id: 'russia',
    name: 'Russia',
    icon: '🏛️',
    landmark: 'Red Square in Moscow',
    distanceRequired: 10,
  },
  {
    id: 'china',
    name: 'China',
    icon: '🏯',
    landmark: 'The Great Wall',
    distanceRequired: 10,
  },
  {
    id: 'japan',
    name: 'Japan',
    icon: '🗻',
    landmark: 'Mount Fuji',
    distanceRequired: 10,
  },
  {
    id: 'singapore',
    name: 'Singapore',
    icon: '🌴',
    landmark: 'Marina Bay Sands',
    distanceRequired: 10,
  },
  {
    id: 'australia',
    name: 'Australia',
    icon: '🦘',
    landmark: 'Sydney Opera House',
    distanceRequired: 10,
  },
  {
    id: 'brazil',
    name: 'Brazil',
    icon: '🎭',
    landmark: 'Christ the Redeemer',
    distanceRequired: 10,
  },
  {
    id: 'canada',
    name: 'Canada',
    icon: '🍁',
    landmark: 'Niagara Falls',
    distanceRequired: 10,
  },
  {
    id: 'usa',
    name: 'USA',
    icon: '🗽',
    landmark: 'Statue of Liberty',
    distanceRequired: 10,
  },
];

/**
 * Total number of countries in the journey
 */
export const TOTAL_COUNTRIES: number = countries.length;

/**
 * Get a country by its unique ID
 * @param id - The country ID to search for
 * @returns The country if found, undefined otherwise
 */
export function getCountryById(id: string): Country | undefined {
  return countries.find((country) => country.id === id);
}

/**
 * Get a country by its position in the journey (0-indexed)
 * @param index - The index of the country (0 = France, 9 = USA)
 * @returns The country if index is valid, undefined otherwise
 */
export function getCountryByIndex(index: number): Country | undefined {
  return countries[index];
}
