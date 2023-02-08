import test from 'blue-tape'

import * as contentful from '../../lib/contentful'

/* Test data structure:
 * -- Space 1: Article
 *   -- title
 *   -- content -- local link --> Space 1: Content
 *     -- text
 *     -- additionalInfo -- xspace link --> Space 3: Additional Info
 *       -- categories
 *       -- date
 *   -- author -- xspace link --> Space 2: Author
 *     -- name
 *     -- picture -- xspace link --> Space 3: Avatar
 *       -- image
 *       -- caption
 *     -- book -- local link --> Space 2: Book
 *       -- title
 *   -- views -- xspace link --> Space 3: Views
 *     -- count
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
  test('Resolves xspace link', async (t) => {
    t.plan(1)
    const article = await client.getEntry(ENTRY_ID)
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.author.fields)
  })

  test('Does not resolve xspace link for include = 0', async (t) => {
    t.plan(1)
    const article = await client.getEntry(ENTRY_ID, { include: 0 })
    // console.dir(article, { depth: 10 })

    t.notOk(article.fields.author.fields)
  })

  test('Resolves local link and nested xspace link', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 2 })
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.content.fields)
    t.ok(article.fields.content.fields.additionalInfo.fields)
  })

  test('Resolves xspace link and nested local link', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 2 })
    // console.dir(article, { depth: 10 })

    t.ok(article.fields.author.fields)
    t.ok(article.fields.author.fields.book.fields)
  })

  test('Resolves local link but not nested xspace link for include = 1', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 1 })
    // console.dir(article, { depth: 10 })

    // Article.Content.AdditionalInfo should not resolve, it is deeper than 1
    t.ok(article.fields.content.fields)
    t.notOk(article.fields.content.fields.additionalInfo.fields)
  })

  test('Resolves xspace link but not nested local link for include = 1', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 1 })
    // console.dir(article, { depth: 10 })

    // Article.Author.Book should not resolve, it is deeper than 1
    t.ok(article.fields.author.fields)
    t.notOk(article.fields.author.fields.book.fields)
  })

  test('Resolves xspace link when other nested links exist for include = 1', async (t) => {
    t.plan(2)
    const article = await client.getEntry(ENTRY_ID, { include: 1 })
    // console.dir(article, { depth: 10 })

    // Article.Views should resolve, not deeper than 1
    t.ok(article.fields.views.fields)
    t.ok(article.fields.views.fields.views.fields)
  })
}
