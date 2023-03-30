export default function validateSearchParameters(query: Record<string, any>): void {
  for (const key in query) {
    const value = query[key]
    // We don’t allow any objects as values for query parameters
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      throw new Error(`Objects are not supported as value for the "${key}" query parameter.`)
    }
  }
}
