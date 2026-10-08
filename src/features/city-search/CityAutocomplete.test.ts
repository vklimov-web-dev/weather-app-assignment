import { describe, expect, it } from 'vitest'

import { getNextActiveIndex } from './cityAutocompleteNavigation'

describe('getNextActiveIndex', () => {
  it('starts at the first or last option based on direction', () => {
    expect(getNextActiveIndex(-1, 3, 'next')).toBe(0)
    expect(getNextActiveIndex(-1, 3, 'previous')).toBe(2)
  })

  it('wraps at both ends of the result list', () => {
    expect(getNextActiveIndex(2, 3, 'next')).toBe(0)
    expect(getNextActiveIndex(0, 3, 'previous')).toBe(2)
  })

  it('keeps the inactive state when there are no results', () => {
    expect(getNextActiveIndex(0, 0, 'next')).toBe(-1)
  })
})
