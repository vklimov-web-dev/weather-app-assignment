import type { City } from '../city-search/cityCatalog'
import { createDailyForecast } from './forecastDays'
import { ForecastTable } from './ForecastTable'
import { useForecastQuery } from './useForecastQuery'

type ForecastStatusProps = Readonly<{
  city: City
}>

export function ForecastStatus({ city }: ForecastStatusProps) {
  const forecast = useForecastQuery(city)

  if (forecast.isPending) {
    return <p>Načítám předpověď…</p>
  }

  if (forecast.isError) {
    return <p>{forecast.error.message}</p>
  }

  return <ForecastTable days={createDailyForecast(forecast.data)} />
}
