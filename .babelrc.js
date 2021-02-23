const mainSupportedBrowsers = require('@contentful/browserslist-config')

// Latest browsers
var browserBabelPresetEnvConfig = {
  targets: {
    browsers: mainSupportedBrowsers
  }
}

// Legacy browsers
var legacyBabelPresetEnvConfig = {
  targets: {
    browsers: ['last 5 versions', 'not ie < 10']
  }
}

// Node
var nodeBabelPresetEnvConfig = {
  targets: {
    node: '12'
  }
}

// Combined node and browser environment for es6 modules version and tests
var modulesBabelPresetEnvConfig = {
  targets: {
    browsers: mainSupportedBrowsers,
    node: '12'
  }
}

var testBabelPresetEnvConfig = {
  // Tests need to transform modules
  modules: 'commonjs'
}

var plugins = [
  '@babel/plugin-proposal-object-rest-spread',
  [
    'inline-replace-variables',
    {
      // Inject version number into code
      __VERSION__: require('./package.json').version
    }
  ]
]

var babelConfig = {
  plugins
}

module
  .exports = function(api) {

  var env = api.env()

  if (env === 'browser') {
    babelConfig = Object.assign({}, babelConfig, {
      presets: [['@babel/preset-env', browserBabelPresetEnvConfig]]
    })
  }

  if (env === 'legacy') {
    babelConfig = Object.assign({}, babelConfig, {
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            'regenerator': true,
            'corejs': 3
          }
        ]
      ].concat(plugins),
      presets: [['@babel/preset-env', legacyBabelPresetEnvConfig]]
    })
  }

  if (env === 'modules') {
    babelConfig = Object.assign({}, babelConfig, {
      presets: [['@babel/preset-env', modulesBabelPresetEnvConfig]]
    })
  }

  if (env === 'node') {
    babelConfig = Object.assign({}, babelConfig, {
      presets: [['@babel/preset-env', nodeBabelPresetEnvConfig]]
    })
  }

  if (env === 'test') {
    babelConfig = Object.assign({}, babelConfig, {
      presets: [['@babel/preset-env', testBabelPresetEnvConfig]],
      plugins: babelConfig.plugins.concat(['rewire'])
    })
  }

  console.debug({ babelENV: env, nodeENV: process.env.NODE_ENV })
  // console.table(babelConfig.presets.map(p => p[1].targets))

  return babelConfig
}
