import { Asset } from './asset'
import { Entry } from './entry'

export interface SyncCollection {
  entries: Array<Entry>
  assets: Array<Asset>
  deletedEntries: Array<Entry>
  deletedAssets: Array<Asset>
  nextSyncToken: string
}
