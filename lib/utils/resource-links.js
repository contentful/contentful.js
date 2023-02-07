function isResourceLink (field) {
  return field && field.sys && field.sys.type === 'ResourceLink'
}

function getResourceLinkFields (data) {
  const items = [].concat(...(data.items || []), ...Object.values(data.includes || {}).flat())
  const fields = items.flatMap(({ fields }) => Object.values(fields).flat())
  return fields.filter(isResourceLink)
}

function parseResourceLink (resourceLink) {
  const urn = resourceLink.sys.urn
  // For now just assume every resourceLink has type Contentful:Entry
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

function getEntitiesFromSpaceFn (extraApis = {}, depth) {
  return async (spaceId, entryIds) => {
    if (!entryIds.length) {
      return []
    }
    const apiInstance = extraApis[spaceId]
    if (!apiInstance) {
      return []
    }

    let response = { items: [] }
    if (depth.currentDepth < depth.maxDepth) {
      const uniqueEntryIds = [...new Set(entryIds)]
      depth.currentDepth++
      response = await apiInstance.getEntries({ 'sys.id[in]': uniqueEntryIds.join(',') }, depth).catch(() => ({}))
    }
    return response.items || []
  }
}

export async function addResourceLinksToIncludes (data, extraApis = {}, depth) {
  const getEntitiesFromSpace = getEntitiesFromSpaceFn(extraApis, depth)

  const resourceLinkFields = getResourceLinkFields(data)
  const entitiesBySpace = groupBy('spaceId', resourceLinkFields.map(parseResourceLink))

  const resourceLinkResponses = Object.entries(entitiesBySpace).map(([spaceId, entries]) =>
    getEntitiesFromSpace(spaceId, entries.map(({ entryId }) => entryId))
  )
  const resourceLinkEntries = (await Promise.all(resourceLinkResponses)).flat()

  return {
    ...data,
    includes: {
      ...data.includes,
      Entry: [...((data.includes && data.includes.Entry) || []), ...resourceLinkEntries]
    }
  }
}
