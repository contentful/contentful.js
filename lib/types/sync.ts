import { Asset } from './asset'
import { NewEntry } from './entry'

export interface SyncCollection {
  entries: Array<NewEntry>
  assets: Array<Asset>
  deletedEntries: Array<NewEntry>
  deletedAssets: Array<Asset>
  nextSyncToken: string
}
