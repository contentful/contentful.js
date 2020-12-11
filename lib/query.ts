type GenericFilters = 'ne' | 'exists' | 'in' | 'nin'
type CollectionBasedFilters = 'in' | 'nin'
type NumberFilters = 'lt' | 'lte' | 'gt' | 'gte'
type ArrayFilters = 'all'
type StringFields<Fields> = {
  [FieldName in keyof Fields]: Fields[FieldName] extends string ? Fields[FieldName] : undefined
}
// For most queries we need to always also unwrap any potential arrays
type FieldsEqualityQueries<Fields> = {
  [FieldName in keyof Fields as `fields.${string & FieldName}`]?: Fields[FieldName] extends Array<
    infer T
  >
    ? T
    : Fields[FieldName]
}
type FieldsSpecificQueries<Fields> = {
  [FieldName in keyof Fields as `fields.${string &
    FieldName}[${GenericFilters}]`]?: Fields[FieldName] extends Array<infer T>
    ? T
    : Fields[FieldName]
}
type CollectionSpecificQueries<Fields> = {
  // Ensure that fields that already are arrays don't expect arrays of arrays
  [FieldName in keyof Fields as `fields.${string &
    FieldName}[${CollectionBasedFilters}]`]?: Fields[FieldName] extends Array<any>
    ? Fields[FieldName]
    : Array<Fields[FieldName]>
}
type FixedQueryOptions = {
  skip?: number
  limit?: number
  include?: number
  select?: string | string[]
  locale?: string
  query?: string
}
export type FieldsQueries<Fields> = FieldsEqualityQueries<Fields> &
  (FieldsSpecificQueries<Fields> | CollectionSpecificQueries<Fields>) &
  FixedQueryOptions &
  Record<string, any>

// export function query<Fields>(query: FieldsQueries<Fields>): void {}
