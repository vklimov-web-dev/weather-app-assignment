import type { ChangeEventHandler, KeyboardEventHandler } from 'react'

type CitySearchInputProps = Readonly<{
  value: string
  suggestionSuffix: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}>

export function CitySearchInput({
  value,
  suggestionSuffix,
  onChange,
  onKeyDown,
}: CitySearchInputProps) {
  return (
    <>
      <label className="city-search__label" htmlFor="city-search-input">
        Město
      </label>

      <div className="city-search__input-wrapper">
        {suggestionSuffix ? (
          <span className="city-search__suggestion" aria-hidden="true">
            <span className="city-search__suggestion-prefix">{value}</span>
            {suggestionSuffix}
          </span>
        ) : null}

        <input
          id="city-search-input"
          className="city-search__input"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </>
  )
}
