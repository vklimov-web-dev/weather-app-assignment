import type { DailyForecast } from './forecastDays'

type ForecastTableProps = Readonly<{
  days: readonly DailyForecast[]
}>

const longDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

const temperatureFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 0,
})

const formatDate = (
  date: string,
  formatter: Intl.DateTimeFormat,
): string => formatter.format(new Date(`${date}T00:00:00Z`))

const formatTemperature = (temperature: number): string =>
  `${temperatureFormatter.format(temperature)} °C`

export function ForecastTable({ days }: ForecastTableProps) {
  return (
    <div className="forecast-table-section">
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
              <th scope="row">
                <span className="forecast-table__date-long">
                  {formatDate(day.date, longDateFormatter)}
                </span>
                <span className="forecast-table__date-short">
                  {formatDate(day.date, shortDateFormatter)}
                </span>
              </th>
              <td>{formatTemperature(day.minTemperature)}</td>
              <td>{formatTemperature(day.maxTemperature)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
