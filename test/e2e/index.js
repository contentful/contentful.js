const { Builder, By, until } = require('selenium-webdriver')

const initServer = require('./server')

const mode = process.env.CONTENTFUL_E2E_MODE || 'browser'

const caps = {
  platform: 'Windows 10',
  browserName: 'firefox',
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  build: process.env.TRAVIS_BUILD_NUMBER,
  tag: 'e2e',
  name: 'Firefox e2e test with .browser.min.js'
}

if (mode === 'legacy') {
  caps.browserName = 'internet explorer'
  caps.version = '11.103'
  caps.name = 'IE 11 e2e test with .legacy.min.js'
}

const driver = new Builder()
  .withCapabilities(caps)
  .usingServer(`http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@ondemand.saucelabs.com/wd/hub`)
  .build()

initServer(async (server) => {
  driver.get('http://localhost:3000')

  const h1 = driver.findElement(By.tagName('h1'))

  driver.wait(until.elementTextIs(h1, 'Success'), 30000)
  await driver.quit()
  server.close()
})
