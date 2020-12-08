import copy from 'fast-copy'
import mixinStringifySafe from '../mixins/stringify-safe'
import resolveResponse from 'contentful-resolve-response'

export function resolveCircular (data, { resolveLinks, removeUnresolved }) {
  const wrappedData = mixinStringifySafe(copy(data))
  if (resolveLinks) {
    wrappedData.items = resolveResponse(wrappedData, { removeUnresolved, itemEntryPoints: ['fields'] })
  }
  return wrappedData
}
