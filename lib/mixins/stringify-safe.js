const decycleObject = (object, replacer = (oldPath, value) => ({ $ref: oldPath })) => {
  // Make a deep copy of an object or array, assuring that there is at most
  // one instance of each object or array in the resulting structure. The
  // duplicate references (which might be forming cycles) are replaced with
  // an object of the form

  //      {"$ref": PATH}

  // where the PATH is a JSONPath string that locates the first occurance.

  // So,

  //      var a = [];
  //      a[0] = a;
  //      return JSON.stringify(JSON.decycle(a));

  // produces the string '[{"$ref":"$"}]'.

  // If a replacer function is provided, then it will be called for each value.
  // A replacer function receives a value and returns a replacement value.

  // JSONPath is used to locate the unique object. $ indicates the top level of
  // the object or array. [NUMBER] or [STRING] indicates a child element or
  // property.

  const objects = new WeakMap() // object to path mappings

  return (function derez (value, path) {
    // The derez function recurses through the object, producing the deep copy.

    // typeof null === "object", so go on if this value is really an object but not
    // one of the weird builtin objects.
    if (
      typeof value === 'object' &&
      value !== null &&
      !(value instanceof Boolean) &&
      !(value instanceof Date) &&
      !(value instanceof Number) &&
      !(value instanceof RegExp) &&
      !(value instanceof String)
    ) {
      // If the value is an object or array, look to see if we have already
      // encountered it. If so, return a {"$ref":PATH} object. This uses an
      // ES6 WeakMap.

      const oldPath = objects.get(value) // The path of an earlier occurance of value
      if (oldPath !== undefined) {
        return replacer(oldPath, value)
      }

      // Otherwise, accumulate the unique value and its path.
      objects.set(value, path)

      // If it is an array, replicate the array.
      if (Array.isArray(value)) {
        return value.map((element, i) => derez(element, `${path}[${i}]`))
      }
      // If it is an object, replicate the object.
      return Object.entries(value).reduce(
        (red, [key, val]) =>
          Object.assign({}, red, {
            [key]: derez(val, `${path}[${JSON.stringify(key)}]`)
          }),
        {}
      )
    }
    return value
  })(object, '$')
}

export default function mixinStringifySafe (data) {
  return Object.defineProperty(data, 'stringifySafe', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (serializer = null, indent = '') {
      const decycledObject = decycleObject(this, (oldPath, value) => {
        return {
          sys: {
            type: 'Link',
            linkType: 'Entry',
            id: value.sys.id,
            circular: true
          }
        }
      })
      return JSON.stringify(decycledObject, serializer, indent)
    }
  })
}
