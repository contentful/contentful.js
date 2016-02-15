/* @flow */
import type {Entry, DeletedEntry} from '../entities/entry'
import type {Asset, DeletedAsset} from '../entities/asset'
import type {IncludesCollection, ResponseItems} from '../responses'
import {map, each, find} from 'lodash/collection'
import {get} from 'lodash/object'
import {partial, memoize} from 'lodash/function'

type ResponseIncludesCollection = {
  Entry?: Array<Entry>,
  Asset?: Array<Asset>,
  DeletedEntry?: Array<DeletedEntry>,
  DeletedAsset?: Array<DeletedAsset>
}

/**
 * @private
 * Sets getters on links for a given response
 */
export default function mixinLinkGetters (items: ResponseItems, includes: ResponseIncludesCollection) {
  each(items, item => setLocalizedFieldGetters(item.fields, includes, !!item.sys.locale))
}

/**
 * @private
 * If a field does not have a locale defined in sys, the content of that field
 * is an object where the keys are each available locale, and we need to iterate
 * over each of those
 */
function setLocalizedFieldGetters (fields: Object, includes: IncludesCollection, hasLocale: boolean) {
  if (hasLocale) {
    setFieldGettersForFields(fields, includes)
  } else {
    each(fields, localizedField => setFieldGettersForFields(localizedField, includes))
  }
}

/**
 * @private
 * Sets getters on each link field or list of link fields for each item
 */
function setFieldGettersForFields (fields: Object, includes: IncludesCollection) {
  each(fields, (field, fieldKey) => {
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
    setLocalizedFieldGetters(link.fields, includes, !!link.sys.locale)
    return link
  }
  return field
}
