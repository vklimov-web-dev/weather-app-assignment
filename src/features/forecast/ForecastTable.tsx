import type { DailyForecast } from './forecastDays'

type ForecastTableProps = Readonly<{
  days: readonly DailyForecast[]
}>

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const temperatureFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})

const formatDate = (date: string): string =>
  dateFormatter.format(new Date(`${date}T00:00:00Z`))

const formatTemperature = (temperature: number): string =>
  `${temperatureFormatter.format(temperature)} °C`

export function ForecastTable({ days }: ForecastTableProps) {
  return (
    <table className="forecast-table">
      <caption>Předpověď na pět dní</caption>
      <thead>
        <tr>
          <th scope="col">Den</th>
          <th scope="col">Minimum</th>
          <th scope="col">Maximum</th>
        </tr>
      </thead>
      <tbody>
        {days.map((day) => (
          <tr key={day.date}>
            <th scope="row">{formatDate(day.date)}</th>
            <td>{formatTemperature(day.minTemperature)}</td>
            <td>{formatTemperature(day.maxTemperature)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
