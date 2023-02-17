import { ChainOptions } from '../utils/client-helpers'
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
export interface Asset {
  sys: AssetSys
  fields: AssetFields
  metadata: Metadata
}

export interface AssetWithAllLocales<Locales extends LocaleCode> {
  sys: AssetSys
  fields: {
    [LocaleName in Locales]?: AssetFields
  }
  metadata: Metadata
}

export type GenericAsset<Locale extends LocaleCode> = Asset | AssetWithAllLocales<Locale>

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

export type AssetCollection = ContentfulCollection<Asset>
export type AssetCollectionWithAllLocales<Locales extends LocaleCode> = ContentfulCollection<
  AssetWithAllLocales<Locales>
>
export type GenericAssetCollection<Locales extends LocaleCode> =
  | AssetCollection
  | AssetCollectionWithAllLocales<Locales>
export type AssetSys = EntitySys

export type ConfiguredAsset<
  Locales extends LocaleCode,
  Options extends ChainOptions
> = Options extends { withAllLocales: true } ? AssetWithAllLocales<Locales> : Asset

export type ConfiguredAssetCollection<
  Locales extends LocaleCode,
  Options extends ChainOptions
> = Options extends { withAllLocales: true }
  ? AssetCollectionWithAllLocales<Locales>
  : AssetCollection
