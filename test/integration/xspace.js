import test from 'blue-tape'

import * as contentful from '../../lib/contentful'
import {
  XSPACE_TESTS_ACCESS_TOKEN,
  XSPACE_TESTS_ADDITIONAL_TOKENS
} from './auth'

const client = contentful.createClient({
  accessToken: XSPACE_TESTS_ACCESS_TOKEN,
  space: 'z788fz497ijs',
  additionalTokens: XSPACE_TESTS_ADDITIONAL_TOKENS
})

const ENTRY_ID = '46q558fOqAy8ibgYJ1zq5k'

const SPACE_3_FIELD_1_KEY = 'avatar'
const SPACE_3_FIELD_2_KEY = 'metadata'
const SPACE_3_FIELD_1 = {
  [SPACE_3_FIELD_1_KEY]: {
    image: {},
    caption: {}
  }
}
const SPACE_3_FIELD_2 = {
  [SPACE_3_FIELD_2_KEY]: {
    tags: {},
    date: {}
  }
}
const SPACE_3 = {
  ...SPACE_3_FIELD_1,
  ...SPACE_3_FIELD_2
}

const SPACE_2_FIELD_2_KEY = 'book'
const SPACE_2_FIELD_2 = {
  [SPACE_2_FIELD_2_KEY]: {
    title: {}
  }
}

const SPACE_2_FIELD_1_KEY = 'author'
const SPACE_2_FIELD_1 = {
  [SPACE_2_FIELD_1_KEY]: {
    name: {},
    picture: SPACE_3[SPACE_3_FIELD_1],
    book: SPACE_2_FIELD_2
  }
}

const SPACE_2 = {
  ...SPACE_2_FIELD_1,
  ...SPACE_2_FIELD_2
}

const SPACE_1_FIELD_1_KEY = 'content'
const SPACE_1_FIELD_1 = {
  [SPACE_1_FIELD_1_KEY]: {
    text: {},
    metadata: SPACE_3[SPACE_3_FIELD_1]
  }
}
const SPACE_1_FIELD_2_KEY = 'author'
const SPACE_1_FIELD_2 = {
  [SPACE_1_FIELD_2_KEY]: {
    title: {},
    content: SPACE_1_FIELD_1,
    author: SPACE_2[SPACE_2_FIELD_1]
  }
}
const SPACE_1 = {
  ...SPACE_1_FIELD_1,
  ...SPACE_1_FIELD_2
}

export const xspaceTests = () => {
  test('Resolves link to entry in the same space', async (t) => {
    t.plan(2)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_FIELD_1_KEY])
    t.deepEqual(
      Object.keys(entry.fields[SPACE_1_FIELD_1_KEY].fields),
      Object.keys(SPACE_1[SPACE_1_FIELD_1_KEY])
    )
  })

  test('Resolves xlink to entry in another space', async (t) => {
    t.plan(2)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_FIELD_2_KEY])
    t.deepEqual(
      Object.keys(entry.fields[SPACE_1_FIELD_2_KEY].fields),
      Object.keys(SPACE_2[SPACE_2_FIELD_1_KEY])
    )
  })

  test('Resolves link which contains xlink to another space', async (t) => {
    t.plan(3)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_FIELD_1_KEY])
    t.ok(entry.fields[SPACE_1_FIELD_1_KEY].fields[SPACE_3_FIELD_2_KEY])
    t.deepEqual(
      Object.keys(
        entry.fields[SPACE_1_FIELD_1_KEY].fields[SPACE_3_FIELD_2_KEY].fields
      ),
      Object.keys(SPACE_3[SPACE_3_FIELD_2_KEY])
    )
  })

  test('Resolves xlink which contains local link', async (t) => {
    t.plan(3)
    const entry = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(entry, { depth: 10 })

    t.ok(entry.fields[SPACE_1_FIELD_2_KEY])
    t.ok(entry.fields[SPACE_1_FIELD_2_KEY].fields[SPACE_2_FIELD_2_KEY])
    t.deepEqual(
      Object.keys(
        entry.fields[SPACE_1_FIELD_2_KEY].fields[SPACE_2_FIELD_2_KEY].fields
      ),
      Object.keys(SPACE_2[SPACE_2_FIELD_2_KEY])
    )
  })
}
