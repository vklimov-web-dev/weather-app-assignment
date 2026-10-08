import type { City } from '../city-search/cityCatalog'
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

  return <p>Načteno záznamů předpovědi: {forecast.data.list.length}</p>
}
