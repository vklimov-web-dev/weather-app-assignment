import type { Coordinates } from '../city-search/cityCatalog'

export type ForecastEntry = Readonly<{
  dt: number
  main: Readonly<{
    temp: number
  }>
}>

export type ForecastData = Readonly<{
  list: readonly ForecastEntry[]
  city: Readonly<{
    name: string
    country: string
    timezone: number
  }>
}>

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isForecastEntry = (value: unknown): value is ForecastEntry =>
  isRecord(value) &&
  typeof value.dt === 'number' &&
  isRecord(value.main) &&
  typeof value.main.temp === 'number'

const isForecastData = (value: unknown): value is ForecastData =>
  isRecord(value) &&
  Array.isArray(value.list) &&
  value.list.every(isForecastEntry) &&
  isRecord(value.city) &&
  typeof value.city.name === 'string' &&
  typeof value.city.country === 'string' &&
  typeof value.city.timezone === 'number'

/**
 * Uses coordinates because OpenWeather recommends them over the deprecated
 * built-in lookup by city name or city ID.
 */
export async function fetchForecast(
  coordinates: Coordinates,
): Promise<ForecastData> {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    throw new Error('Chybí VITE_OPENWEATHER_API_KEY.')
  }

  const parameters = new URLSearchParams({
    lat: String(coordinates.lat),
    lon: String(coordinates.lon),
    appid: apiKey,
    units: 'metric',
  })
  const response = await fetch(`${FORECAST_URL}?${parameters}`)

  if (!response.ok) {
    throw new Error(`OpenWeather požadavek selhal (${response.status}).`)
  }

  const data: unknown = await response.json()

  if (!isForecastData(data)) {
    throw new Error('OpenWeather vrátil neplatná data.')
  }

  return data
}
