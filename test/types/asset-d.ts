// As tsd does not pick up the global.d.ts located in /lib we
// explicitly reference it here once.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../lib/global.d.ts" />
import { expectAssignable, expectNotAssignable } from 'tsd'

import {
  Asset,
  AssetCollection,
  AssetDetails,
  AssetFields,
  AssetFile,
  ChainModifiers,
} from '../../lib'

// @ts-ignore
import * as mocks from './mocks'

type AssetLocales = 'US' | 'DE'

const assetCollection = {
  total: mocks.numberValue,
  skip: mocks.numberValue,
  limit: mocks.numberValue,
  items: [mocks.asset],
}

const assetCollectionWithAllLocales = {
  total: mocks.numberValue,
  skip: mocks.numberValue,
  limit: mocks.numberValue,
  items: [mocks.localizedAsset],
}

expectAssignable<AssetDetails>(mocks.assetDetails)
expectAssignable<AssetFile>(mocks.assetFile)
expectAssignable<AssetFields>(mocks.assetFields)

expectAssignable<Asset<undefined>>(mocks.asset)
expectAssignable<Asset<'WITH_ALL_LOCALES', AssetLocales>>(mocks.localizedAsset)

expectAssignable<Asset<ChainModifiers, AssetLocales>>(mocks.asset)
expectAssignable<Asset<ChainModifiers, AssetLocales>>(mocks.localizedAsset)

expectAssignable<AssetCollection<undefined>>(assetCollection)
expectAssignable<AssetCollection<'WITH_ALL_LOCALES', AssetLocales>>(assetCollectionWithAllLocales)

expectAssignable<AssetCollection<ChainModifiers, AssetLocales>>(assetCollection)
expectAssignable<AssetCollection<ChainModifiers, AssetLocales>>(assetCollectionWithAllLocales)

expectNotAssignable<Asset<'WITH_ALL_LOCALES', AssetLocales>>(mocks.asset)
expectAssignable<Asset<'WITH_ALL_LOCALES', AssetLocales>>(mocks.localizedAsset)

expectNotAssignable<Asset<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
  mocks.asset
)
expectAssignable<Asset<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
  mocks.localizedAsset
)

expectNotAssignable<Asset<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(
  mocks.asset
)
expectAssignable<Asset<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(
  mocks.localizedAsset
)

expectNotAssignable<AssetCollection<'WITH_ALL_LOCALES', AssetLocales>>(assetCollection)
expectAssignable<AssetCollection<'WITH_ALL_LOCALES', AssetLocales>>(assetCollectionWithAllLocales)

expectNotAssignable<AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
  assetCollection
)
expectAssignable<AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
  assetCollectionWithAllLocales
)

expectNotAssignable<
  AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>
>(assetCollection)
expectAssignable<AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(
  assetCollectionWithAllLocales
)

expectAssignable<Asset<'WITHOUT_LINK_RESOLUTION', AssetLocales>>(mocks.asset)
expectNotAssignable<Asset<'WITHOUT_LINK_RESOLUTION', AssetLocales>>(mocks.localizedAsset)

expectAssignable<Asset<undefined, AssetLocales>>(mocks.asset)
expectNotAssignable<Asset<undefined, AssetLocales>>(mocks.localizedAsset)

expectAssignable<Asset<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(mocks.asset)
expectNotAssignable<Asset<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(mocks.localizedAsset)

expectAssignable<AssetCollection<'WITHOUT_LINK_RESOLUTION', AssetLocales>>(assetCollection)
expectNotAssignable<AssetCollection<'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
  assetCollectionWithAllLocales
)

expectAssignable<AssetCollection<undefined, AssetLocales>>(assetCollection)
expectNotAssignable<AssetCollection<undefined, AssetLocales>>(assetCollectionWithAllLocales)

expectAssignable<AssetCollection<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(assetCollection)
expectNotAssignable<AssetCollection<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(
  assetCollectionWithAllLocales
)
