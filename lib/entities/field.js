/* @flow */
import type {Link} from './link'

type Symbol = string
type Text = string
type Integer = number
type Number = number
type Date = string
type Boolean = boolean
type Location = {
  lat: string,
  lon: string
}

export type Field = Symbol | Text | Integer | Number | Date | Boolean | Location | Link | Array<Symbol|Link> | Object
