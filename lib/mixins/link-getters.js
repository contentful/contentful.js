/* @flow */
import type {Entry, IncludesCollection} from '../entities/entry'
import {cloneDeep} from 'lodash/lang'
import {map, each, find} from 'lodash/collection'
import {get} from 'lodash/object'
import {partial, memoize} from 'lodash/function'

type ResponseData = {
  items: Array<Entry>,
  includes?: IncludesCollection
}

/**
 * @private
 * Sets getters on links for a given response
 */
export default function mixinLinkGetters (data: ResponseData): ResponseData {
  const items = cloneDeep(data.items)
  const includes = cloneDeep(data.includes)

  each(items, (item, itemKey) => {
    setFieldGetters(item, data.items[itemKey].fields, includes)
  })

  return data
}

/**
 * @private
 * Sets getters on each link field or list of link fields for each item
 */
function setFieldGetters (item: Entry, fields: Object, includes: IncludesCollection) {
  each(item.fields, (field, fieldKey) => {
    if (Array.isArray(field)) {
      addGetterForLinkArray(field, fieldKey, fields, includes)
    } else {
      addGetterForLink(field, fieldKey, fields, includes)
    }
  })
}

/**
 * @private
 * Sets a getter which resolves the link of the given fieldKey in fields
 */
function addGetterForLink (field: Object, fieldKey: string, fields: Object, includes: IncludesCollection) {
  if (get(field, 'sys.type') === 'Link') {
    Object.defineProperty(fields, fieldKey, {
      get: memoize(partial(linkGetter, includes, field))
    })
  }
}

/**
 * @private
 * Sets a getter which resolves the array of links of the given fieldKey in fields
 */
function addGetterForLinkArray (listField: Array<Object>, fieldKey: string, fields: Object, includes: IncludesCollection) {
  if (get(listField[0], 'sys.type') === 'Link') {
    Object.defineProperty(fields, fieldKey, {
      get: memoize(function () {
        return map(listField, partial(linkGetter, includes))
      })
    })
  }
}

/**
 * @private
 * Looks for given link field in includes.
 * If linked entity is not found, it returns the original link.
 */
function linkGetter (includes: IncludesCollection, field: Object) {
  var link = find(includes[field.sys.linkType], ['sys.id', field.sys.id])
  if (link && link.fields) {
    setFieldGetters(link, link.fields, includes)
    return link
  }
  return field
}
