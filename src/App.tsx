import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { CityAutocomplete } from "./features/city-search/CityAutocomplete";
import type {
  City,
  Coordinates,
} from "./features/city-search/cityCatalog";
import { formatCityLabel } from "./features/city-search/citySearch";
import { ForecastStatus } from "./features/forecast/ForecastStatus";

const queryClient = new QueryClient();

type ForecastLocation = Readonly<{
  label: string;
  coordinates: Coordinates;
  showResolvedCity: boolean;
}>;

export function App() {
  const [selectedLocation, setSelectedLocation] =
    useState<ForecastLocation | null>(null);

  const handleCityChange = (city: City) => {
    setSelectedLocation({
      label: formatCityLabel(city),
      coordinates: city.coord,
      showResolvedCity: false,
    });
  };

  const handleCurrentLocationChange = (coordinates: Coordinates) => {
    setSelectedLocation({
      label: "Aktuální poloha",
      coordinates,
      showResolvedCity: true,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
      <main>
        <h1>Předpověď počasí</h1>

        <CityAutocomplete
          onCityChange={handleCityChange}
          onCurrentLocationChange={handleCurrentLocationChange}
        />

        {selectedLocation ? (
          <ForecastStatus
            coordinates={selectedLocation.coordinates}
            locationLabel={selectedLocation.label}
            showResolvedCity={selectedLocation.showResolvedCity}
          />
        ) : (
          <p className="forecast-placeholder">
            Vyberte město nebo použijte aktuální polohu.
          </p>
        )}
      </main>
    </QueryClientProvider>
  );
}
