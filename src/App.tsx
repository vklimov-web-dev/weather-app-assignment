import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CityAutocomplete } from "./features/city-search/CityAutocomplete";
import type { City } from "./features/city-search/cityCatalog";
import { formatCityLabel } from "./features/city-search/citySearch";
import { ForecastStatus } from "./features/forecast/ForecastStatus";

const queryClient = new QueryClient();

export function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <main>
        <h1>Předpověď počasí</h1>

        <CityAutocomplete onCityChange={setSelectedCity} />

        {selectedCity ? (
          <>
            <p>Vybrané město: {formatCityLabel(selectedCity)}</p>
            <ForecastStatus city={selectedCity} />
          </>
        ) : (
          <p>Vyberte město pro zobrazení předpovědi.</p>
        )}
      </main>
    </QueryClientProvider>
  );
}
