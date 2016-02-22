import {typeCheck as tc} from 'type-check'

/**
 * @private
 * Wraps the module https://www.npmjs.com/package/type-check so that proper
 * output is provided when a type check fails
 * Custom types: https://www.npmjs.com/package/type-check#options
 */
export function typeCheck (type, input, types) {
  const options = {}
  if (types && Array.isArray(types)) {
    options.customTypes = {}
    types.forEach(type => {
      options.customTypes[type.name] = type.type
    })
  }

  if (!tc(type, input, options)) {
    throw new Error(`
Typecheck failed for type:

${type}

with input:

${JSON.stringify(input, null, '  ')}

`)
  }
  return true
}

/**
 * @private
 * Defines a reusable type
 * See https://www.npmjs.com/package/type-check#options for more details
 * @param {string} name - New type name
 * @param {string} baseType - base type for the value to check
 * @param {string} typeDefinition - Type definition for the new type
 * @param {Array} childTypes - Other custom types used in this type definition
 */
export function defType (name, baseType, typeDefinition, childTypes) {
  return {
    name: name,
    type: {
      typeOf: baseType,
      validate: x => typeCheck(typeDefinition, x, childTypes)
    }
  }
}

/**
 * @private
 * Defines a reusable type for an object with properties
 */
export function defObjType (name, typeDefinition, childTypes) {
  return defType(name, 'Object', typeDefinition, childTypes)
}
