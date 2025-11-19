import { describe, test, expect } from 'vitest'
import { normalizeCursorPaginationParameters } from '../../../lib/utils/normalize-cursor-pagination-parameters'

describe('normalizeCursorPaginationParameters', () => {
  test('should add cursor=true param', () => {
    expect(normalizeCursorPaginationParameters({}).cursor).toBe(true)
    expect(normalizeCursorPaginationParameters({ cursor: false }).cursor).toBe(true)
    expect(normalizeCursorPaginationParameters({ cursor: false, pageNext: '' }).cursor).toBe(true)
  })

  test('should omit "skip" param from the query', () => {
    expect(normalizeCursorPaginationParameters({ skip: 20 })).not.property('skip')
  })

  test('should omit pagePrev and pageNext when falsy', () => {
    ;[
      normalizeCursorPaginationParameters({ pagePrev: false, pageNext: null }),
      normalizeCursorPaginationParameters({ pagePrev: '' }),
      normalizeCursorPaginationParameters({ pagePrev: undefined }),
      normalizeCursorPaginationParameters({ pageNext: '' }),
      normalizeCursorPaginationParameters({ pageNext: undefined }),
      normalizeCursorPaginationParameters({ pagePrev: undefined, pageNext: '' }),
    ].forEach((result) => {
      expect(result).not.property('pagePrev')
      expect(result).not.property('pageNext')
    })
  })

  test('should independently pass pagePrev and pageNext when truthy', () => {
    expect(normalizeCursorPaginationParameters({ pagePrev: 'test' }).pagePrev).toBe('test')
    expect(normalizeCursorPaginationParameters({ pagePrev: 'test' })).not.property('pageNext')
    expect(normalizeCursorPaginationParameters({ pageNext: 'next' }).pageNext).toBe('next')
    expect(normalizeCursorPaginationParameters({ pageNext: 'next' })).not.property('pagePrev')
    expect(normalizeCursorPaginationParameters({ pageNext: 'next', pagePrev: 'prev' })).contain({
      pageNext: 'next',
      pagePrev: 'prev',
    })
  })

  test('should pass all the other fields', () => {
    const params = {
      query: 'items',
      select: 'sys.id',
      timestamp: '2025-11-14T16:10:22.977Z',
      pageNext: 'next',
    }

    expect(normalizeCursorPaginationParameters(params)).deep.equal({
      ...params,
      cursor: true,
    })
  })
})
