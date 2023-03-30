import { TagLink } from './link'

/**
 * User-controlled metadata
 * @category Entity
 */
export type Metadata = {
  tags: { sys: TagLink }[]
}
