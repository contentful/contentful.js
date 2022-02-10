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
