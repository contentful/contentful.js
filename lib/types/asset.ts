import { ContentfulCollection } from './collection'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { EntitySys } from './sys'
import { ChainModifiers } from './client'

/**
 * @module Asset
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
 * @category Asset
 */
export interface Asset<
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> {
  sys: AssetSys
  fields: ChainModifiers extends Modifiers
    ?
        | {
            [LocaleName in Locales]?: AssetFields
          }
        | AssetFields
    : 'WITH_ALL_LOCALES' extends Modifiers
    ? {
        [LocaleName in Locales]?: AssetFields
      }
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
 * @category Asset
 */
export type AssetCollection<
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = ContentfulCollection<Asset<Modifiers, Locales>>

/**
 * @category Asset
 */
export type AssetSys = EntitySys & {
  type: 'Asset'
}
