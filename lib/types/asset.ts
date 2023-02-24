import { ChainModifiers } from '../utils/client-helpers'
import { ContentfulCollection } from './collection'
import { LocaleCode } from './locale'
import { Metadata } from './metadata'
import { EntitySys } from './sys'

export interface AssetDetails {
  size: number
  image?: {
    width: number
    height: number
  }
}

export interface AssetFile {
  url: string
  details: AssetDetails
  fileName: string
  contentType: string
}

export interface AssetFields {
  title?: string
  description?: string
  file?: AssetFile
}

/**
 * @category Entities
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

export type AssetCollection<
  Modifiers extends ChainModifiers = ChainModifiers,
  Locales extends LocaleCode = LocaleCode
> = ContentfulCollection<Asset<Modifiers, Locales>>
export type AssetSys = EntitySys & {
  type: 'Asset'
}
