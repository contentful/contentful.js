const env = process.env.BABEL_ENV || process.env.NODE_ENV

let babelConfig = {
  presets: [],
  plugins: [
    'babel-plugin-lodash',
    [
      'babel-plugin-inline-replace-variables',
      {
        // Inject version number into code
        __VERSION__: require('./package.json').version
      }
    ]
  ]
}

if (env === 'modules') {
  babelConfig = Object.assign(babelConfig, {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          targets: {
            node: '4.7',
            browsers: ['last 5 versions', 'not ie < 10']
          }
        }
      ]
    ]
  })
}

if (env === 'test') {
  babelConfig = Object.assign(babelConfig, {
    presets: [
      [
        '@babel/preset-env',
        {
          // modules: 'commonjs',
          useBuiltIns: 'entry',
          debug: true,
          targets: {
            browsers: ['last 5 versions', 'not ie < 10']
          }
        }
      ]
    ],
    plugins: babelConfig.plugins.concat(['babel-plugin-rewire'])
  })
}

console.log(babelConfig.presets[0])

module.exports = babelConfig
