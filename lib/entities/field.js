import {typeCheck} from '../type-check'
import Link from './link'

const Location = `{
  lat: String,
  lon: String
}`

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
