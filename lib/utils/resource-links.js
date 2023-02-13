function getEntries (data) {
  return (data.items || []).concat((data.includes && data.includes.Entry) || [])
}

function isContentfulEntryResourceLink (field) {
  return field && field.sys && field.sys.type === 'ResourceLink' && field.sys.linkType === 'Contentful:Entry'
}

function getResourceLinkFields (data, locale) {
  let fields = getEntries(data).flatMap(({ fields }) => Object.values(fields))
  if (locale === '*') {
    fields = fields.flatMap((fieldValue) => Object.values(fieldValue))
  }
  fields = fields.flat()
  return fields.filter(isContentfulEntryResourceLink)
}

function parseResourceLink (resourceLink) {
  const urn = resourceLink.sys.urn
  const [, spaceId, , entryId] = urn.split('/')
  return { spaceId, entryId, urn }
}

function groupBy (key, objArray) {
  return objArray.reduce((acc, obj) => {
    const objKey = obj[key]
    acc[objKey] = (acc[objKey] || []).concat(obj)
    return acc
  }, {})
}

async function getEntitiesFromSpace (spaceId, entries, additionalApis, include, locale) {
  const apiInstance = additionalApis[spaceId]
  if (!apiInstance) {
    return []
  }

  const entryIds = entries.map(({ entryId }) => entryId)
  const uniqueEntryIds = [...new Set(entryIds)]
  const data = await apiInstance.getEntries({ 'sys.id[in]': uniqueEntryIds.join(','), include, locale }, { wrapEntryCollection: false }).catch(() => ({}))
  return {
    ...data.includes,
    Entry: getEntries(data)
  }
}

export async function addResourceLinksToIncludes (data, additionalApis = {}, { include = 1, locale }) {
  if (include === 0) {
    return data
  }

  const resourceLinkFields = getResourceLinkFields(data, locale)
  const entitiesBySpace = groupBy('spaceId', resourceLinkFields.map(parseResourceLink))

  const resourceLinkPromises = Object.entries(entitiesBySpace).map(([spaceId, entries]) =>
    getEntitiesFromSpace(spaceId, entries, additionalApis, include - 1, locale)
  )
  const resolvedEntitiesByType = (await Promise.all(resourceLinkPromises))

  const includesObjects = [data.includes || {}, ...resolvedEntitiesByType]
  return {
    ...data,
    includes: includesObjects.reduce((result, entitiesByType) => {
      Object.entries(entitiesByType).forEach(([entityType, entities]) => {
        result[entityType] = (result[entityType] || []).concat(entities)
      })
      return result
    }, {})
  }
}
