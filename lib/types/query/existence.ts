import { ConditionalPick } from "type-fest"
import { BasicEntryField } from "../entry"

type SupportedTypes = BasicEntryField

export type ExistenceQueries<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}[exists]`]?: boolean
}
