import test from 'blue-tape'

import * as contentful from '../../lib/contentful'

/* Test data structure:
 * -- Space 1: Article
 *   -- title
 *   -- content -- local link --> Space 1: Content
 *     -- text
 *     -- metadata -- xspace link --> Space 3: Metadata
 *       -- tags
 *       -- date
 *   -- author -- xspace link --> Space 2: Author
 *     -- name
 *     -- picture -- xspace link --> Space 3: Avatar
 *       -- image
 *       -- caption
 *     -- book -- local link --> Space 2: Book
 *       -- title
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

export const xspaceTests = () => {
  test('Resolves local link', async (t) => {
    t.plan(1)
    const article = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.content.fields)
  })

  test('Resolves xspace link', async (t) => {
    t.plan(1)
    const article = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.author.fields)
  })

  test('Resolves local link and nested xspace link', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.content.fields)
    t.ok(article.fields.content.fields.metadata.fields)
  })

  test('Resolves xlink and nested xspace link', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 10 })
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.author.fields)
    t.ok(article.fields.author.fields.book.fields)
  })

  test('Does not resolve links at depth 2 for include = 1', async (t) => {
    t.plan(3)
    const article = await client.getEntry(ENTRY_ID, { include: 1 })
    console.dir(article, { depth: 10 })

    // Article.Content.Metadata should not resolve, it is deeper than 1
    t.ok(article.fields.content.fields)
    t.notOk(article.fields.content.fields.metadata.fields)
    t.equal(article.fields.content.fields.metadata.sys.type, 'ResourceLink')
  })

  test('Resolves links at depth 1 for include = 1', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 1 })
    console.dir(article, { depth: 10 })

    // Article.Author should resolve, it is not deeper than 1
    t.ok(article.fields.author.fields)
    t.equal(article.fields.author.sys.type, 'Entry')
  })
}
