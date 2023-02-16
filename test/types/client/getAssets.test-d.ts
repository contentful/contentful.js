import { expectType } from 'tsd'
import {
  Asset,
  AssetCollection,
  createClient,
  AssetCollectionWithAllLocales,
  AssetWithAllLocales,
  LocaleCode,
} from '../../../lib'

const client = createClient({
  accessToken: 'accessToken',
  space: 'spaceId',
})

expectType<AssetCollection>(await client.getAssets())

expectType<Asset>(await client.getAsset('test'))

expectType<AssetCollectionWithAllLocales<LocaleCode>>(
  await client.withAllLocales.getAssets<LocaleCode>()
)

expectType<AssetWithAllLocales<LocaleCode>>(
  await client.withAllLocales.getAsset<LocaleCode>('test')
)
