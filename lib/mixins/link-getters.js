import map from 'lodash/map'
import each from 'lodash/each'
import find from 'lodash/find'
import get from 'lodash/get'
import partial from 'lodash/partial'
import memoize from 'lodash/memoize'

let resolveAllLocales = false
/**
 * Sets getters on links for a given response
 * @private
 * @param {Array<Entry|Asset|DeletedEntry|DeletedAsset>} items
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 */
export default function mixinLinkGetters (items, includes, resolveForAllLocales) {
  resolveAllLocales = resolveForAllLocales
  const linkGetter = memoize(getLinksFromIncludes, memoizationResolver)
  each(items, (item) => {
    // TODO: workaround the preview endpoint extra locale this should be removed when
    // it is fixed on the backend
    if (resolveForAllLocales && item.sys.locale) {
      delete item.sys.locale
    }
    setLocalizedFieldGetters(item.fields, !!item.sys.locale)
  })

  /**
   * If a field does not have a locale defined in sys, the content of that field
   * is an object where the keys are each available locale, and we need to iterate
   * over each of those
   * @private
   * @param {Object} fields - Fields object
   * @param {boolean} hasLocale - If entry has been requested with a locale
   */
  function setLocalizedFieldGetters (fields, hasLocale) {
    if (hasLocale) {
      setFieldGettersForFields(fields)
    } else {
      each(fields, (localizedField) => setFieldGettersForFields(localizedField))
    }
  }

  /**
   * Sets getters on each link field or list of link fields for each item
   * @private
   * @param {Object} fields - Fields object
   */
  function setFieldGettersForFields (fields) {
    each(fields, (field, fieldKey) => {
      if (Array.isArray(field)) {
        addGetterForLinkArray(field, fieldKey, fields)
      } else {
        addGetterForLink(field, fieldKey, fields)
      }
    })
  }

  /**
   * Sets a getter which resolves the link of the given fieldKey in fields
   * @private
   * @param {Object} field - Field object
   * @param {string} fieldKey
   * @param {Object} fields - Fields object
   */
  function addGetterForLink (field, fieldKey, fields) {
    if (get(field, 'sys.type') === 'Link') {
      Object.defineProperty(fields, fieldKey, {
        get: partial(linkGetter, field)
      })
    }
  }

  /**
   * Sets a getter which resolves the array of links of the given fieldKey in fields
   * @private
   * @param {Array<Object>} field - List field array
   * @param {string} fieldKey
   * @param {Object} fields - Fields object
   */
  function addGetterForLinkArray (listField, fieldKey, fields) {
    if (get(listField[0], 'sys.type') === 'Link') {
      Object.defineProperty(fields, fieldKey, {
        get: function () {
          return map(listField, partial(linkGetter))
        }
      })
    }
  }

  /**
   * Looks for given link field in includes.
   * If linked entity is not found, it returns the original link.
   * This method shouldn't be used directly, and it's memoized whenever this
   * module's main method is used.
   * This is done to prevent the same link being resolved multiple times.
   * @private
   * @param {Object} field - Field object
   * @return {Object} Field, or link if field not resolved
   */
  function getLinksFromIncludes (field) {
    var link = find(includes[field.sys.linkType], ['sys.id', field.sys.id])
    if (link && link.fields) {
      // TODO: workaround the preview endpoint extra locale this should be removed when
      // it is fixed on the backend
      if (resolveAllLocales && link.sys.locale) {
        delete link.sys.locale
      }
      setLocalizedFieldGetters(link.fields, !!link.sys.locale)
      return link
    }
    return field
  }

  function memoizationResolver (link) {
    return link.sys.id
  }
}
