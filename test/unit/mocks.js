/* @flow */
import {assign} from 'lodash/object'
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

const entryMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Entry',
    contentType: assign(cloneDeep(linkMock), {linkType: 'ContentType'}),
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

const assetMock = {
  sys: assign(cloneDeep(sysMock), {
    type: 'Asset',
    locale: 'locale'
  }),
  fields: {
    field1: 'str'
  }
}

export {
  linkMock,
  sysMock,
  entryMock,
  assetMock
}
