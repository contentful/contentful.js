/* @flow */

import type {Link} from './link'

export type Sys = {
  type: string,
  id: string,
  space: Link,
  createdAt: string,
  updatedAt: string,
  revision: number
}
