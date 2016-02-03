import test from 'tape'
import sinon from 'sinon'

import createHttpClient from '../lib/create-http-client'

const axiosCreateStub = sinon.stub()

test('Calls axios with expected URL', t => {
  createHttpClient.__Rewire__('axios', {
    create: axiosCreateStub
  })

  createHttpClient({
    accessToken: 'clientAccessToken',
    space: 'clientSpaceId'
  })

  t.equals(axiosCreateStub.args[0][0].baseURL, 'https://cdn.contentful.com:443/spaces/clientSpaceId/')

  createHttpClient.__ResetDependency__('axios')
  t.end()
})
