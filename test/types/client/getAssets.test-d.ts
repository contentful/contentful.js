import { expectType } from 'tsd'
import { Asset, AssetCollection, createClient, LocaleCode } from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

expectType<AssetCollection<undefined>>(await client.getAssets())

expectType<Asset<undefined>>(await client.getAsset('test'))

expectType<AssetCollection<'WITH_ALL_LOCALES'>>(await client.withAllLocales.getAssets<LocaleCode>())

expectType<Asset<'WITH_ALL_LOCALES'>>(await client.withAllLocales.getAsset<LocaleCode>('test'))
