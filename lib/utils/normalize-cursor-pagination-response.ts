import type { CursorPagination } from '../types'

function extractQueryParam(key: string, url?: string): string | undefined | null {
  const queryString = url?.split('?')[1]

  if (!queryString) {
    return
  }

  return new URLSearchParams(queryString).get(key)
}

const Pages = {
  prev: 'pagePrev',
  next: 'pageNext',
} as const

export function normalizeCursorPaginationResponse<Response extends CursorPagination>(
  response: Response,
): Response {
  const pages: CursorPagination['pages'] = {}

  for (const [responseKey, queryKey] of Object.entries(Pages)) {
    const cursorToken = extractQueryParam(queryKey, response.pages[responseKey])

    if (cursorToken) {
      pages[responseKey] = cursorToken
    }
  }

  return {
    ...response,
    pages,
  }
}
