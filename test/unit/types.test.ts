import {
  Entry,
  FieldsQueries,
  EntrySys,
  LocaleSys,
  ContentTypeSys,
  AssetSys,
  SpaceSys,
} from '../../lib'

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
        revision: 1,
        space: {
          sys: {
            linkType: 'Space',
            id: 'mySpace',
            type: 'Link',
          },
        },
        contentType: {
          sys: {
            id: stringValue,
            linkType: 'ContentType',
            type: 'Link',
          },
        },
        environment: {
          sys: {
            type: 'Link',
            linkType: 'Environment',
            id: 'master',
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

describe('Sys', () => {
  test('Entry', () => {
    const sys: EntrySys = {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'f8bqpb154z8p',
        },
      },
      id: '5p9qNpTOJaCE6ykC4a8Wqg',
      type: 'Entry',
      createdAt: '2018-04-27T09:47:08.013Z',
      updatedAt: '2018-08-03T13:48:01.263Z',
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 4,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'lesson',
        },
      },
      locale: 'en-US',
    }

    const sysWithoutLocale: EntrySys = {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'f8bqpb154z8p',
        },
      },
      id: '5p9qNpTOJaCE6ykC4a8Wqg',
      type: 'Entry',
      createdAt: '2018-04-27T09:47:08.013Z',
      updatedAt: '2018-08-03T13:48:01.263Z',
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 4,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'lesson',
        },
      },
    }
    expect(expectMessage)
  })

  test('Locale', () => {
    const sys: LocaleSys = {
      id: '2RDFkX6NV4CB3E32fby13g',
      type: 'Locale',
      version: 2,
    }
    expect(expectMessage)
  })

  test('ContentType', () => {
    const sys: ContentTypeSys = {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'f8bqpb154z8p',
        },
      },
      id: 'lesson',
      type: 'ContentType',
      createdAt: '2018-04-27T09:46:39.296Z',
      updatedAt: '2018-08-03T14:34:34.395Z',
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 9,
    }
    expect(expectMessage)
  })

  test('Asset', () => {
    const sys: AssetSys = {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'f8bqpb154z8p',
        },
      },
      id: '1PzXR2apawY8iYM4o0AUoi',
      type: 'Asset',
      createdAt: '2018-04-27T09:46:58.148Z',
      updatedAt: '2018-05-03T09:18:16.329Z',
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 3,
      locale: 'en-US',
    }
    const sysWithoutLocale: AssetSys = {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'f8bqpb154z8p',
        },
      },
      id: '1PzXR2apawY8iYM4o0AUoi',
      type: 'Asset',
      createdAt: '2018-04-27T09:46:58.148Z',
      updatedAt: '2018-05-03T09:18:16.329Z',
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 3,
    }
    expect(expectMessage)
  })

  test('Space', () => {
    const sys: SpaceSys = {
      type: 'Space',
      id: 'f8bqpb154z8p',
    }
    expect(expectMessage)
  })
})
