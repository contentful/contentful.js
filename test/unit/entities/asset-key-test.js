import test from 'blue-tape'
import { assetKeyMock } from '../mocks'
import { wrapAssetKey } from '../../../lib/entities/asset-key'

test('AssetKey is wrapped', (t) => {
  const wrappedAsset = wrapAssetKey(assetKeyMock)
  t.looseEqual(wrappedAsset.toPlainObject(), assetKeyMock)
  t.end()
})
