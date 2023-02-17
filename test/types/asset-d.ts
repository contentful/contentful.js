// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'

import {
  Asset,
  AssetCollection,
  AssetCollectionWithAllLocales,
  AssetDetails,
  AssetFields,
  AssetFile,
  AssetWithAllLocales,
  EntrySys,
  GenericAsset,
  GenericAssetCollection,
  ConfiguredAsset,
  ConfiguredAssetCollection,
} from '../../lib'
import { ChainOption } from '../../lib/utils/client-helpers'

const stringValue = ''
const numberValue = 123
const dateValue = '2018-05-03T09:18:16.329Z'

const entrySysValue: EntrySys = {
  contentType: { sys: { id: stringValue, type: 'Link', linkType: 'ContentType' } },
  environment: { sys: { id: stringValue, type: 'Link', linkType: 'Environment' } },
  revision: numberValue,
  space: { sys: { id: stringValue, type: 'Link', linkType: 'Space' } },
  type: '', //?
  updatedAt: dateValue,
  id: stringValue,
  createdAt: dateValue,
}
const metadataValue = { tags: [] }

type AssetLocales = 'US' | 'DE'

const assetBasics = {
  sys: entrySysValue,
  metadata: metadataValue,
}

const assetDetails: AssetDetails = {
  size: numberValue,
  image: {
    width: numberValue,
    height: numberValue,
  },
}

const assetFile: AssetFile = {
  url: stringValue,
  details: assetDetails,
  fileName: stringValue,
  contentType: stringValue,
}

const assetFields: AssetFields = {
  title: stringValue,
  description: stringValue,
  file: assetFile,
}

const asset: Asset = { ...assetBasics, fields: assetFields }
const assetWithAllLocales: AssetWithAllLocales<AssetLocales> = {
  ...assetBasics,
  fields: {
    US: assetFields,
    DE: assetFields,
  },
}

const assetCollection: AssetCollection = {
  total: numberValue,
  skip: numberValue,
  limit: numberValue,
  items: [asset],
}

const assetCollectionWithAllLocales: AssetCollectionWithAllLocales<AssetLocales> = {
  total: numberValue,
  skip: numberValue,
  limit: numberValue,
  items: [assetWithAllLocales],
}

expectAssignable<AssetDetails>(assetDetails)
expectAssignable<AssetFile>(assetFile)
expectAssignable<AssetFields>(assetFields)

expectAssignable<Asset>(asset)
expectAssignable<AssetWithAllLocales<AssetLocales>>(assetWithAllLocales)

expectAssignable<GenericAsset<AssetLocales>>(asset)
expectAssignable<GenericAsset<AssetLocales>>(assetWithAllLocales)

expectAssignable<AssetCollection>(assetCollection)
expectAssignable<AssetCollectionWithAllLocales<AssetLocales>>(assetCollectionWithAllLocales)

expectAssignable<GenericAssetCollection<AssetLocales>>(assetCollection)
expectAssignable<GenericAssetCollection<AssetLocales>>(assetCollectionWithAllLocales)

expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES'>>>(asset)
expectAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES'>>>(
  assetWithAllLocales
)

expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>
>(asset)
expectAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>
>(assetWithAllLocales)

expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>
>(asset)
expectAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>
>(assetWithAllLocales)

expectNotAssignable<ConfiguredAssetCollection<AssetLocales, ChainOption<'WITH_ALL_LOCALES'>>>(
  assetCollection
)
expectAssignable<ConfiguredAssetCollection<AssetLocales, ChainOption<'WITH_ALL_LOCALES'>>>(
  assetCollectionWithAllLocales
)

expectNotAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>
  >
>(assetCollection)
expectAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>
  >
>(assetCollectionWithAllLocales)

expectNotAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>
  >
>(assetCollection)
expectAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>
  >
>(assetCollectionWithAllLocales)

expectAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>>(asset)
expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>>(
  assetWithAllLocales
)

expectAssignable<ConfiguredAsset<AssetLocales, ChainOption>>(asset)
expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption>>(assetWithAllLocales)

expectAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>>(asset)
expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  assetWithAllLocales
)

expectAssignable<ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>>(
  assetCollection
)
expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>
>(assetCollectionWithAllLocales)

expectAssignable<ConfiguredAssetCollection<AssetLocales, ChainOption>>(assetCollection)
expectNotAssignable<ConfiguredAssetCollection<AssetLocales, ChainOption>>(
  assetCollectionWithAllLocales
)

expectAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>
>(assetCollection)
expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>
>(assetCollectionWithAllLocales)
