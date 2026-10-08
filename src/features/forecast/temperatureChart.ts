import type { ForecastEntry } from './forecastApi'
import { getLocalDate } from './forecastDays'

export type ChartPadding = Readonly<{
  top: number
  right: number
  bottom: number
  left: number
}>

export type TemperatureChartPoint = Readonly<{
  timestamp: number
  temperature: number
  x: number
  y: number
}>

export type TemperatureDayLabel = Readonly<{
  date: string
  timestamp: number
  x: number
}>

export function createTemperatureChartPoints(
  entries: readonly ForecastEntry[],
  width: number,
  height: number,
  padding: ChartPadding,
): readonly TemperatureChartPoint[] {
  if (entries.length === 0) {
    return []
  }

  const temperatures = entries.map((entry) => entry.main.temp)
  const minimum = Math.min(...temperatures)
  const maximum = Math.max(...temperatures)
  const temperatureRange = maximum - minimum
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom
  const horizontalStep =
    entries.length > 1 ? plotWidth / (entries.length - 1) : 0

  return entries.map((entry, index) => ({
    timestamp: entry.dt,
    temperature: entry.main.temp,
    x:
      entries.length > 1
        ? padding.left + index * horizontalStep
        : padding.left + plotWidth / 2,
    // A flat forecast belongs in the middle instead of on a chart edge.
    y:
      temperatureRange === 0
        ? padding.top + plotHeight / 2
        : padding.top +
          ((maximum - entry.main.temp) / temperatureRange) * plotHeight,
  }))
}

export function createTemperatureDayLabels(
  points: readonly TemperatureChartPoint[],
  timezone: number,
): readonly TemperatureDayLabel[] {
  const days = new Map<
    string,
    { timestamp: number; totalX: number; pointCount: number }
  >()

  for (const point of points) {
    const date = getLocalDate(point.timestamp, timezone)
    const currentDay = days.get(date)

    days.set(
      date,
      currentDay
        ? {
            ...currentDay,
            totalX: currentDay.totalX + point.x,
            pointCount: currentDay.pointCount + 1,
          }
        : { timestamp: point.timestamp, totalX: point.x, pointCount: 1 },
    )
  }

  return Array.from(days, ([date, day]) => ({
    date,
    timestamp: day.timestamp,
    x: day.totalX / day.pointCount,
  }))
}
