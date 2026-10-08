import type { ForecastData } from './forecastApi'

export type DailyForecast = Readonly<{
  date: string
  minTemperature: number
  maxTemperature: number
}>

const FORECAST_DAY_COUNT = 5

/**
 * OpenWeather timestamps are UTC. Adding the city's offset before reading the
 * UTC date keeps late-night entries in the correct local forecast day.
 */
export const getLocalDate = (timestamp: number, timezone: number): string =>
  new Date((timestamp + timezone) * 1_000).toISOString().slice(0, 10)

export function createDailyForecast(
  forecast: ForecastData,
): readonly DailyForecast[] {
  const days = new Map<string, DailyForecast>()

  for (const entry of forecast.list) {
    const date = getLocalDate(entry.dt, forecast.city.timezone)
    const currentDay = days.get(date)

    days.set(
      date,
      currentDay
        ? {
            date,
            minTemperature: Math.min(
              currentDay.minTemperature,
              entry.main.temp,
            ),
            maxTemperature: Math.max(
              currentDay.maxTemperature,
              entry.main.temp,
            ),
          }
        : {
            date,
            minTemperature: entry.main.temp,
            maxTemperature: entry.main.temp,
          },
    )
  }

  return Array.from(days.values()).slice(0, FORECAST_DAY_COUNT)
}
