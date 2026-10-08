import type { City } from './cityCatalog'
import { formatCityLabel } from './citySearch'

type CityOptionsProps = Readonly<{
  cities: readonly City[]
  activeIndex: number
  onActiveIndexChange: (index: number) => void
  onSelect: (city: City) => void
}>

export function CityOptions({
  cities,
  activeIndex,
  onActiveIndexChange,
  onSelect,
}: CityOptionsProps) {
  return (
    <ul className="city-search__options">
      {cities.map((city, index) => (
        <li key={city.id}>
          <button
            className={
              index === activeIndex
                ? 'city-search__option city-search__option--active'
                : 'city-search__option'
            }
            type="button"
            onMouseEnter={() => onActiveIndexChange(index)}
            onMouseDown={(event) => {
              // Keep the input focused until the click selects a city.
              event.preventDefault()
            }}
            onClick={() => onSelect(city)}
          >
            {formatCityLabel(city)}
          </button>
        </li>
      ))}
    </ul>
  )
}
