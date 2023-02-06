import test from 'blue-tape'

import * as contentful from '../../lib/contentful'

const client = contentful.createClient({
  space: '6fqijljzyr0e',
  accessTokenBySpaceId: {
    '6fqijljzyr0e': 'G-0LUfT0RqNaX5h2BVeUYeuZvmtQWj_bdGBOpz718ac',
    kdtd0watvk6m: '6Jt8W1k1aNKM-Xw4P8AESXcO3iiA2buzfGzl9bfHDyI'
  },
  resolveResourceLinks: true
})

const LOCAL_FIELD_NAME = 'xspaceBlogContent'
const LOCAL_FIELD_RESOLVED_FIELD_NAMES = ['title', 'xspaceBlogContent']
const EXTERNAL_FIELD_NAME = 'xspaceBlogPostAuthor'
const EXTERNAL_FIELD_RESOLVED_FIELD_NAMES = ['title', 'xspaceAuthorName']
const EXTERNAL_FIELD_RESOLVED_LOCAL_FIELD_NAMES = ['title', 'xspaceAvatarImage']

export const xspaceTests = () => {
  test('Resolves link to local entry', async (t) => {
    t.plan(2)
    const entry = await client.getEntry('2jyJVSX0aJro9hvg2tQLXQ')
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[LOCAL_FIELD_NAME])
    t.deepEqual(
      Object.keys(entry.fields[LOCAL_FIELD_NAME].fields),
      LOCAL_FIELD_RESOLVED_FIELD_NAMES
    )
  })

  test('Resolves link to external entry', async (t) => {
    t.plan(2)
    const entry = await client.getEntry('2jyJVSX0aJro9hvg2tQLXQ')
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[EXTERNAL_FIELD_NAME])
    t.deepEqual(
      Object.keys(entry.fields[EXTERNAL_FIELD_NAME].fields),
      EXTERNAL_FIELD_RESOLVED_FIELD_NAMES
    )
  })

  test('Resolves local link from an external entry', async (t) => {
    t.plan(2)
    const entry = await client.getEntry('2jyJVSX0aJro9hvg2tQLXQ')
    // console.dir(entry, { depth: 10 })

    t.ok(
      entry.fields[EXTERNAL_FIELD_NAME].fields[
        EXTERNAL_FIELD_RESOLVED_FIELD_NAMES[1]
      ]
    )
    t.deepEqual(
      Object.keys(
        entry.fields[EXTERNAL_FIELD_NAME].fields[EXTERNAL_FIELD_RESOLVED_FIELD_NAMES[1]].fields
      ),
      EXTERNAL_FIELD_RESOLVED_LOCAL_FIELD_NAMES
    )
  })
}
