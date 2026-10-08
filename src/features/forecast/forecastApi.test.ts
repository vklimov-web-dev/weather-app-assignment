import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchForecast } from './forecastApi'

const coordinates = { lat: 49.1951, lon: 16.6068 }
const validForecast = {
  list: [{ dt: 1_700_000_000, main: { temp: 12.5 } }],
  city: { timezone: 3600 },
}

describe('fetchForecast', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it('requests a metric forecast by coordinates', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(validForecast), { status: 200 }),
    )

    await expect(fetchForecast(coordinates)).resolves.toEqual(validForecast)

    const requestUrl = new URL(String(vi.mocked(fetch).mock.calls[0]?.[0]))
    expect(requestUrl.origin + requestUrl.pathname).toBe(
      'https://api.openweathermap.org/data/2.5/forecast',
    )
    expect(Object.fromEntries(requestUrl.searchParams)).toEqual({
      lat: '49.1951',
      lon: '16.6068',
      appid: 'test-key',
      units: 'metric',
    })
  })

  it('does not send a request without an API key', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', '')
    const fetchMock = vi.spyOn(globalThis, 'fetch')

    await expect(fetchForecast(coordinates)).rejects.toThrow(
      'Chybí VITE_OPENWEATHER_API_KEY.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports an unsuccessful response', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 401 }),
    )

    await expect(fetchForecast(coordinates)).rejects.toThrow(
      'OpenWeather požadavek selhal (401).',
    )
  })

  it('rejects an invalid forecast response', async () => {
    vi.stubEnv('VITE_OPENWEATHER_API_KEY', 'test-key')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ list: [] }), { status: 200 }),
    )

    await expect(fetchForecast(coordinates)).rejects.toThrow(
      'OpenWeather vrátil neplatná data.',
    )
  })
})
