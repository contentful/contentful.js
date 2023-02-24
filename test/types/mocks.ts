import {
  Asset,
  AssetDetails,
  AssetFields,
  AssetFile,
  AssetLink,
  AssetSys,
  BaseEntry,
  EntryLink,
  EntrySys,
  FieldsType,
} from '../../lib'

export const stringValue = ''
export const numberValue = 123
export const booleanValue = true
export const dateValue = '2018-05-03T09:18:16.329Z'
export const locationValue = { lat: 55.01496234536782, lon: 38.75813066219786 }
export const jsonValue = {}
export const metadataValue = { tags: [] }
export const entryLink: EntryLink = {
  type: 'Link',
  linkType: 'Entry',
  id: stringValue,
}

export const entrySys: EntrySys = {
  contentType: { sys: { id: stringValue, type: 'Link', linkType: 'ContentType' } },
  environment: { sys: { id: stringValue, type: 'Link', linkType: 'Environment' } },
  revision: numberValue,
  space: { sys: { id: stringValue, type: 'Link', linkType: 'Space' } },
  type: 'Entry',
  updatedAt: dateValue,
  id: stringValue,
  createdAt: dateValue,
}

export const entryBasics = {
  sys: entrySys,
  metadata: metadataValue,
}

export type SimpleEntryFields = {
  title: string
}

export type LocalizedEntryFields = {
  title: { US?: string; DE?: string }
}

export const entry = {
  ...entryBasics,
  fields: {
    title: 'title',
  },
}

export const localizedEntry = {
  ...entryBasics,
  fields: {
    title: { US: 'title', DE: 'titel' },
  },
}

export const getEntry = <Fields extends FieldsType>(
  fields: Fields
): BaseEntry & { fields: Fields } => ({ ...entryBasics, fields })

export const assetLink: AssetLink = {
  type: 'Link',
  linkType: 'Asset',
  id: stringValue,
}

export const assetSys: AssetSys = {
  environment: { sys: { id: stringValue, type: 'Link', linkType: 'Environment' } },
  revision: numberValue,
  space: { sys: { id: stringValue, type: 'Link', linkType: 'Space' } },
  type: 'Asset',
  updatedAt: dateValue,
  id: stringValue,
  createdAt: dateValue,
}

export const assetBasics = {
  sys: assetSys,
  metadata: metadataValue,
}

export const assetDetails: AssetDetails = {
  size: numberValue,
  image: {
    width: numberValue,
    height: numberValue,
  },
}

export const assetFile: AssetFile = {
  url: stringValue,
  details: assetDetails,
  fileName: stringValue,
  contentType: stringValue,
}

export const assetFields: AssetFields = {
  title: stringValue,
  description: stringValue,
  file: assetFile,
}

export const asset: Asset = { ...assetBasics, fields: assetFields }
