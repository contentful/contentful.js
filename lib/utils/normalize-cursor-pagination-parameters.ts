type NormalizedCursorPaginationParams<Query extends Record<string, unknown>> = Omit<
  Query,
  'cursor' | 'skip'
> & { cursor: true }

export function normalizeCursorPaginationParameters<Query extends Record<string, unknown>>(
  query: Query,
): NormalizedCursorPaginationParams<Query> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cursor, pagePrev, pageNext, skip, ...rest } = query

  return {
    ...rest,
    cursor: true,
    // omit pagePrev and pageNext if the value is falsy
    ...(pagePrev ? { pagePrev } : null),
    ...(pageNext ? { pageNext } : null),
  } as NormalizedCursorPaginationParams<Query>
}
