import { afterEach, describe, expect, it, vi } from 'vitest'

import { loadCityCatalog } from './cityCatalog'

const validCatalog = [
  {
    id: 3067696,
    name: 'Prague',
    state: '',
    country: 'CZ',
    coord: { lon: 14.42076, lat: 50.08804 },
  },
]

describe('loadCityCatalog', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads and validates the local city catalog', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(validCatalog), { status: 200 }),
    )

    await expect(loadCityCatalog()).resolves.toEqual(validCatalog)
    expect(fetch).toHaveBeenCalledWith('/data/city.list.json')
  })

  it('rejects an invalid catalog', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([{ id: 'invalid' }]), { status: 200 }),
    )

    await expect(loadCityCatalog()).rejects.toThrow(
      'City catalog has an invalid format',
    )
  })

  it('reports an unsuccessful response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 404 }),
    )

    await expect(loadCityCatalog()).rejects.toThrow(
      'City catalog request failed with status 404',
    )
  })
})
