import {map, each, find} from 'lodash/collection'
import {get} from 'lodash/object'
import {partial, memoize} from 'lodash/function'

/**
 * Sets getters on links for a given response
 * @private
 * @param {Array<Entry|Asset|DeletedEntry|DeletedAsset>} items
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 */
export default function mixinLinkGetters (items, includes) {
  each(items, item => setLocalizedFieldGetters(item.fields, includes, !!item.sys.locale))
}

/**
 * If a field does not have a locale defined in sys, the content of that field
 * is an object where the keys are each available locale, and we need to iterate
 * over each of those
 * @private
 * @param {Object} fields - Fields object
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 * @param {boolean} hasLocale - If entry has been requested with a locale
 */
function setLocalizedFieldGetters (fields, includes, hasLocale) {
  if (hasLocale) {
    setFieldGettersForFields(fields, includes)
  } else {
    each(fields, localizedField => setFieldGettersForFields(localizedField, includes))
  }
}

/**
 * Sets getters on each link field or list of link fields for each item
 * @private
 * @param {Object} fields - Fields object
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 */
function setFieldGettersForFields (fields, includes) {
  each(fields, (field, fieldKey) => {
    if (Array.isArray(field)) {
      addGetterForLinkArray(field, fieldKey, fields, includes)
    } else {
      addGetterForLink(field, fieldKey, fields, includes)
    }
  })
}

/**
 * Sets a getter which resolves the link of the given fieldKey in fields
 * @private
 * @param {Object} field - Field object
 * @param {string} fieldKey
 * @param {Object} fields - Fields object
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 */
function addGetterForLink (field, fieldKey, fields, includes) {
  if (get(field, 'sys.type') === 'Link') {
    Object.defineProperty(fields, fieldKey, {
      get: memoize(partial(linkGetter, includes, field))
    })
  }
}

/**
 * Sets a getter which resolves the array of links of the given fieldKey in fields
 * @private
 * @param {Array<Object>} field - List field array
 * @param {string} fieldKey
 * @param {Object} fields - Fields object
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 */
function addGetterForLinkArray (listField, fieldKey, fields, includes) {
  if (get(listField[0], 'sys.type') === 'Link') {
    Object.defineProperty(fields, fieldKey, {
      get: memoize(function () {
        return map(listField, partial(linkGetter, includes))
      })
    })
  }
}

/**
 * Looks for given link field in includes.
 * If linked entity is not found, it returns the original link.
 * @private
 * @param {Object} field - Field object
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 * @return {Object} Field, or link if field not resolved
 */
function linkGetter (includes, field) {
  var link = find(includes[field.sys.linkType], ['sys.id', field.sys.id])
  if (link && link.fields) {
    setLocalizedFieldGetters(link.fields, includes, !!link.sys.locale)
    return link
  }
  return field
}
