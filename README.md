# Předpověď počasí

Jednostránková React aplikace, která umožňuje vyhledat město z katalogu
OpenWeather a zobrazit pro něj pětidenní předpověď minimálních a maximálních
teplot.

## Funkce

- našeptávač měst nad online souborem `city.list.json` s lokální záložní
  kopií;
- ovládání výsledků myší i klávesnicí;
- načtení předpovědi podle souřadnic vybraného města;
- načtení předpovědi pro aktuální polohu uživatele;
- seskupení tříhodinových záznamů do pěti místních kalendářních dnů;
- graf vývoje teploty v tříhodinových intervalech;
- formátování data a teplot podle nastavení prohlížeče;
- stav načítání a srozumitelná zpráva při chybě API.

## Spuštění

### Požadavky

- Node.js `20.19+` nebo `22.12+`;
- API klíč pro [OpenWeather](https://openweathermap.org/api).

### Instalace

```bash
npm install
cp .env.example .env
```

Do souboru `.env` doplňte svůj klíč:

```dotenv
VITE_OPENWEATHER_API_KEY=vas_api_klic
```

Potom spusťte vývojový server:

```bash
npm run dev
```

Aplikace bude dostupná na adrese vypsané v terminálu, obvykle
`http://localhost:5173`.

Protože jde pouze o klientskou aplikaci, klíč vložený do proměnné s prefixem
`VITE_` je součástí výsledného JavaScriptu. Neměl by proto být používán jako
tajný produkční klíč.

Geolokace funguje na `localhost` nebo přes HTTPS a vyžaduje souhlas uživatele
v prohlížeči.

## Kontrola projektu

```bash
npm run check
npm run build
```

Příkaz `npm run check` postupně spustí kontrolu TypeScriptu, ESLint a testy.
Pro samostatnou kontrolu typů lze použít `npm run typecheck`.

Produkční sestavení se vytvoří v adresáři `dist`.

## Podporovaný prohlížeč

Aplikace podporuje aktuální stabilní verzi Google Chrome.

## Struktura

- `src/features/city-search` - načtení katalogu, čisté funkce vyhledávání a
  komponenty našeptávače;
- `src/features/forecast` - komunikace s OpenWeather API, React Query hook,
  převod odpovědi na denní předpověď a tabulka výsledků;
- `src/App.tsx` - propojení výběru města s předpovědí;
- `src/styles.css` - společné styly aplikace;
- `public/data/city.list.json` - záložní kopie online katalogu měst.

Projekt používá funkcionální přístup: uživatelské rozhraní tvoří funkční React
komponenty a vyhledávání i transformace předpovědi jsou oddělené čisté funkce.
Vzdálený stav a cache požadavků spravuje TanStack React Query.
