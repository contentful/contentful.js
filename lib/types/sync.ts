import { Asset } from './asset'
import { Entry } from './entry'
import { EntitySys } from './sys'
import { EntrySkeletonType } from './query'
import { LocaleCode } from './locale'
import { ChainModifiers } from './client'

/**
 * @category Sync
 */
export type SyncOptions = {
  /**
   * @defaultValue true
   */
  paginate?: boolean
}

/**
 * @category Sync
 */
export type SyncQuery = {
  initial?: true
  limit?: number
  nextSyncToken?: string
  nextPageToken?: string
} & (
  | { type: 'Entry'; content_type: string }
  | { type?: 'Asset' | 'Entry' | 'Deletion' | 'DeletedAsset' | 'DeletedEntry' }
)

/**
 * @category Sync
 */
export type SyncPageQuery = SyncQuery & { sync_token?: string }

/**
 * @category Sync
 */
export type SyncResponse = {
  nextPageUrl?: string
  nextSyncUrl?: string
  items: SyncEntities[]
}

/**
 * @category Sync
 */
export type SyncPageResponse = {
  nextPageToken?: string
  nextSyncToken?: string
  items: SyncEntities[]
}

/**
 * System managed metadata for deleted entries
 * @category Sync
 */
export type DeletedEntry = {
  sys: EntitySys & { type: 'DeletedEntry' }
}

/**
 * System managed metadata for deleted assets
 * @category Sync
 */
export type DeletedAsset = {
  sys: EntitySys & { type: 'DeletedAsset' }
}

/**
 * @category Sync
 */
export type SyncEntities = Entry<EntrySkeletonType> | Asset | DeletedEntry | DeletedAsset

/**
 * @category Sync
 */
export interface SyncCollection<
  EntrySkeleton extends EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> {
  entries: Array<
    Entry<
      EntrySkeleton,
      ChainModifiers extends Modifiers
        ? ChainModifiers
        : Exclude<Modifiers, undefined> | 'WITH_ALL_LOCALES',
      Locales
    >
  >
  assets: Array<
    Asset<
      ChainModifiers extends Modifiers
        ? ChainModifiers
        : Exclude<Modifiers, undefined> | 'WITH_ALL_LOCALES',
      Locales
    >
  >
  deletedEntries: Array<DeletedEntry>
  deletedAssets: Array<DeletedAsset>
  nextSyncToken?: string
  nextPageToken?: string
}
