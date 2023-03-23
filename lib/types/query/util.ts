import { ConditionalPick } from 'type-fest'

export type FieldsType = Record<string, any>

export type EntrySkeletonType<Fields extends FieldsType = FieldsType, Id = string> = {
  fields: Fields
  contentTypeId: Id
}

export type EntrySkeletonFromId<
  EntrySkeletons extends EntrySkeletonType,
  ContentTypeId extends string
> = Extract<EntrySkeletons & { contentTypeId: ContentTypeId }, EntrySkeletons>

export type BaseOrArrayType<T> = T extends Array<infer U> ? U : T

export type NonEmpty<T> = T extends Record<string, never> ? never : T

export type ConditionalFixedQueries<
  Fields extends FieldsType,
  SupportedTypes,
  ValueType,
  Prefix extends string,
  QueryFilter extends string = ''
> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}${QueryFilter}`]?: ValueType
}

export type ConditionalListQueries<
  Fields,
  SupportedTypes,
  Prefix extends string,
  QueryFilter extends string = ''
> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}${QueryFilter}`]?: NonNullable<BaseOrArrayType<Fields[FieldName]>>[]
}

export type ConditionalQueries<
  Fields,
  SupportedTypes,
  Prefix extends string,
  QueryFilter extends string = ''
> = {
  [FieldName in keyof ConditionalPick<Fields, SupportedTypes> as `${Prefix}.${string &
    FieldName}${QueryFilter}`]?: Fields[FieldName] extends Array<infer T> ? T : Fields[FieldName]
}
