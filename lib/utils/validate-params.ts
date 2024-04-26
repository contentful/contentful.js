import { ValidationError } from './validation-error'

function checkLocaleParamIsAll(query) {
  if (query.locale === '*') {
    throw new ValidationError(
      'locale',
      `The use of locale='*' is no longer supported.To fetch an entry in all existing locales,
      use client.withAllLocales instead of the locale='*' parameter.`,
    )
  }
}

function checkLocaleParamExists(query) {
  if (query.locale) {
    throw new ValidationError('locale', 'The `locale` parameter is not allowed')
  }
}

export function validateLocaleParam(query, isWithAllLocalesClient: boolean) {
  if (isWithAllLocalesClient) {
    checkLocaleParamExists(query)
  } else {
    checkLocaleParamIsAll(query)
  }
  return
}

export function validateResolveLinksParam(query) {
  if ('resolveLinks' in query) {
    throw new ValidationError(
      'resolveLinks',
      `The use of the 'resolveLinks' parameter is no longer supported. By default, links are resolved.
      If you do not want to resolve links, use client.withoutLinkResolution.`,
    )
  }
  return
}

export function validateRemoveUnresolvedParam(query) {
  if ('removeUnresolved' in query) {
    throw new ValidationError(
      'removeUnresolved',
      `The use of the 'removeUnresolved' parameter is no longer supported. By default, unresolved links are kept as link objects.
      If you do not want to include unresolved links, use client.withoutUnresolvableLinks.`,
    )
  }
  return
}

export function checkIncludeContentSourceMapsParamIsValid(alphaFeatures?: Record<string, any>) {
  if (!alphaFeatures) {
    return false
  }

  const isValidWithContentSourceMaps =
    'withContentSourceMaps' in alphaFeatures &&
    typeof alphaFeatures.withContentSourceMaps === 'boolean'

  if (!isValidWithContentSourceMaps) {
    throw new ValidationError(
      'withContentSourceMaps',
      `The 'withContentSourceMaps' parameter must be a boolean.`,
    )
  }

  return true
}

export function checkIncludeContentSourceMapsParamIsAllowed(
  host: string,
  alphaFeatures?: Record<string, any>,
) {
  if (!alphaFeatures || Object.keys(alphaFeatures).length === 0) {
    return false
  }

  const withContentSourceMapsIsAllowed = host === 'preview.contentful.com'

  if (checkIncludeContentSourceMapsParamIsValid(alphaFeatures) && !withContentSourceMapsIsAllowed) {
    throw new ValidationError(
      'withContentSourceMaps',
      `The 'withContentSourceMaps' parameter can only be used with the CPA. Please set host to 'preview.contentful.com' to include Content Source Maps.
      `,
    )
  }

  return true
}
