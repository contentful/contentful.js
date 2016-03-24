import test from 'tape'

import createRequestConfig from '../../lib/create-request-config'

test('Create request config', t => {
  const config = createRequestConfig({
    resolveLinks: true,
    query: {}
  })

  t.ok(config.params, 'params property exist')
  t.notOk(config.params.resolveLinks, 'resolveLinks property is removed from query')
  t.end()
})
