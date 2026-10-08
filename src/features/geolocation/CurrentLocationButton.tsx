import { useState } from 'react'

import type { Coordinates } from '../city-search/cityCatalog'
import { getCurrentCoordinates } from './geolocation'

type CurrentLocationButtonProps = Readonly<{
  onSelect: (coordinates: Coordinates) => void
}>

export function CurrentLocationButton({
  onSelect,
}: CurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleClick = () => {
    setIsLoading(true)
    setErrorMessage('')

    void getCurrentCoordinates(navigator.geolocation)
      .then(onSelect)
      .catch((error: unknown) => {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Polohu se nepodařilo zjistit.',
        )
      })
      .finally(() => setIsLoading(false))
  }

  return (
    <div className="current-location">
      <button
        className="current-location__button"
        type="button"
        disabled={isLoading}
        onClick={handleClick}
      >
        {isLoading ? 'Zjišťuji polohu…' : 'Použít aktuální polohu'}
      </button>

      {errorMessage ? (
        <p className="current-location__error">{errorMessage}</p>
      ) : null}
    </div>
  )
}
