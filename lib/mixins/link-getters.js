import memoize from 'lodash/memoize'

/**
 * Sets getters on links for a given response
 * @private
 * @param {Array<Entry|Asset|DeletedEntry|DeletedAsset>} items
 * @param {Object} includes - Object with lists of Entry, Asset, DeletedEntry and DeletedAsset
 */
export default function mixinLinkGetters (items, includes) {
  const linkGetter = memoize(getLinksFromIncludes, memoizationResolver)
  items.forEach((item) => {
    if (item.fields) {
      setLocalizedFieldGetters(item.fields, !!item.sys.locale)
    }
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
      const fieldKeys = Object.keys(fields)
      fieldKeys.forEach((fieldKey) => setFieldGettersForFields(fields[fieldKey]))
    }
  }

  /**
   * Sets getters on each link field or list of link fields for each item
   * @private
   * @param {Object} fields - Fields object
   */
  function setFieldGettersForFields (fields) {
    const fieldKeys = Object.keys(fields)
    fieldKeys.forEach((fieldKey) => {
      const field = fields[fieldKey]
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
    if (field !== null && typeof field === 'object' && field.hasOwnProperty('sys') && field.sys.hasOwnProperty('type') && field.sys.type === 'Link') {
      Object.defineProperty(fields, fieldKey, {
        get: () => linkGetter(field)
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
    if (listField.length && listField[0] !== null && typeof listField[0] === 'object' && listField[0].hasOwnProperty('sys') && listField[0].sys.hasOwnProperty('type') && listField[0].sys.type === 'Link') {
      Object.defineProperty(fields, fieldKey, {
        get: () => listField.map((field) => linkGetter(field))
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
    const linkedEntities = includes[field.sys.linkType] || []
    const link = linkedEntities.find((linkedEntity) => linkedEntity.sys.id === field.sys.id)
    if (link && link.fields) {
      setLocalizedFieldGetters(link.fields, !!link.sys.locale)
      return link
    }
    return field
  }

  function memoizationResolver (link) {
    return link.sys.id
  }
}
