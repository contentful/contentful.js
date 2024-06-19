const { join } = require('path')

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory: join(__dirname, 'node_modules', '.puppeteer_cache'),
}
