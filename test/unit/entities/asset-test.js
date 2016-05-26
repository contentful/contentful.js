import test from 'tape'
import {assetMock} from '../mocks'
import {wrapAsset, wrapAssetCollection} from '../../../lib/entities/asset'

test('Asset is wrapped', (t) => {
  const wrappedAsset = wrapAsset(assetMock)
  t.looseEqual(wrappedAsset.toPlainObject(), assetMock)
  t.end()
})

test('Asset collection is wrapped', (t) => {
  const assetCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      assetMock
    ]
  }
  const wrappedAsset = wrapAssetCollection(assetCollection)
  t.looseEqual(wrappedAsset.toPlainObject(), assetCollection)
  t.end()
})
