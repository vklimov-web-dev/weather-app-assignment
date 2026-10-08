import { describe, expect, it } from 'vitest'

import type { City } from './cityCatalog'
import {
  createCitySearchIndex,
  formatCityLabel,
  getCitySuggestionSuffix,
  normalizeSearchText,
  searchCities,
} from './citySearch'

const city = (
  id: number,
  name: string,
  state = '',
  country = 'CZ',
): City => ({
  id,
  name,
  state,
  country,
  coord: { lon: 0, lat: 0 },
})

const cities = [
  city(1, 'Praha'),
  city(2, 'České Budějovice'),
  city(3, 'Nová Ves'),
  city(4, 'Veselí nad Moravou'),
  city(5, 'Praha', 'Hlavní město Praha'),
]

const index = createCitySearchIndex(cities)

describe('normalizeSearchText', () => {
  it('ignores casing, surrounding whitespace and diacritics', () => {
    expect(normalizeSearchText('  ČESKÉ  ')).toBe('ceske')
  })
})

describe('searchCities', () => {
  it('returns exact matches before prefix and substring matches', () => {
    const localCities = [
      city(10, 'New York'),
      city(11, 'York'),
      city(12, 'Yorktown'),
    ]

    expect(searchCities(createCitySearchIndex(localCities), 'york')).toEqual([
      localCities[1],
      localCities[2],
      localCities[0],
    ])
  })

  it('finds city names without requiring diacritics', () => {
    expect(searchCities(index, 'ceske')).toEqual([cities[1]])
  })

  it('keeps a selected city searchable while its full label is edited', () => {
    const selectedCity = city(20, 'New York Mills', 'MN', 'US')
    const selectedCityIndex = createCitySearchIndex([selectedCity])

    expect(
      searchCities(selectedCityIndex, 'New York Mills, MN, U'),
    ).toEqual([selectedCity])
  })

  it('keeps duplicate city records and respects the result limit', () => {
    expect(searchCities(index, 'praha')).toEqual([cities[0], cities[4]])
    expect(searchCities(index, 'praha', 1)).toEqual([cities[0]])
  })

  it('returns no results for an empty query or a non-positive limit', () => {
    expect(searchCities(index, '   ')).toEqual([])
    expect(searchCities(index, 'praha', 0)).toEqual([])
  })
})

describe('formatCityLabel', () => {
  it('includes available state and country information', () => {
    expect(formatCityLabel(cities[4])).toBe(
      'Praha, Hlavní město Praha, CZ',
    )
    expect(formatCityLabel(cities[0])).toBe('Praha, CZ')
  })
})

describe('getCitySuggestionSuffix', () => {
  it('returns the remaining label of a prefix match', () => {
    expect(getCitySuggestionSuffix('ceske', cities[1])).toBe(
      ' Budějovice, CZ',
    )
  })

  it('does not suggest text for a substring match or a complete label', () => {
    const newYork = city(30, 'New York', 'NY', 'US')

    expect(getCitySuggestionSuffix('York', newYork)).toBe('')
    expect(getCitySuggestionSuffix('New York, NY, US', newYork)).toBe('')
  })
})
