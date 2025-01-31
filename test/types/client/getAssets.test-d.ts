import { expectTypeOf, test } from "vitest";
import { Asset, AssetCollection, createClient } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type Locale = 'en'

test('getAssets', async () => {

expectTypeOf<Asset<undefined>>(await client.getAsset('test'))

expectTypeOf<AssetCollection<undefined>>(await client.getAssets())

expectTypeOf<Asset<'WITH_ALL_LOCALES'>>(await client.withAllLocales.getAsset('test'))
expectTypeOf<Asset<'WITH_ALL_LOCALES', Locale>>(await client.withAllLocales.getAsset<Locale>('test'))

expectTypeOf<AssetCollection<'WITH_ALL_LOCALES'>>(await client.withAllLocales.getAssets())
expectTypeOf<AssetCollection<'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getAssets<Locale>(),
)
})