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
