/*
* sdk relies heavily on sys metadata
* so we cannot omit the sys property on sdk level entirely
* and we have to ensure that at least `id` and `type` are present
* */

export default function normalizeSelect (query) {
  if (!query.select) {
    return query
  }

  // The selection of fields for the query is limited
  // Get the different parts that are listed for selection
  const allSelects = Array.isArray(query.select) ? query.select : query.select.split(',').map(q => q.trim())
  // Move the parts into a set for easy access and deduplication
  const selectedSet = new Set(allSelects)

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
    select: [...selectedSet].join(',')
  }
}
