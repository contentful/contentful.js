/* @flow */
import type {Entry, DeletedEntry} from './entry'
import type {Asset, DeletedAsset} from './asset'

/**
 * SyncCollection type
 */
export type SyncCollection = {
  total: number,
  skip: number,
  limit: number,
  items: Array<Entry|Asset|DeletedEntry|DeletedAsset>
}
