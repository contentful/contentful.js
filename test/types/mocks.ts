import {
  Asset,
  AssetDetails,
  AssetFields,
  AssetFile,
  AssetLink,
  AssetSys,
  BaseEntry,
  EntryFields,
  EntryFieldTypes,
  EntrySys,
  FieldsType,
  Link,
  BoundingBoxSearchFilterInput,
  BoundingCircleSearchFilterInput,
  ProximitySearchFilterInput,
  ResourceLink,
} from '../../lib'

export const anyValue = '' as any
export const stringValue = ''
export const stringArrayValue = [stringValue]
export const numberValue = 123
export const numberArrayValue = [numberValue]

export const booleanValue = true as boolean
export const booleanArrayValue = [booleanValue]
export const dateValue: EntryFields.Date = '2018-05-03T09:18:16.329Z'
export const dateArrayValue = [dateValue]
export const locationValue = { lat: 55.01496234536782, lon: 38.75813066219786 }
export const jsonValue = {}

export const nearLocationValue: ProximitySearchFilterInput = [1, 0]
export const withinCircleLocationValue: BoundingCircleSearchFilterInput = [1, 0, 2]
export const withinBoxLocationValue: BoundingBoxSearchFilterInput = [1, 0, 2, 1]

export const metadataValue = { tags: [] }
export const entryLink: { sys: Link<'Entry'> } = {
  sys: {
    type: 'Link',
    linkType: 'Entry',
    id: stringValue,
  },
}
export const entryResourceLink: { sys: ResourceLink } = {
  sys: {
    type: 'ResourceLink',
    linkType: 'Contentful:Entry',
    urn: stringValue,
  },
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

export type SimpleEntrySkeleton = {
  fields: {
    title: EntryFieldTypes.Symbol
  }
  contentTypeId: string
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
  fields: Fields,
): BaseEntry & { fields: Fields } => ({ ...entryBasics, fields })

export const assetLink: { sys: AssetLink } = {
  sys: {
    type: 'Link',
    linkType: 'Asset',
    id: stringValue,
  },
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

export const localizedAssetFields = {
  title: { US: stringValue, DE: stringValue },
  description: { US: stringValue, DE: stringValue },
  file: { US: assetFile, DE: assetFile },
}

export const asset = { ...assetBasics, fields: assetFields }

export const localizedAsset = { ...assetBasics, fields: localizedAssetFields }
