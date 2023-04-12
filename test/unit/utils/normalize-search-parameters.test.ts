import normalizeSearchParameters from '../../../lib/utils/normalize-search-parameters'

describe('normalizeSearchParameters', () => {
  test('normalizeSearchParameters does nothing if all values are string values', () => {
    const query = {
      'fields.stringParameter[in]': 'string1,string2',
      'fields.locationParameter[within]': '0,1,2,3',
    }
    const normalized = normalizeSearchParameters(query)
    expect(normalized).toBe(query)
  })

  test('normalizeSelect converts array values into string values', () => {
    const query = {
      'fields.stringParameter[in]': ['string1', 'string2'],
      'fields.locationParameter[within]': [0, 1, 2, 3],
    }
    const normalized = normalizeSearchParameters(query)
    expect(normalized).toEqual({
      'fields.stringParameter[in]': 'string1,string2',
      'fields.locationParameter[within]': '0,1,2,3',
    })
  })
})
