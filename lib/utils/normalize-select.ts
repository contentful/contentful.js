import getQuerySelectionSet from './query-selection-set.js'

/*
 * sdk relies heavily on sys metadata
 * so we cannot omit the sys property on sdk level entirely
 * and we have to ensure that at least `id` and `type` are present
 * */

export default function normalizeSelect(query) {
  if (!query.select) {
    return query
  }

  const selectedSet = getQuerySelectionSet(query)

  // If we already select all of `sys` we can just return
  // since we're anyway fetching everything that is needed
  if (selectedSet.has('sys')) {
    return query
  }

  // We don't select `sys` so we need to ensure the minimum set
  selectedSet.add('sys.id')
  selectedSet.add('sys.type')

  // Reassign the normalized sys properties
  return {
    ...query,
    select: [...selectedSet].join(','),
  }
}
