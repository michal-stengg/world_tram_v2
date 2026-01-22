import type { CountryPrices } from '../types'

/**
 * Country-specific resource prices
 * Prices reflect local economy and resource availability
 */
export const countryPrices: CountryPrices[] = [
  {
    countryId: 'france',
    prices: { food: 4, fuel: 3, water: 2 },
    theme: 'French Market',
  },
  {
    countryId: 'germany',
    prices: { food: 3, fuel: 2, water: 3 },
    theme: 'German Market',
  },
  {
    countryId: 'russia',
    prices: { food: 4, fuel: 4, water: 2 },
    theme: 'Russian Market',
  },
  {
    countryId: 'china',
    prices: { food: 2, fuel: 3, water: 3 },
    theme: 'Chinese Market',
  },
  {
    countryId: 'japan',
    prices: { food: 3, fuel: 4, water: 2 },
    theme: 'Japanese Market',
  },
  {
    countryId: 'singapore',
    prices: { food: 3, fuel: 3, water: 4 },
    theme: 'Singapore Market',
  },
  {
    countryId: 'australia',
    prices: { food: 3, fuel: 3, water: 5 },
    theme: 'Australian Market',
  },
  {
    countryId: 'brazil',
    prices: { food: 2, fuel: 3, water: 2 },
    theme: 'Brazilian Market',
  },
  {
    countryId: 'canada',
    prices: { food: 3, fuel: 2, water: 2 },
    theme: 'Canadian Market',
  },
  {
    countryId: 'usa',
    prices: { food: 3, fuel: 2, water: 3 },
    theme: 'American Market',
  },
]

/**
 * Get prices for a specific country
 * @param countryId - The country ID to get prices for
 * @returns The country prices if found, undefined otherwise
 */
export function getPricesForCountry(countryId: string): CountryPrices | undefined {
  return countryPrices.find((cp) => cp.countryId === countryId)
}
