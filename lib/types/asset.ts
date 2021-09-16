import { ContentfulCollection } from './collection'
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
  file: AssetFile
}

export interface Asset {
  sys: AssetSys
  fields: AssetFields
}


export type AssetMimeType =
  'attachment'
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
export type AssetSys = EntitySys
