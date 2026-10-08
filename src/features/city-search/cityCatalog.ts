export type Coordinates = Readonly<{
  lon: number
  lat: number
}>

export type City = Readonly<{
  id: number
  name: string
  state: string
  country: string
  coord: Coordinates
}>

const ONLINE_CATALOG_URL =
  'https://raw.githubusercontent.com/vklimov-web-dev/weather-app-assignment/main/public/data/city.list.json'
const LOCAL_CATALOG_URL = `${import.meta.env.BASE_URL}data/city.list.json`

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isCity = (value: unknown): value is City => {
  if (!isRecord(value) || !isRecord(value.coord)) {
    return false
  }

  return (
    Number.isInteger(value.id) &&
    typeof value.name === 'string' &&
    typeof value.state === 'string' &&
    typeof value.country === 'string' &&
    typeof value.coord.lon === 'number' &&
    typeof value.coord.lat === 'number'
  )
}

const fetchCityCatalog = async (url: string): Promise<readonly City[]> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`City catalog request failed with status ${response.status}`)
  }

  const catalog: unknown = await response.json()

  // JSON is outside TypeScript's type system, so validate it at the boundary.
  if (!Array.isArray(catalog) || !catalog.every(isCity)) {
    throw new Error('City catalog has an invalid format')
  }

  return catalog
}

export async function loadCityCatalog(): Promise<readonly City[]> {
  try {
    return await fetchCityCatalog(ONLINE_CATALOG_URL)
  } catch {
    // Keep the search usable during local development and remote outages.
    return fetchCityCatalog(LOCAL_CATALOG_URL)
  }
}
