import { TagLink, TaxonomyConceptLink } from './link.js'

/**
 * User-controlled metadata
 * @category Entity
 */
export type Metadata = {
  tags: { sys: TagLink }[]
  concepts?: { sys: TaxonomyConceptLink }[]
}
