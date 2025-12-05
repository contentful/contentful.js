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
    ...(!!pagePrev && { pagePrev }),
    ...(!!pageNext && { pageNext }),
  } as NormalizedCursorPaginationParams<Query>
}
