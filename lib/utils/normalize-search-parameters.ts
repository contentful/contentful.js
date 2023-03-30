export default function normalizeSearchParameters(query: Record<string, any>): Record<string, any> {
  const convertedQuery = {}
  let hasConverted = false
  for (const key in query) {
    // We allow multiple values to be passed as arrays
    // which have to be converted to comma-separated strings before being sent to the API
    if (Array.isArray(query[key])) {
      convertedQuery[key] = query[key].join(',')
      hasConverted = true
    }
  }

  if (hasConverted) {
    return { ...query, ...convertedQuery }
  }

  return query
}
