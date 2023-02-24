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
  GenericAsset,
  GenericAssetCollection,
  ConfiguredAsset,
  ConfiguredAssetCollection,
} from '../../lib'
import { ChainOption, DefaultChainOption } from '../../lib/utils/client-helpers'
// @ts-ignore
import * as mocks from './mocks'

type AssetLocales = 'US' | 'DE'

const assetWithAllLocales: AssetWithAllLocales<AssetLocales> = {
  ...mocks.assetBasics,
  fields: {
    US: mocks.assetFields,
    DE: mocks.assetFields,
  },
}

const assetCollection: AssetCollection = {
  total: mocks.numberValue,
  skip: mocks.numberValue,
  limit: mocks.numberValue,
  items: [mocks.asset],
}

const assetCollectionWithAllLocales: AssetCollectionWithAllLocales<AssetLocales> = {
  total: mocks.numberValue,
  skip: mocks.numberValue,
  limit: mocks.numberValue,
  items: [assetWithAllLocales],
}

expectAssignable<AssetDetails>(mocks.assetDetails)
expectAssignable<AssetFile>(mocks.assetFile)
expectAssignable<AssetFields>(mocks.assetFields)

expectAssignable<Asset>(mocks.asset)
expectAssignable<AssetWithAllLocales<AssetLocales>>(assetWithAllLocales)

expectAssignable<GenericAsset<AssetLocales>>(mocks.asset)
expectAssignable<GenericAsset<AssetLocales>>(assetWithAllLocales)

expectAssignable<AssetCollection>(assetCollection)
expectAssignable<AssetCollectionWithAllLocales<AssetLocales>>(assetCollectionWithAllLocales)

expectAssignable<GenericAssetCollection<AssetLocales>>(assetCollection)
expectAssignable<GenericAssetCollection<AssetLocales>>(assetCollectionWithAllLocales)

expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES'>>>(mocks.asset)
expectAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES'>>>(
  assetWithAllLocales
)

expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>
>(mocks.asset)
expectAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION'>>
>(assetWithAllLocales)

expectNotAssignable<
  ConfiguredAsset<AssetLocales, ChainOption<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS'>>
>(mocks.asset)
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

expectAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>>(mocks.asset)
expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>>(
  assetWithAllLocales
)

expectAssignable<ConfiguredAsset<AssetLocales, DefaultChainOption>>(mocks.asset)
expectNotAssignable<ConfiguredAsset<AssetLocales, DefaultChainOption>>(assetWithAllLocales)

expectAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  mocks.asset
)
expectNotAssignable<ConfiguredAsset<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>>(
  assetWithAllLocales
)

expectAssignable<ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>>(
  assetCollection
)
expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_LINK_RESOLUTION'>>
>(assetCollectionWithAllLocales)

expectAssignable<ConfiguredAssetCollection<AssetLocales, DefaultChainOption>>(assetCollection)
expectNotAssignable<ConfiguredAssetCollection<AssetLocales, DefaultChainOption>>(
  assetCollectionWithAllLocales
)

expectAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>
>(assetCollection)
expectNotAssignable<
  ConfiguredAssetCollection<AssetLocales, ChainOption<'WITHOUT_UNRESOLVABLE_LINKS'>>
>(assetCollectionWithAllLocales)
