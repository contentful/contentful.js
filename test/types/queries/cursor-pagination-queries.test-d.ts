import { expectAssignable, expectNotAssignable } from 'tsd'
import type { CursorPaginationOptions } from '../../../lib'

expectAssignable<CursorPaginationOptions>({})
expectAssignable<CursorPaginationOptions>({ pagePrev: 'prev_token' })
expectAssignable<CursorPaginationOptions>({ pageNext: 'token_next' })
expectAssignable<CursorPaginationOptions>({
  pageNext: 'token_next',
  pagePrev: undefined,
})
expectAssignable<CursorPaginationOptions>({ pagePrev: 'token_prev', pageNext: undefined })
expectAssignable<CursorPaginationOptions>({ pagePrev: undefined, pageNext: undefined })
expectAssignable<CursorPaginationOptions>({ pagePrev: 'page_prev', limit: 40 })
expectAssignable<CursorPaginationOptions>({ pageNext: 'page_next', limit: 40 })
expectAssignable<CursorPaginationOptions>({ limit: 20 })

expectNotAssignable<CursorPaginationOptions>({ cursor: false })
expectNotAssignable<CursorPaginationOptions>({ cursor: undefined })
expectNotAssignable<CursorPaginationOptions>({ cursor: null })
expectNotAssignable<CursorPaginationOptions>({ pageNext: 'page_next', pagePrev: 'page_prev' })
expectNotAssignable<CursorPaginationOptions>({ pageNext: 40 })
expectNotAssignable<CursorPaginationOptions>({ pagePrev: 40 })
expectNotAssignable<CursorPaginationOptions>({ skip: 100 })
expectNotAssignable<CursorPaginationOptions>({ pagePrev: 'page_prev', skip: 20 })
expectNotAssignable<CursorPaginationOptions>({ pageNext: 'page_next', skip: 20 })
expectNotAssignable<CursorPaginationOptions>({ limit: 10, skip: 20 })
