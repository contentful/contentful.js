/* @flow */
import {cloneDeep} from 'lodash/lang'

import type {Sys} from '../../lib/entities/sys'
import type {Link} from '../../lib/entities/link'

const linkMock: Link = {
  id: 'linkid',
  type: 'Link',
  linkType: 'linkType'
}

const sysMock: Sys = {
  type: 'Type',
  id: 'id',
  space: cloneDeep(linkMock),
  createdAt: 'createdatdate',
  updatedAt: 'updatedatdate',
  revision: 1
}

export {
  linkMock,
  sysMock
}
