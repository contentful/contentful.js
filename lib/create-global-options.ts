/**
 * @category Client
 */
export interface GlobalOptionsParams {
  environment?: string
  space?: string
  spaceBaseUrl?: string
  environmentBaseUrl?: string
}

/**
 * @category Client
 */
export type GetGlobalOptions = (
  globalOptions?: GlobalOptionsParams
) => Required<GlobalOptionsParams>

/**
 * @param globalSettings - Global library settings
 * @returns getGlobalSettings - Method returning client settings
 * @internal
 * @category Client
 */
export function createGlobalOptions(
  globalSettings: Required<GlobalOptionsParams>
): GetGlobalOptions {
  /**
   * Method merging pre-configured global options and provided local parameters
   * @param query - regular query object used for collection endpoints
   * @param query.environment - optional name of the environment
   * @param query.space - optional space ID
   * @param query.spaceBaseUrl - optional base URL for the space
   * @param query.environmentBaseUrl - optional base URL for the environment
   * @returns global options
   */
  return function getGlobalOptions(query?: GlobalOptionsParams) {
    return Object.assign({}, globalSettings, query)
  }
}
