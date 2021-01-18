import { FieldsType } from './util'

export type SelectQueries<Fields extends FieldsType, Prefix extends string> = {
  select?: (
    | `${string}.${string}`
    | `${Prefix}.${keyof Fields & string}`
    | `${Prefix}.${keyof Fields & string}.${string}`
  )[]
}
