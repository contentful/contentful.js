const constants = require('./node_modules/tsdx/dist/constants')
const utils = require('./node_modules/tsdx/dist/utils')

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    const opts = options
    const shouldMinify = opts.minify !== undefined ? opts.minify : opts.env === 'production'

    const outputName = [`${constants.paths.appDist}/contentful`]

    if (opts.format === 'cjs') {
      outputName.push('node')
    } else if (opts.format === 'umd') {
      outputName.push('browser')
    } else {
      outputName.push(opts.format)
    }
    if (shouldMinify) {
      outputName.push('min')
    }
    outputName.push('js')

    config.output.file = outputName.join('.')
    return config
  },
}
