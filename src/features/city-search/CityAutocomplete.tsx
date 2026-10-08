import {
  useMemo,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'

import type { City } from './cityCatalog'
import { CityOptions } from './CityOptions'
import { CitySearchInput } from './CitySearchInput'
import {
  formatCityLabel,
  getCitySuggestionSuffix,
  searchCities,
} from './citySearch'
import { getNextActiveIndex } from './cityAutocompleteNavigation'
import {
  useCityCatalog,
  type CityCatalogStatus,
} from './useCityCatalog'

type CityAutocompleteProps = Readonly<{
  onCityChange: (city: City | null) => void
}>

// Two characters keep searches useful without scanning 200,000 records for
// extremely broad one-character matches.
const MIN_QUERY_LENGTH = 2

type StatusMessageOptions = Readonly<{
  catalogStatus: CityCatalogStatus
  query: string
  showNoResults: boolean
}>

const getStatusMessage = ({
  catalogStatus,
  query,
  showNoResults,
}: StatusMessageOptions): string => {
  if (catalogStatus === 'loading') {
    return 'Načítám seznam měst…'
  }

  if (catalogStatus === 'error') {
    return 'Seznam měst se nepodařilo načíst.'
  }

  if (query.length > 0 && query.trim().length < MIN_QUERY_LENGTH) {
    return `Zadejte alespoň ${MIN_QUERY_LENGTH} znaky.`
  }

  if (showNoResults) {
    return 'Žádná odpovídající města.'
  }

  return ''
}

export function CityAutocomplete({
  onCityChange,
}: CityAutocompleteProps) {
  const catalog = useCityCatalog()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)

  const canSearch =
    catalog.status === 'ready' && query.trim().length >= MIN_QUERY_LENGTH

  const results = useMemo(
    () => (canSearch ? searchCities(catalog.index, query) : []),
    [canSearch, catalog, query],
  )

  const isListVisible = isOpen && results.length > 0
  const activeCity = activeIndex >= 0 ? results[activeIndex] : undefined
  const suggestionSuffix = isListVisible
    ? getCitySuggestionSuffix(query, results[0])
    : ''

  const selectCity = (city: City) => {
    setQuery(formatCityLabel(city))
    setActiveIndex(-1)
    setIsOpen(false)
    onCityChange(city)
  }

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    setActiveIndex(-1)
    setIsOpen(true)
    onCityChange(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!isListVisible) {
        return
      }

      event.preventDefault()
      setActiveIndex((currentIndex) =>
        getNextActiveIndex(
          currentIndex,
          results.length,
          event.key === 'ArrowDown' ? 'next' : 'previous',
        ),
      )
      return
    }

    if (event.key === 'Enter' && activeCity) {
      event.preventDefault()
      selectCity(activeCity)
      return
    }

    if (event.key === 'Escape') {
      setActiveIndex(-1)
      setIsOpen(false)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveIndex(-1)
      setIsOpen(false)
    }
  }

  const statusMessage = getStatusMessage({
    catalogStatus: catalog.status,
    query,
    showNoResults: isOpen && canSearch && results.length === 0,
  })

  return (
    <div className="city-search" onBlur={handleBlur}>
      <CitySearchInput
        value={query}
        suggestionSuffix={suggestionSuffix}
        onChange={handleQueryChange}
        onKeyDown={handleKeyDown}
      />

      {isListVisible ? (
        <CityOptions
          cities={results}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          onSelect={selectCity}
        />
      ) : null}

      <p className="city-search__status">{statusMessage}</p>
    </div>
  )
}
