var defaultBabelPresetEnvConfig = {
  // No module transformation, webpack will take care of this if necessary.
  modules: false,
  useBuiltIns: 'entry',
  corejs: 3,
}

// Latest browsers
var browserBabelPresetEnvConfig = Object.assign(
  {},
  defaultBabelPresetEnvConfig,
  {
    targets: {
      browsers: [
        'last 2 versions',
        'not ie < 13',
        'not android < 50'
      ]
    }
  }
)

// Legacy browsers
var legacyBabelPresetEnvConfig = Object.assign(
  {},
  defaultBabelPresetEnvConfig,
  {
    targets: {
      browsers: ['last 5 versions', 'not ie < 10']
    }
  }
)

// Node
var nodeBabelPresetEnvConfig = Object.assign({}, defaultBabelPresetEnvConfig, {
  targets: {
    node: '4.7'
  }
})

// Combined node and browser environment for es6 modules version and tests
var modulesBabelPresetEnvConfig = Object.assign(
  {},
  defaultBabelPresetEnvConfig,
  {
    targets: Object.assign({},
      legacyBabelPresetEnvConfig.targets,
      nodeBabelPresetEnvConfig.targets
    )
  }
)

var testBabelPresetEnvConfig = Object.assign({}, modulesBabelPresetEnvConfig, {
  // Tests need to transform modules
  modules: 'commonjs'
})

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

module.exports = function (api) {

  var env = api.env()

  if (env === 'browser') {
    babelConfig = Object.assign({}, babelConfig, {
      presets: [['@babel/preset-env', browserBabelPresetEnvConfig]]
    })
  }

  if (env === 'legacy') {
    babelConfig = Object.assign({}, babelConfig, {
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
      //plugins: babelConfig.plugins.concat(['rewire'])
    })
  }

  console.debug('BABEL ENV: ' + env)
  console.table(babelConfig.presets.map(p => p[1].targets))

  return babelConfig
}
