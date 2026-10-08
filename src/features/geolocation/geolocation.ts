import type { Coordinates } from '../city-search/cityCatalog'

const GEOLOCATION_ERROR = 'Polohu se nepodařilo zjistit.'

export function getCurrentCoordinates(
  geolocation: Geolocation | undefined,
): Promise<Coordinates> {
  if (!geolocation) {
    return Promise.reject(new Error(GEOLOCATION_ERROR))
  }

  return new Promise((resolve, reject) => {
    geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => reject(new Error(GEOLOCATION_ERROR)),
    )
  })
}
