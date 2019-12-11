import isPlainObject from 'lodash/isPlainObject'

/**
 * Handles errors received from the server. Parses the error into a more useful
 * format, places it in an exception and throws it.
 * See https://www.contentful.com/developers/docs/references/errors/
 * for more details on the data received on the errorResponse.data property
 * and the expected error codes.
 * @private
 * @param {Object} errorResponse - Error received from an axios request
 * @throws {ErrorResponse}
 */
export default function errorHandler (errorResponse) {
  const {config, response} = errorResponse
  let errorName

  if (!isPlainObject(response) || !isPlainObject(config)) {
    throw errorResponse
  }

  const { data } = response

  const errorData = {
    status: response.status,
    statusText: response.statusText,
    message: '',
    details: {}
  }

  // Obscure the Management token
  if (config.headers && config.headers['Authorization']) {
    const token = `...${config.headers['Authorization'].substr(-5)}`
    config.headers['Authorization'] = `Bearer ${token}`
  }
  if (isPlainObject(config)) {
    errorData.request = {
      url: config.url,
      headers: config.headers,
      method: config.method,
      payloadData: config.data
    }
  }
  if (isPlainObject(data)) {
    if ('requestId' in data) {
      errorData.requestId = data.requestId || 'UNKNOWN'
    }
    if ('message' in data) {
      errorData.message = data.message || ''
    }
    if ('details' in data) {
      errorData.details = data.details || {}
    }
    if ('sys' in data) {
      if ('id' in data.sys) {
        errorName = data.sys.id
      }
    }
  }

  const error = new Error()
  error.name = errorName && errorName !== 'Unknown' ? errorName : `${response.status} ${response.statusText}`
  error.message = JSON.stringify(errorData, null, '  ')
  throw error
}
