import { ConditionalPick } from "type-fest"
import { BasicEntryField, EntryFields } from "../entry"

type SupportedTypes = Exclude<BasicEntryField, EntryFields.Location>

export type EqualityQueries<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}`]?: Fields[FieldName] extends Array<infer T>
    ? T
    : Fields[FieldName]
}

export type InequalityQueries<Fields, Prefix extends string> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string & FieldName}[ne]`]?: Fields[FieldName] extends Array<infer T>
    ? T
    : Fields[FieldName]
}
