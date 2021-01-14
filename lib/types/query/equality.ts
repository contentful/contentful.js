import { BasicEntryField, EntryFields } from '../entry'
import { ConditionalQueries } from './util'

type SupportedTypes = Exclude<BasicEntryField, EntryFields.Location>

export type EqualityQueries<Fields, Prefix extends string> =
  ConditionalQueries<Fields, SupportedTypes, Prefix, ''>

export type InequalityQueries<Fields, Prefix extends string> =
  ConditionalQueries<Fields, SupportedTypes, Prefix, '[ne]'>

