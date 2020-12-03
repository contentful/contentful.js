import { assetMock } from '../mocks'
import { wrapAsset, wrapAssetCollection } from '../../../lib/entities/asset'

test('Asset is wrapped', () => {
  const wrappedAsset = wrapAsset(assetMock)
  expect(wrappedAsset.toPlainObject()).toEqual(assetMock)
})

test('Asset collection is wrapped', () => {
  const assetCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      assetMock
    ]
  }
  const wrappedAsset = wrapAssetCollection(assetCollection)
  expect(wrappedAsset.toPlainObject()).toEqual(assetCollection)
})
