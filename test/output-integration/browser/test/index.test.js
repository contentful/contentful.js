import { describe, it, expect } from 'vitest'
import { page } from './vitest.setup'
import { version as packageVersion } from '../../../../package.json'

describe('Contentful.js Browser Test', () => {
  it('Entry has been loaded successfully', async () => {
    const text = await page.$eval('#content', (el) => el.innerHTML)
    expect(text).toEqual('nyancat')
  })

  it('Has correct user agent version', async () => {
    const clientVersion = await page.$eval('#version', (el) => el.innerHTML)

    // When we make a publish run, we need to ensure that semantic-release has set a valid package version
    if (process.env.PUBLISH_RUN === 'true') {
      expect(clientVersion).toEqual(expect.not.stringContaining('semantic-release'))
      expect(clientVersion).toEqual(packageVersion)
    } else {
      expect(clientVersion).toEqual(packageVersion)
    }
    console.log(`Client version: ${clientVersion}`)
  })
})
