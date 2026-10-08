import { describe, expect, it } from 'vitest'

import type { ForecastEntry } from './forecastApi'
import {
  createTemperatureChartPoints,
  createTemperatureDayLabels,
  type ChartPadding,
} from './temperatureChart'

const entry = (timestamp: number, temperature: number): ForecastEntry => ({
  dt: timestamp,
  main: { temp: temperature },
})

const padding: ChartPadding = { top: 10, right: 10, bottom: 10, left: 10 }

describe('createTemperatureChartPoints', () => {
  it('scales forecast temperatures into the chart area', () => {
    expect(
      createTemperatureChartPoints(
        [entry(1, 10), entry(2, 20), entry(3, 15)],
        100,
        50,
        padding,
      ),
    ).toEqual([
      { timestamp: 1, temperature: 10, x: 10, y: 40 },
      { timestamp: 2, temperature: 20, x: 50, y: 10 },
      { timestamp: 3, temperature: 15, x: 90, y: 25 },
    ])
  })

  it('centers a flat forecast', () => {
    expect(
      createTemperatureChartPoints(
        [entry(1, 12), entry(2, 12)],
        100,
        50,
        padding,
      ),
    ).toEqual([
      { timestamp: 1, temperature: 12, x: 10, y: 25 },
      { timestamp: 2, temperature: 12, x: 90, y: 25 },
    ])
  })
})

describe('createTemperatureDayLabels', () => {
  it('centers one label below each local forecast day', () => {
    const points = createTemperatureChartPoints(
      [
        entry(Date.parse('2024-01-01T21:00:00Z') / 1000, 10),
        entry(Date.parse('2024-01-01T22:00:00Z') / 1000, 11),
        entry(Date.parse('2024-01-02T01:00:00Z') / 1000, 12),
      ],
      100,
      50,
      padding,
    )

    expect(createTemperatureDayLabels(points, 7_200)).toEqual([
      {
        date: '2024-01-01',
        timestamp: Date.parse('2024-01-01T21:00:00Z') / 1000,
        x: 10,
      },
      {
        date: '2024-01-02',
        timestamp: Date.parse('2024-01-01T22:00:00Z') / 1000,
        x: 70,
      },
    ])
  })
})
