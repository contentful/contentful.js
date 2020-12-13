import { Entry, FieldsQueries } from '../../lib'

const stringValue = ''
const numberValue = 123
const expectMessage = 'no parser error'

describe('Entry', () => {
  test('define with simple generic', () => {
    const entry: Entry<{ name: string }> = {
      sys: {
        id: stringValue,
        locale: stringValue,
        type: stringValue,
        createdAt: stringValue,
        updatedAt: stringValue,
        contentType: {
          sys: {
            id: stringValue,
            linkType: 'ContentType',
            type: 'Link',
          },
        },
      },
      fields: {
        name: stringValue,
      },
    }
    expect(expectMessage)
  })
})

describe('FieldsQueries', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function query<Fields>(query: FieldsQueries<Fields>): void {}

  type Fields = {
    stringField: string
    numberField: number
  }

  test('requires nothing', () => {
    query<Fields>({})
    expect(expectMessage)
  })

  test('has default optional fields', () => {
    query<Fields>({
      limit: numberValue,
      skip: numberValue,
      include: numberValue,
      locale: stringValue,
      query: stringValue,
      select: stringValue,
    })
    expect(expectMessage)
  })

  test('has number field selector', () => {
    query<Fields>({
      'fields.numberField': numberValue,
    })
    query<Fields>({
      'fields.numberField[ne]': numberValue,
    })
    query<Fields>({
      'fields.numberField[ne]': [numberValue, numberValue],
    })
    query<Fields>({
      'fields.numberField[in]': numberValue,
    })
    query<Fields>({
      'fields.numberField[in]': [numberValue, numberValue],
    })
    query<Fields>({
      'fields.numberField[exists]': numberValue,
    })
    query<Fields>({
      'fields.numberField[nin]': numberValue,
    })
    expect(expectMessage)
  })

  test('has string field selector', () => {
    query<Fields>({
      'fields.stringField': stringValue,
    })
    query<Fields>({
      'fields.stringField[exists]': stringValue,
    })
    query<Fields>({
      'fields.stringField[nin]': stringValue,
    })
    query<Fields>({
      'fields.stringField[in]': stringValue,
    })
    query<Fields>({
      'fields.stringField[ne]': stringValue,
    })
    expect(expectMessage)
  })
})
