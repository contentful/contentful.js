import { decode, SourceMapMetadata } from '@contentful/content-source-maps'
import { get } from 'json-pointer'
import {
  Asset,
  AssetCollection,
  ChainModifiers,
  CreateClientParams,
  Entry,
  EntryCollection,
  EntrySkeletonType,
  LocaleCode,
} from '../../lib'

export const params: CreateClientParams = {
  accessToken: 'QGT8WxED1nwrbCUpY6VEK6eFvZwvlC5ujlX-rzUq97U',
  space: 'ezs1swce23xe',
}
export const localeSpaceParams = {
  accessToken: 'p1qWlqQjma9OL_Cb-BN8YvpZ0KnRfXPjvqIWChlfL04',
  space: '7dh3w86is8ls',
}

export const previewParams = {
  host: 'preview.contentful.com',
  accessToken: 'WwNjBWmjh5DJLhrpDuoDyFX-wTz80WLalpdyFQTMGns',
  space: 'ezs1swce23xe',
}

export const previewParamsWithCSM = {
  ...previewParams,
  includeContentSourceMaps: true,
}

export type Mappings = Record<
  string,
  SourceMapMetadata | Record<string, SourceMapMetadata> | undefined
>

type EncodedResponse =
  | Asset
  | Entry
  | AssetCollection
  | EntryCollection<EntrySkeletonType, ChainModifiers, LocaleCode>

export function testEncodingDecoding(encodedResponse: EncodedResponse, mappings: Mappings) {
  for (const [key, expectedValue] of Object.entries(mappings)) {
    const encodedValue = get(encodedResponse, key)
    const decodedValue = decode(encodedValue)

    expect(decodedValue).toEqual(expectedValue)
  }
}

const mappedAsset = {
  origin: 'contentful.com',
  href: 'https://app.contentful.com/spaces/ezs1swce23xe/environments/master/assets/1x0xpXu4pSGS4OukSyWGUK/?focusedField=title&focusedLocale=en-US',
  contentful: {
    space: 'ezs1swce23xe',
    environment: 'master',
    field: 'title',
    locale: 'en-US',
    entity: '1x0xpXu4pSGS4OukSyWGUK',
    entityType: 'Asset',
    editorInterface: {
      widgetId: 'singleLine',
      widgetNamespace: 'builtin',
    },
    fieldType: 'Symbol',
  },
}

const mappedAssetCollection = {
  origin: 'contentful.com',
  href: 'https://app.contentful.com/spaces/ezs1swce23xe/environments/master/assets/38eGMAzUH5Ezv7mjU0CToA/?focusedField=title&focusedLocale=en-US',
  contentful: {
    space: 'ezs1swce23xe',
    environment: 'master',
    field: 'title',
    locale: 'en-US',
    entity: '38eGMAzUH5Ezv7mjU0CToA',
    entityType: 'Asset',
    editorInterface: {
      widgetId: 'singleLine',
      widgetNamespace: 'builtin',
    },
    fieldType: 'Symbol',
  },
}

const mappedEntryCollection = {
  origin: 'contentful.com',
  href: 'https://app.contentful.com/spaces/ezs1swce23xe/environments/master/assets/38eGMAzUH5Ezv7mjU0CToA/?focusedField=title&focusedLocale=en-US',
  contentful: {
    space: 'ezs1swce23xe',
    environment: 'master',
    field: 'name',
    locale: 'en-US',
    entity: '38eGMAzUH5Ezv7mjU0CToA',
    entityType: 'Entry',
    editorInterface: {
      widgetId: 'singleLine',
      widgetNamespace: 'builtin',
    },
    fieldType: 'Symbol',
  },
}

export const assetMappings = {
  '/fields/title': mappedAsset,
}

export const localisedAssetMappings = {
  '/fields/title/en-US': mappedAsset,
}

export const assetMappingsCollection = {
  '/items/0/fields/title': mappedAssetCollection,
}

export const entryMappingsCollection = {
  '/items/0/fields/name': mappedEntryCollection,
}

export const localisedAssetMappingsCollection = {
  '/items/0/fields/title/en-US': mappedAssetCollection,
}
