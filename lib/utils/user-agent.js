import platform from 'platform'
import version from '../../version'

export function getUserAgentHeader (params) {
  const headerParts = []

  headerParts.push(params.application ? `app ${params.application}` : '')
  headerParts.push(params.integration ? `integration ${params.integration}` : '')
  headerParts.push(`sdk contentful.js/${version}`)
  headerParts.push(`platform ${platform.name}/${platform.version}`)
  headerParts.push(`os ${platform.os.family}/${platform.os.version || '0.0.0'}`)
  return headerParts.filter((item) => item !== '').join('; ')
}
