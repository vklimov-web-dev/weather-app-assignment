import type { City } from './cityCatalog'

export type CitySearchEntry = Readonly<{
  city: City
  normalizedName: string
  normalizedLabel: string
}>

const DEFAULT_RESULT_LIMIT = 10

/**
 * Removes diacritics so users can find names such as “České” by typing
 * “ceske”.
 */
export const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
    .toLowerCase()

export const formatCityLabel = (city: City): string =>
  [city.name, city.state, city.country].filter(Boolean).join(', ')

export const getCitySuggestionSuffix = (
  query: string,
  city: City | undefined,
): string => {
  if (!city || query !== query.trim()) {
    return ''
  }

  const label = formatCityLabel(city)
  const normalizedQuery = normalizeSearchText(query)

  if (
    !normalizedQuery ||
    !normalizeSearchText(label).startsWith(normalizedQuery) ||
    query.length >= label.length
  ) {
    return ''
  }

  return label.slice(query.length)
}

/**
 * Normalizes names and displayed labels once because the catalog contains
 * more than 200,000 records and repeating this work on every keystroke would
 * be wasteful.
 */
export const createCitySearchIndex = (
  cities: readonly City[],
): readonly CitySearchEntry[] =>
  cities.map((city) => ({
    city,
    normalizedName: normalizeSearchText(city.name),
    normalizedLabel: normalizeSearchText(formatCityLabel(city)),
  }))

/**
 * Ranks exact and prefix matches above substring matches while preserving
 * the original catalog order inside each group.
 */
export const searchCities = (
  index: readonly CitySearchEntry[],
  query: string,
  limit = DEFAULT_RESULT_LIMIT,
): readonly City[] => {
  const normalizedQuery = normalizeSearchText(query)

  if (!normalizedQuery || limit <= 0) {
    return []
  }

  const exactMatches: City[] = []
  const prefixMatches: City[] = []
  const otherMatches: City[] = []

  for (const entry of index) {
    if (!entry.normalizedLabel.includes(normalizedQuery)) {
      continue
    }

    if (
      entry.normalizedName === normalizedQuery ||
      entry.normalizedLabel === normalizedQuery
    ) {
      if (exactMatches.length < limit) {
        exactMatches.push(entry.city)
      }
    } else if (entry.normalizedLabel.startsWith(normalizedQuery)) {
      if (prefixMatches.length < limit) {
        prefixMatches.push(entry.city)
      }
    } else if (otherMatches.length < limit) {
      otherMatches.push(entry.city)
    }
  }

  return [...exactMatches, ...prefixMatches, ...otherMatches].slice(0, limit)
}
