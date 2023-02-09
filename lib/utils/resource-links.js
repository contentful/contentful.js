function isContentfulEntryResourceLink (field) {
  return field && field.sys && field.sys.type === 'ResourceLink' && field.sys.linkType === 'Contentful:Entry'
}

function getResourceLinkFields (data) {
  const items = [].concat(data.items || [], Object.values(data.includes || {}).flat())
  const fields = items.flatMap(({ fields }) => Object.values(fields).flat())
  return fields.filter(isContentfulEntryResourceLink)
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

async function getEntitiesFromSpace (spaceId, entries, extraApis, include) {
  const apiInstance = extraApis[spaceId]
  if (!apiInstance) {
    return []
  }

  const entryIds = entries.map(({ entryId }) => entryId)

  const uniqueEntryIds = [...new Set(entryIds)]
  const response = await apiInstance.getEntries({ 'sys.id[in]': uniqueEntryIds.join(','), include }).catch(() => ({}))
  return response.items || []
}

export async function addResourceLinksToIncludes (data, extraApis = {}, include = 1) {
  if (include === 0) {
    return data
  }

  const resourceLinkFields = getResourceLinkFields(data)
  const entitiesBySpace = groupBy('spaceId', resourceLinkFields.map(parseResourceLink))

  const resourceLinkResponses = Object.entries(entitiesBySpace).map(([spaceId, entries]) =>
    getEntitiesFromSpace(spaceId, entries, extraApis, include - 1)
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
