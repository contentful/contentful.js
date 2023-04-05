/**
 * A wrapper object containing additional information for
 * a collection of Contentful resources
 * @category Entity
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/collection-resources-and-pagination | Documentation}
 */
export interface ContentfulCollection<T> {
  total: number
  skip: number
  limit: number
  items: Array<T>
}
