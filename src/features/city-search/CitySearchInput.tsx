import type { ChangeEventHandler, KeyboardEventHandler } from 'react'

type CitySearchInputProps = Readonly<{
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onKeyDown: KeyboardEventHandler<HTMLInputElement>
}>

export function CitySearchInput({
  value,
  onChange,
  onKeyDown,
}: CitySearchInputProps) {
  return (
    <>
      <label className="city-search__label" htmlFor="city-search-input">
        Město
      </label>

      <input
        id="city-search-input"
        className="city-search__input"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </>
  )
}
