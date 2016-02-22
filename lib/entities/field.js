import {typeCheck} from '../type-check'
import Link from './link'

/**
 * @namespace EntryFields
 */

/**
 * @memberof EntryFields
 * @typedef Symbol
 * @type string
 */

/**
 * @memberof EntryFields
 * @typedef Text
 * @type string
 */

/**
 * @memberof EntryFields
 * @typedef Integer
 * @type number
 */

/**
 * @memberof EntryFields
 * @typedef Number
 * @type number
 */

/**
 * @memberof EntryFields
 * @typedef Date
 * @type string
 */

/**
 * @memberof EntryFields
 * @typedef Boolean
 * @type boolean
 */

/**
 * @memberof EntryFields
 * @typedef Location
 * @prop {string} lat - latitude
 * @prop {string} lon - longitude
 */
const Location = `{
  lat: String,
  lon: String
}`

/**
 * A Field in an Entry can have one of the following types that can be defined in Contentful. See <a href="https://www.contentful.com/developers/docs/references/field-type/">Field Types</a> for more details.
 * @memberof Entities
 * @typedef Field
 * @type EntryFields.Symbol | EntryFields.Text | EntryFields.Integer | EntryFields.Number | EntryFields.Date | EntryFields.Boolean | EntryFields.Location | Entities.Link | Array<EntryFields.Symbol|Entities.Link> | Object
 */
export default {
  name: 'Field',
  type: {
    typeOf: 'Object',
    validate: obj => {
      for (let key in obj) {
        if (!typeCheck(`
          String | Number | Date | Boolean | ${Location} | ${Link} | [String|${Link}] | Object
        `, obj[key])) {
          return false
        }
      }
      return true
    }
  }
}
