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
 *     -- name (localized)
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

test('Resolves xspace link for default locale', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID)

  t.ok(article.fields.author.fields)
  t.equal(article.fields.author.fields.name, 'Greg (en)')
})

test('Resolves xspace link for specified locale', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { locale: 'de' })

  t.ok(article.fields.author.fields)
  t.equal(article.fields.author.fields.name, 'Greg (de)')
})

test('Does not resolve xspace link for include = 0', async (t) => {
  t.plan(1)
  const article = await client.getEntry(ENTRY_ID, { include: 0 })

  t.notOk(article.fields.author.fields)
})

test('Resolves xspace links to two different spaces', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID)

  t.ok(article.fields.author.fields)
  t.ok(article.fields.views.fields)
})

test('Resolves local link and nested xspace link', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { include: 2 })

  t.ok(article.fields.content.fields)
  t.ok(article.fields.content.fields.additionalInfo.fields)
})

test('Resolves xspace link and nested local link', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { include: 2 })

  t.ok(article.fields.author.fields)
  t.ok(article.fields.author.fields.book.fields)
})

test('Resolves xspace link and nested xspace link', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { include: 2 })

  t.ok(article.fields.author.fields)
  t.ok(article.fields.author.fields.picture.fields)
})

// known issue
test.skip('Resolves local link but not nested xspace link for include = 1', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { include: 1 })

  // Article.Content.AdditionalInfo should not resolve, it is deeper than 1
  t.ok(article.fields.content.fields)
  t.notOk(article.fields.content.fields.additionalInfo.fields)
})

test('Resolves xspace link but not nested local link for include = 1', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { include: 1 })

  // Article.Author.Book should not resolve, it is deeper than 1
  t.ok(article.fields.author.fields)
  t.notOk(article.fields.author.fields.book.fields)
})

test('Resolves xspace link but not nested xspace link for include = 1', async (t) => {
  t.plan(2)
  const article = await client.getEntry(ENTRY_ID, { include: 1 })

  // Article.Author.Picture should not resolve, it is deeper than 1
  t.ok(article.fields.author.fields)
  t.notOk(article.fields.author.fields.picture.fields)
})
