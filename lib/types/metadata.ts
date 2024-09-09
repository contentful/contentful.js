import { TagLink, TaxonomyConceptLink } from './link'

/**
 * User-controlled metadata
 * @category Entity
 */
export type Metadata = {
  tags: { sys: TagLink }[]
  concepts?: { sys: TaxonomyConceptLink }[]
}

export type AssetMetadata = Omit<Metadata, 'concepts'>
