const localeMock = require('../mocks').localeMock
const locale = require('../../../lib/entities/locale')

test('Locale is wrapped', () => {
  const wrappedLocale = locale.wrapLocale(localeMock)
  expect(wrappedLocale.toPlainObject()).toEqual(localeMock)
})

test('Locale collection is wrapped', () => {
  const assetCollection = {
    total: 1,
    skip: 0,
    limit: 100,
    items: [
      localeMock
    ]
  }
  const wrappedLocale = locale.wrapLocaleCollection(assetCollection)
  expect(wrappedLocale.toPlainObject()).toEqual(assetCollection)
})
