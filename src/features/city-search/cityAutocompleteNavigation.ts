type NavigationDirection = 'next' | 'previous'

/**
 * Wraps option navigation so users can move continuously through suggestions
 * while keyboard focus stays in the search input.
 */
export const getNextActiveIndex = (
  currentIndex: number,
  resultCount: number,
  direction: NavigationDirection,
): number => {
  if (resultCount <= 0) {
    return -1
  }

  if (currentIndex < 0) {
    return direction === 'next' ? 0 : resultCount - 1
  }

  const offset = direction === 'next' ? 1 : -1
  return (currentIndex + offset + resultCount) % resultCount
}
