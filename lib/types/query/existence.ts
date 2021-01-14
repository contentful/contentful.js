import { BasicEntryField } from '../entry'
import { ConditionalFixedQueries } from './util'

export type ExistenceQueries<Fields, Prefix extends string> =
  ConditionalFixedQueries<Fields, BasicEntryField, boolean, Prefix, '[exists]'>
