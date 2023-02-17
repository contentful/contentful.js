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
import {
  ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks,
  ChainOptionWithAllLocalesAndWithoutLinkResolution,
  ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks,
  ChainOptionWithoutLinkResolution,
  ChainOptionWithLinkResolutionAndWithUnresolvableLinks,
  ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks,
} from '../../lib/utils/client-helpers'

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

expectNotAssignable<
  ConfiguredAsset<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  >
>(asset)
expectAssignable<
  ConfiguredAsset<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  >
>(assetWithAllLocales)

expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOptionWithAllLocalesAndWithoutLinkResolution>
>(asset)
expectAssignable<ConfiguredAsset<AssetLocales, ChainOptionWithAllLocalesAndWithoutLinkResolution>>(
  assetWithAllLocales
)

expectNotAssignable<
  ConfiguredAsset<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  >
>(asset)
expectAssignable<
  ConfiguredAsset<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  >
>(assetWithAllLocales)

expectNotAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  >
>(assetCollection)
expectAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithUnresolvableLinks
  >
>(assetCollectionWithAllLocales)

expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOptionWithAllLocalesAndWithoutLinkResolution>
>(assetCollection)
expectAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOptionWithAllLocalesAndWithoutLinkResolution>
>(assetCollectionWithAllLocales)

expectNotAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  >
>(assetCollection)
expectAssignable<
  ConfiguredAssetCollection<
    AssetLocales,
    ChainOptionWithAllLocalesAndWithLinkResolutionAndWithoutUnresolvableLinks
  >
>(assetCollectionWithAllLocales)

expectAssignable<ConfiguredAsset<AssetLocales, ChainOptionWithoutLinkResolution>>(asset)
expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOptionWithoutLinkResolution>>(
  assetWithAllLocales
)

expectAssignable<
  ConfiguredAsset<AssetLocales, ChainOptionWithLinkResolutionAndWithUnresolvableLinks>
>(asset)
expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOptionWithLinkResolutionAndWithUnresolvableLinks>
>(assetWithAllLocales)

expectAssignable<
  ConfiguredAsset<AssetLocales, ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks>
>(asset)
expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks>
>(assetWithAllLocales)

expectAssignable<ConfiguredAssetCollection<AssetLocales, ChainOptionWithoutLinkResolution>>(
  assetCollection
)
expectNotAssignable<ConfiguredAssetCollection<AssetLocales, ChainOptionWithoutLinkResolution>>(
  assetCollectionWithAllLocales
)

expectAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOptionWithLinkResolutionAndWithUnresolvableLinks>
>(assetCollection)
expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOptionWithLinkResolutionAndWithUnresolvableLinks>
>(assetCollectionWithAllLocales)

expectAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks>
>(assetCollection)
expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOptionWithLinkResolutionAndWithoutUnresolvableLinks>
>(assetCollectionWithAllLocales)
