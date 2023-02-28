import { Asset } from './asset'
import { Entry } from './entry'
import { EntitySys } from './sys'
import { FieldsType } from './query'
import { LocaleCode } from './locale'
import { ChainModifiers } from '../utils/client-helpers'

export type SyncQuery =
  | ({ initial: true; limit?: number } & (
      | {
          type?: 'Asset' | 'Entry' | 'Deletion' | 'DeletedAsset' | 'DeletedEntry'
        }
      | {
          content_type: string
          type?: 'Entry'
        }
    ))
  | { nextSyncToken: string }
  | { nextPageToken: string }

export type DeletedEntry = {
  sys: EntitySys & { type: 'DeletedEntry' }
}

export type DeletedAsset = {
  sys: EntitySys & { type: 'DeletedAsset' }
}

export interface SyncCollection<
  Fields extends FieldsType = FieldsType,
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> {
  entries: Array<
    Entry<
      Fields,
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
  nextSyncToken: string
}
