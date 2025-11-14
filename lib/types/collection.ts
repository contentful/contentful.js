export type CollectionBase<T> = {
  limit: number
  items: Array<T>
  sys?: {
    type: 'Array'
  }
}

export type OffsetPagination = {
  total: number
  skip: number
}

export type CursorPagination = {
  pages: {
    next?: string
    prev?: string
  }
}

/**
 * A wrapper object containing additional information for
 * an offset paginated collection of Contentful resources
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/collection-resources-and-pagination | Documentation}
 */
export type OffsetPaginatedCollection<T = unknown> = CollectionBase<T> & OffsetPagination

/**
 * A wrapper object containing additional information for
 * an offset paginated collection of Contentful resources
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/collection-resources-and-pagination | Documentation}
 */
export interface ContentfulCollection<T = unknown> extends OffsetPaginatedCollection<T> {}

/**
 * A wrapper object containing additional information for
 * a curisor paginated collection of Contentful resources
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/cursor-pagination | Documentation}
 */
export type CursorPaginatedCollection<T = unknown> = CollectionBase<T> & CursorPagination

export type WithCursorPagination = { cursor: true }

export type CollectionForQuery<
  T = unknown,
  Query extends Record<string, unknown> = Record<string, unknown>,
> = Query extends WithCursorPagination ? CursorPaginatedCollection<T> : OffsetPaginatedCollection<T>
