import test from 'blue-tape'
import {localeMock} from '../mocks'
import {wrapLocale, wrapLocaleCollection} from '../../../lib/entities/locale'

test('Locale is wrapped', (t) => {
  const wrappedLocale = wrapLocale(localeMock)
  t.looseEqual(wrappedLocale.toPlainObject(), localeMock)
  t.end()
})

test('Locale collection is wrapped', (t) => {
  const assetCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      localeMock
    ]
  }
  const wrappedLocale = wrapLocaleCollection(assetCollection)
  t.looseEqual(wrappedLocale.toPlainObject(), assetCollection)
  t.end()
})
