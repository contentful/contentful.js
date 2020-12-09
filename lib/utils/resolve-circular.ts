import mixinStringifySafe from '../mixins/stringify-safe'
import resolveResponse from 'contentful-resolve-response'

export default function resolveCircular <T> (data, { resolveLinks, removeUnresolved }) {
  const wrappedData = mixinStringifySafe(data)
  if (resolveLinks) {
    wrappedData.items = resolveResponse(wrappedData, { removeUnresolved, itemEntryPoints: ['fields'] })
  }
  return wrappedData
}
