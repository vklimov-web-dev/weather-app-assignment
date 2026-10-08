import { useQuery } from '@tanstack/react-query'

import { loadCityCatalog } from './cityCatalog'
import {
  createCitySearchIndex,
  type CitySearchEntry,
} from './citySearch'

export type CityCatalogStatus = 'loading' | 'ready' | 'error'

type CatalogState =
  | Readonly<{ status: 'loading' }>
  | Readonly<{ status: 'ready'; index: readonly CitySearchEntry[] }>
  | Readonly<{ status: 'error' }>

export function useCityCatalog(): CatalogState {
  const catalog = useQuery({
    queryKey: ['city-catalog'],
    queryFn: async () => createCitySearchIndex(await loadCityCatalog()),
    // The catalog does not change during a page session, so keep the prepared
    // search index without refetching or discarding it after an unmount.
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  })

  if (catalog.isPending) {
    return { status: 'loading' }
  }

  if (catalog.isError) {
    return { status: 'error' }
  }

  return { status: 'ready', index: catalog.data }
}
