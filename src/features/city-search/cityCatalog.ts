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

export async function loadCityCatalog(): Promise<readonly City[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/city.list.json`)

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
