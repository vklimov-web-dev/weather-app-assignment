import { useQuery } from '@tanstack/react-query'

import type { Coordinates } from '../city-search/cityCatalog'
import { fetchForecast } from './forecastApi'

// Avoid another API request when the user returns to a recently viewed city.
const FORECAST_STALE_TIME = 5 * 60 * 1000

export function useForecastQuery(coordinates: Coordinates) {
  return useQuery({
    queryKey: ['forecast', coordinates.lat, coordinates.lon],
    queryFn: () => fetchForecast(coordinates),
    staleTime: FORECAST_STALE_TIME,
    retry: false,
  })
}
