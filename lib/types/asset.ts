import type { ContentfulCollection, CursorPaginatedCollection } from './collection.js'
import type { LocaleCode } from './locale.js'
import type { Metadata } from './metadata.js'
import type { EntitySys } from './sys.js'
import type { ChainModifiers } from './client.js'

/**
 * @category Asset
 */
export interface AssetDetails {
  size: number
  image?: {
    width: number
    height: number
  }
}

/**
 * @category Asset
 */
export interface AssetFile {
  url: string
  details: AssetDetails
  fileName: string
  contentType: string
}

/**
 * @category Asset
 */
export interface AssetFields {
  title?: string
  description?: string
  file?: AssetFile
}

/**
 * Assets are binary files in a Contentful space
 * @category Asset
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for asset field values.
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/assets | Documentation}
 */
export interface Asset<
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> {
  sys: AssetSys
  fields: ChainModifiers extends Modifiers
    ?
        | { [FieldName in keyof AssetFields]: { [LocaleName in Locales]?: AssetFields[FieldName] } }
        | AssetFields
    : 'WITH_ALL_LOCALES' extends Modifiers
      ? { [FieldName in keyof AssetFields]: { [LocaleName in Locales]?: AssetFields[FieldName] } }
      : AssetFields
  metadata: Metadata
}

/**
 * @category Asset
 */
export type AssetMimeType =
  | 'attachment'
  | 'plaintext'
  | 'image'
  | 'audio'
  | 'video'
  | 'richtext'
  | 'presentation'
  | 'spreadsheet'
  | 'pdfdocument'
  | 'archive'
  | 'code'
  | 'markup'

/**
 * A collection of assets
 * @category Asset
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for asset field values.
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/assets | Documentation}
 */
export type AssetCollection<
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = ContentfulCollection<Asset<Modifiers, Locales>>

/**
 * A cursor paginated collection of assets
 * @category Asset
 * @typeParam Modifiers - The chain modifiers used to configure the client. They’re set automatically when using the client chain modifiers.
 * @typeParam Locales - If provided for a client using `allLocales` modifier, response type defines locale keys for asset field values.
 * @see {@link https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/assets | Documentation}
 */
export type AssetCursorPaginatedCollection<
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode,
> = CursorPaginatedCollection<Asset<Modifiers, Locales>>

/**
 * System managed metadata for assets
 * @category Asset
 */
export type AssetSys = EntitySys & {
  type: 'Asset'
}
