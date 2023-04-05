const puppeteer = require('puppeteer')
const path = require('path')

let browser, page

jest.setTimeout(10000)

beforeEach(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  await page.goto(`file:${path.join(__dirname, '../public/index.html')}`)
  await page.waitForTimeout(4000)
})

afterAll(async () => {
  await browser.close()
})

test('Entry has been loaded successfully', async () => {
  const text = await page.$eval('#content', (el) => el.innerHTML)
  expect(text).toEqual('nyancat')
})

test('Has correct user agent version', async () => {
  const version = require('../../../../package.json').version
  const clientVersion = await page.$eval('#version', (el) => el.innerHTML)

  // When we make a publish run, we need to ensure that semantic-release has set a valid package version
  if (process.env.PUBLISH_RUN === 'true') {
    expect(clientVersion).toEqual(expect.not.stringContaining('semantic-release'))
    expect(clientVersion).toEqual(version)
  } else {
    expect(clientVersion).toEqual(version)
  }
  console.log(`Client version: ${clientVersion}`)
})
