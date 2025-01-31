import { expectTypeOf, test } from "vitest";

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
test('asset', async () => {
  expectTypeOf<AssetDetails>(mocks.assetDetails)
  expectTypeOf<AssetFile>(mocks.assetFile)
  expectTypeOf<AssetFields>(mocks.assetFields)

  expectTypeOf<Asset<undefined>>(mocks.asset)
  expectTypeOf<Asset<'WITH_ALL_LOCALES', AssetLocales>>(mocks.localizedAsset)

  expectTypeOf<Asset<ChainModifiers, AssetLocales>>(mocks.asset)
  expectTypeOf<Asset<ChainModifiers, AssetLocales>>(mocks.localizedAsset)

  expectTypeOf<AssetCollection<undefined>>(assetCollection)
  expectTypeOf<AssetCollection<'WITH_ALL_LOCALES', AssetLocales>>(assetCollectionWithAllLocales)

  expectTypeOf<AssetCollection<ChainModifiers, AssetLocales>>(assetCollection)
  expectTypeOf<AssetCollection<ChainModifiers, AssetLocales>>(assetCollectionWithAllLocales)

  expectTypeOf(mocks.asset).not.toEqualTypeOf<Asset<'WITH_ALL_LOCALES', AssetLocales>>()
  expectTypeOf<Asset<'WITH_ALL_LOCALES', AssetLocales>>(mocks.localizedAsset)

  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    Asset<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>
  >()
  expectTypeOf<Asset<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
    mocks.localizedAsset,
  )

  expectTypeOf(mocks.asset).not.toEqualTypeOf<
    Asset<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>
  >()
  expectTypeOf<Asset<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(
    mocks.localizedAsset,
  )

  expectTypeOf(assetCollection).not.toEqualTypeOf<
    AssetCollection<'WITH_ALL_LOCALES', AssetLocales>
  >()
  expectTypeOf<AssetCollection<'WITH_ALL_LOCALES', AssetLocales>>(assetCollectionWithAllLocales)

  expectTypeOf(assetCollection).not.toEqualTypeOf<
    AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>
  >()
  expectTypeOf<AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_LINK_RESOLUTION', AssetLocales>>(
    assetCollectionWithAllLocales,
  )

  expectTypeOf(assetCollection).not.toEqualTypeOf<
    AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>
  >()
  expectTypeOf<AssetCollection<'WITH_ALL_LOCALES' | 'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(
    assetCollectionWithAllLocales,
  )

  expectTypeOf<Asset<'WITHOUT_LINK_RESOLUTION', AssetLocales>>(mocks.asset)
  expectTypeOf(mocks.localizedAsset).not.toEqualTypeOf<
    Asset<'WITHOUT_LINK_RESOLUTION', AssetLocales>
  >()

  expectTypeOf<Asset<undefined, AssetLocales>>(mocks.asset)
  expectTypeOf(mocks.localizedAsset).not.toEqualTypeOf<Asset<undefined, AssetLocales>>()

  expectTypeOf<Asset<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(mocks.asset)
  expectTypeOf(mocks.localizedAsset).not.toEqualTypeOf<
    Asset<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>
  >()

  expectTypeOf<AssetCollection<'WITHOUT_LINK_RESOLUTION', AssetLocales>>(assetCollection)
  expectTypeOf(assetCollectionWithAllLocales).not.toEqualTypeOf<
    AssetCollection<'WITHOUT_LINK_RESOLUTION', AssetLocales>
  >()

  expectTypeOf<AssetCollection<undefined, AssetLocales>>(assetCollection)
  expectTypeOf(assetCollectionWithAllLocales).not.toEqualTypeOf<
    AssetCollection<undefined, AssetLocales>
  >()

  expectTypeOf<AssetCollection<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>>(assetCollection)
  expectTypeOf(assetCollectionWithAllLocales).not.toEqualTypeOf<
    AssetCollection<'WITHOUT_UNRESOLVABLE_LINKS', AssetLocales>
  >()
})