import { describe, expect, it } from 'vitest'

import type { ForecastData, ForecastEntry } from './forecastApi'
import { createDailyForecast } from './forecastDays'

const entry = (date: string, temperature: number): ForecastEntry => ({
  dt: Date.parse(date) / 1_000,
  main: { temp: temperature },
})

const forecast = (
  list: readonly ForecastEntry[],
  timezone = 0,
): ForecastData => ({
  list,
  city: { name: 'Test city', country: 'CZ', timezone },
})

describe('createDailyForecast', () => {
  it('groups temperatures by the local date of the selected city', () => {
    const result = createDailyForecast(
      forecast(
        [
          entry('2024-01-01T21:00:00Z', 4),
          entry('2024-01-01T22:00:00Z', -1),
          entry('2024-01-02T09:00:00Z', 6),
        ],
        7_200,
      ),
    )

    expect(result).toEqual([
      { date: '2024-01-01', minTemperature: 4, maxTemperature: 4 },
      { date: '2024-01-02', minTemperature: -1, maxTemperature: 6 },
    ])
  })

  it('returns only the first five forecast days', () => {
    const entries = Array.from({ length: 6 }, (_, index) =>
      entry(`2024-01-0${index + 1}T12:00:00Z`, index),
    )

    expect(createDailyForecast(forecast(entries))).toHaveLength(5)
    expect(createDailyForecast(forecast(entries)).at(-1)?.date).toBe(
      '2024-01-05',
    )
  })
})
