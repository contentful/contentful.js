import test from 'blue-tape'

import * as contentful from '../../lib/contentful'

/* Test data structure:
 * Space 1:
 * - Content:
 * -- Text
 * -- Metadata -- xspace link --> Space 3: Metadata
 *
 * - Article:
 * -- Title
 * -- Content -- local link --> Space 1: Content
 * -- Author -- xspace link --> Space 2: Author
 *******************************************************
 * Space 2:
 * - Author:
 * -- Name
 * -- Picture -- xspace link --> Space 3: Avatar
 * -- Book -- local link --> Space 2: Book
 *
 * - Book:
 * -- Title
 *******************************************************
 * Space 3:
 * - Avatar:
 * -- Image
 * -- Caption
 *
 * - Metadata
 * -- Tags
 * -- Date
*/

const client = contentful.createClient({
  accessToken: '2O_YlI7Spwm16XXw-VZw9vxIIlUOeHLuzWwKXn3KMvo',
  space: 'z788fz497ijs',
  additionalTokens: {
    mbfd18am5xhd: 'tZO0vih_LPefnfNhCDARaRjfiSNXLeJMYRvFe7U-6Yk',
    p9sqh626r1fo: 'CagovFaZwA7Dta0chjKBU2iU4ASND0TLgCgQyep-Xnk'
  }
})

const ENTRY_ID = '46q558fOqAy8ibgYJ1zq5k'

const SPACE_3_AVATAR_KEY = 'avatar'
const SPACE_3_METADATA_KEY = 'metadata'
const SPACE_3_AVATAR = {
  [SPACE_3_AVATAR_KEY]: {
    image: {},
    caption: {}
  }
}
const SPACE_3_METADATA = {
  [SPACE_3_METADATA_KEY]: {
    tags: {},
    date: {}
  }
}
const SPACE_3 = {
  ...SPACE_3_AVATAR,
  ...SPACE_3_METADATA
}

const SPACE_2_BOOK_KEY = 'book'
const SPACE_2_BOOK = {
  [SPACE_2_BOOK_KEY]: {
    title: {}
  }
}

const SPACE_2_AUTHOR_KEY = 'author'
const SPACE_2_AUTHOR = {
  [SPACE_2_AUTHOR_KEY]: {
    name: {},
    picture: SPACE_3[SPACE_3_AVATAR],
    book: SPACE_2_BOOK
  }
}

const SPACE_2 = {
  ...SPACE_2_AUTHOR,
  ...SPACE_2_BOOK
}

const SPACE_1_CONTENT_KEY = 'content'
const SPACE_1_CONTENT = {
  [SPACE_1_CONTENT_KEY]: {
    text: {},
    metadata: SPACE_3[SPACE_3_AVATAR]
  }
}
const SPACE_1_AUTHOR_KEY = 'author'
const SPACE_1_AUTHOR = {
  [SPACE_1_AUTHOR_KEY]: {
    title: {},
    content: SPACE_1_CONTENT,
    author: SPACE_2[SPACE_2_AUTHOR]
  }
}
const SPACE_1 = {
  ...SPACE_1_CONTENT,
  ...SPACE_1_AUTHOR
}

export const xspaceTests = () => {
  test('Resolves link to entry in the same space', async (t) => {
    t.plan(2)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_CONTENT_KEY])
    t.deepEqual(
      Object.keys(entry.fields[SPACE_1_CONTENT_KEY].fields),
      Object.keys(SPACE_1[SPACE_1_CONTENT_KEY])
    )
  })

  test('Resolves xlink to entry in another space', async (t) => {
    t.plan(2)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_AUTHOR_KEY])
    t.deepEqual(
      Object.keys(entry.fields[SPACE_1_AUTHOR_KEY].fields),
      Object.keys(SPACE_2[SPACE_2_AUTHOR_KEY])
    )
  })

  test('Resolves link which contains xlink to another space', async (t) => {
    t.plan(3)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_CONTENT_KEY])
    t.ok(entry.fields[SPACE_1_CONTENT_KEY].fields[SPACE_3_METADATA_KEY])
    t.deepEqual(
      Object.keys(
        entry.fields[SPACE_1_CONTENT_KEY].fields[SPACE_3_METADATA_KEY].fields
      ),
      Object.keys(SPACE_3[SPACE_3_METADATA_KEY])
    )
  })

  test('Resolves xlink which contains local link', async (t) => {
    t.plan(3)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_AUTHOR_KEY])
    t.ok(entry.fields[SPACE_1_AUTHOR_KEY].fields[SPACE_2_BOOK_KEY])
    t.deepEqual(
      Object.keys(
        entry.fields[SPACE_1_AUTHOR_KEY].fields[SPACE_2_BOOK_KEY].fields
      ),
      Object.keys(SPACE_2[SPACE_2_BOOK_KEY])
    )
  })
}
