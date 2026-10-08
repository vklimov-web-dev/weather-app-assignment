import { useState } from 'react'

import { CityAutocomplete } from './features/city-search/CityAutocomplete'
import type { City } from './features/city-search/cityCatalog'
import { formatCityLabel } from './features/city-search/citySearch'

export function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null)

  return (
    <main>
      <h1>Předpověď počasí</h1>

      <CityAutocomplete onCityChange={setSelectedCity} />

      <p>
        {selectedCity
          ? `Vybrané město: ${formatCityLabel(selectedCity)}`
          : 'Vyberte město pro zobrazení předpovědi.'}
      </p>
    </main>
  )
}
