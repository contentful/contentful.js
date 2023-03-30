import validateSearchParameters from '../../../lib/utils/validate-search-parameters'

describe('validateSearchParameters', () => {
  test('does nothing if no values are objects', () => {
    const query = {
      booleanValue: true,
      stringValue: 'string',
      numberValue: 3,
      nullValue: null,
      undefinedValue: undefined,
      arrayValue: ['string'],
    }

    validateSearchParameters(query)
  })

  test('throws if a value is an object', () => {
    const query = {
      booleanValue: true,
      stringValue: 'string',
      objectValue: {},
    }
    const expectedErrorMessage =
      'Objects are not supported as value for the "objectValue" query parameter'

    expect(() => validateSearchParameters(query)).toThrow(expectedErrorMessage)
  })

  test('adds the affected parameter to the error', () => {
    const query = {
      affectedParameter: { key: 'value' },
    }
    const expectedErrorMessage =
      'Objects are not supported as value for the "affectedParameter" query parameter'

    expect(() => validateSearchParameters(query)).toThrow(expectedErrorMessage)
  })
})
