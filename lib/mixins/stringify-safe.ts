import * as jsonStringifySafe from 'json-stringify-safe'

export default function mixinStringifySafe<T>(data: T): T & { stringifySafe: (replacer: any, space: any) => string } {
  return Object.defineProperty(data, 'stringifySafe', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (serializer = null, indent = '') {
      return jsonStringifySafe(this, serializer, indent, (key, value) => {
        return {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: value.sys.id,
            circular: true
          }
        }
      })
    }
  })
}
