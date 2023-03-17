import { Asset } from './asset'
import { Entry } from './entry'
import { EntitySys } from './sys'
import { FieldsWithContentTypeIdType } from './query'
import { LocaleCode } from './locale'
import { ChainModifiers } from '../utils/client-helpers'

export type SyncOptions = {
  paginate?: boolean
}

export type SyncQuery = {
  initial?: true
  limit?: number
  nextSyncToken?: string
  nextPageToken?: string
} & (
  | { type: 'Entry'; content_type: string }
  | { type?: 'Asset' | 'Entry' | 'Deletion' | 'DeletedAsset' | 'DeletedEntry' }
)

export type SyncPageQuery = SyncQuery & { sync_token?: string }

export type SyncResponse = {
  nextPageUrl?: string
  nextSyncUrl?: string
  items: SyncEntities[]
}

export type SyncPageResponse = {
  nextPageToken?: string
  nextSyncToken?: string
  items: SyncEntities[]
}

export type DeletedEntry = {
  sys: EntitySys & { type: 'DeletedEntry' }
}

export type DeletedAsset = {
  sys: EntitySys & { type: 'DeletedAsset' }
}

export type SyncEntities = Entry<FieldsWithContentTypeIdType> | Asset | DeletedEntry | DeletedAsset

export interface SyncCollection<
  FieldsWithContentTypeId extends FieldsWithContentTypeIdType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> {
  entries: Array<
    Entry<
      FieldsWithContentTypeId,
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
