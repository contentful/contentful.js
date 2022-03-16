import type { Asset } from './asset'
import type { Entry } from './entry'

export interface SyncCollection {
  entries: Array<Entry<any>>
  assets: Array<Asset>
  deletedEntries: Array<Entry<any>>
  deletedAssets: Array<Asset>
  nextSyncToken: string
}
