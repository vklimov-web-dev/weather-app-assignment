import type { Coordinates } from '../city-search/cityCatalog'
import { createDailyForecast } from './forecastDays'
import { ForecastTable } from './ForecastTable'
import { useForecastQuery } from './useForecastQuery'

type ForecastStatusProps = Readonly<{
  coordinates: Coordinates
  locationLabel: string
  showResolvedCity: boolean
}>

export function ForecastStatus({
  coordinates,
  locationLabel,
  showResolvedCity,
}: ForecastStatusProps) {
  const forecast = useForecastQuery(coordinates)
  const resolvedCity = forecast.data
    ? [forecast.data.city.name, forecast.data.city.country]
        .filter(Boolean)
        .join(', ')
    : ''
  const displayedLocation =
    showResolvedCity && resolvedCity
      ? `${locationLabel}: ${resolvedCity}`
      : locationLabel

  let content

  if (forecast.isPending) {
    content = <p>Načítám předpověď…</p>
  } else if (forecast.isError) {
    content = <p>{forecast.error.message}</p>
  } else {
    content = <ForecastTable days={createDailyForecast(forecast.data)} />
  }

  return (
    <>
      <p>Vybrané místo: {displayedLocation}</p>
      {content}
    </>
  )
}
