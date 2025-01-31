import resolveResponse from 'contentful-resolve-response'

import mixinStringifySafe from '../mixins/stringify-safe'

export default function resolveCircular(data: any, { resolveLinks, removeUnresolved }): any {
  const wrappedData = mixinStringifySafe(data)
  if (resolveLinks) {
    wrappedData.items = resolveResponse(wrappedData, {
      removeUnresolved,
      itemEntryPoints: ['fields'],
    })
  }
  return wrappedData
}
