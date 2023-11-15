import { expectType } from 'tsd'
import { Asset, AssetCollection, createClient } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

type Locale = 'en'

expectType<Asset<undefined>>(await client.getAsset('test'))

expectType<AssetCollection<undefined>>(await client.getAssets())

expectType<Asset<'WITH_ALL_LOCALES'>>(await client.withAllLocales.getAsset('test'))
expectType<Asset<'WITH_ALL_LOCALES', Locale>>(await client.withAllLocales.getAsset<Locale>('test'))

expectType<AssetCollection<'WITH_ALL_LOCALES'>>(await client.withAllLocales.getAssets())
expectType<AssetCollection<'WITH_ALL_LOCALES', Locale>>(
  await client.withAllLocales.getAssets<Locale>(),
)
