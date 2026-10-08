import { useQuery } from '@tanstack/react-query'

import type { City } from '../city-search/cityCatalog'
import { fetchForecast } from './forecastApi'

// Avoid another API request when the user returns to a recently viewed city.
const FORECAST_STALE_TIME = 5 * 60 * 1000

export function useForecastQuery(city: City) {
  return useQuery({
    queryKey: ['forecast', city.coord.lat, city.coord.lon],
    queryFn: () => fetchForecast(city.coord),
    staleTime: FORECAST_STALE_TIME,
    retry: false,
  })
}
