export default function getQuerySelectionSet(query: Record<string, any>): Set<string> {
  if (!query.select) {
    return new Set()
  }

  // The selection of fields for the query is limited
  // Get the different parts that are listed for selection
  const allSelects = Array.isArray(query.select)
    ? query.select
    : query.select.split(',').map((q) => q.trim())

  // Move the parts into a set for easy access and deduplication
  return new Set(allSelects)
}
