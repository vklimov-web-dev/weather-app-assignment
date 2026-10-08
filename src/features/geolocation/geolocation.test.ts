import { describe, expect, it, vi } from 'vitest'

import { getCurrentCoordinates } from './geolocation'

describe('getCurrentCoordinates', () => {
  it('returns latitude and longitude from the browser', async () => {
    const geolocation = {
      getCurrentPosition: vi.fn((onSuccess: PositionCallback) => {
        onSuccess({
          coords: { latitude: 50.088, longitude: 14.42 },
        } as GeolocationPosition)
      }),
    } as unknown as Geolocation

    await expect(getCurrentCoordinates(geolocation)).resolves.toEqual({
      lat: 50.088,
      lon: 14.42,
    })
  })

  it('reports denied and unavailable location requests', async () => {
    const geolocation = {
      getCurrentPosition: vi.fn(
        (_onSuccess: PositionCallback, onError: PositionErrorCallback) => {
          onError({} as GeolocationPositionError)
        },
      ),
    } as unknown as Geolocation

    await expect(getCurrentCoordinates(geolocation)).rejects.toThrow(
      'Polohu se nepodařilo zjistit.',
    )
    await expect(getCurrentCoordinates(undefined)).rejects.toThrow(
      'Polohu se nepodařilo zjistit.',
    )
  })
})
