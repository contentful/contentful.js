import { describe, test, expect } from 'vitest'
import { normalizeCursorPaginationResponse } from '../../../lib/utils/normalize-cursor-pagination-response'

const prevToken =
  'wqXDgmPDrT3CqsKBw4QewrY8YcOoeFBn.W3siY3Vyc29yIjoidHJ1ZSIsImxpbWl0IjoiMiIsInNlbGVjdCI6InN5cy5pZCJ9LFsiMjAyNS0xMC0wOVQwOToxNjozMC40MzhaIiwiMmNlSDhURlkxS1IzR0VLa05heTBtWSJdXQ'
const prevRaw = '/spaces/87cj9boavvn1/entries?pagePrev=' + prevToken

const nextToken =
  'VAbCliFbVsOvwpw9UWpewqxWw7jDjw.W3siY3Vyc29yIjoidHJ1ZSIsImxpbWl0IjoiMiIsInNlbGVjdCI6InN5cy5pZCJ9LFsiMjAyNS0wOS0xNVQxNToyMjoyNS42MDZaIiwiMTBjQXR6RWxadmRnbkJFc3hHOHlUUCJdXQ'
const nextRaw = '/spaces/87cj9boavvn1/entries?pageNext=' + nextToken

describe('normalizeCursorPaginationResponse', () => {
  test('should not update response when "pages" is empty', () => {
    expect(normalizeCursorPaginationResponse({ pages: {} })).deep.equal({
      pages: {},
    })
  })

  test('should normalize prev page token when presented', () => {
    expect(
      normalizeCursorPaginationResponse({
        pages: {
          prev: prevRaw,
        },
      }),
    ).deep.equal({
      pages: {
        prev: prevToken,
      },
    })
  })

  test('should normalize next page token when presented', () => {
    expect(
      normalizeCursorPaginationResponse({
        pages: {
          next: nextRaw,
        },
      }),
    ).deep.equal({
      pages: {
        next: nextToken,
      },
    })
  })

  test('should normalize prev and next pages tokens when both presented', () => {
    expect(
      normalizeCursorPaginationResponse({
        pages: {
          prev: prevRaw,
          next: nextRaw,
        },
      }),
    ).deep.equal({
      pages: {
        prev: prevToken,
        next: nextToken,
      },
    })
  })

  test('should pass all the other fields', () => {
    expect(
      normalizeCursorPaginationResponse({
        sys: {
          type: 'Array',
        },
        limit: 2,
        items: ['item', 'item'],
        pages: {
          prev: prevRaw,
          next: nextRaw,
        },
      }),
    ).deep.equal({
      sys: {
        type: 'Array',
      },
      limit: 2,
      items: ['item', 'item'],
      pages: {
        prev: prevToken,
        next: nextToken,
      },
    })
  })
})
