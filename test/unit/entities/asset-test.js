/* @flow */
import test from 'tape'
import {assign} from 'lodash/object'
import {cloneDeep} from 'lodash/lang'
import {sysMock} from '../mocks'

import {wrapAsset, wrapAssetCollection} from '../../../lib/entities/asset'

const asset = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Asset',
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

test('Asset is wrapped', t => {
  const wrappedAsset = wrapAsset(asset)
  t.looseEqual(wrappedAsset.toPlainObject(), asset)
  t.end()
})

test('Asset collection is wrapped', t => {
  const assetCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      asset
    ]
  }
  const wrappedAsset = wrapAssetCollection(assetCollection)
  t.looseEqual(wrappedAsset.toPlainObject(), assetCollection)
  t.end()
})
