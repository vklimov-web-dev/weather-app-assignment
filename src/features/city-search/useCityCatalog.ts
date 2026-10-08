import { useEffect, useState } from 'react'

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
  const [catalog, setCatalog] = useState<CatalogState>({ status: 'loading' })

  useEffect(() => {
    void loadCityCatalog()
      .then((cities) => {
        setCatalog({ status: 'ready', index: createCitySearchIndex(cities) })
      })
      .catch(() => {
        setCatalog({ status: 'error' })
      })
  }, [])

  return catalog
}
