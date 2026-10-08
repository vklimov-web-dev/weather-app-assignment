import { useQuery } from '@tanstack/react-query'

import type { City } from '../city-search/cityCatalog'
import { fetchForecast } from './forecastApi'

export function useForecastQuery(city: City) {
  return useQuery({
    queryKey: ['forecast', city.coord.lat, city.coord.lon],
    queryFn: () => fetchForecast(city.coord),
    retry: false,
  })
}
