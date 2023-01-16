const mainSupportedBrowsers = require('@contentful/browserslist-config')

module.exports = function(api) {
  api.cache(false)

  return {
    env: {
      browser: {
        presets: [['@babel/preset-env', {
          targets: {
            browsers: mainSupportedBrowsers
          }
        }]]
      },
      legacy: {
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              'regenerator': true,
              'corejs': 3
            }
          ]
        ],
        presets: [['@babel/preset-env', {
          targets: {
            browsers: ['last 5 versions', 'not ie < 10']
          }
        }]]
      },
      node: {
        presets: [['@babel/preset-env', {
          targets: {
            node: '12'
          }
        }]]
      },
      test: {
        presets: [['@babel/preset-env', {
          // Tests need to transform modules
          modules: 'commonjs'
        }]],
        plugins: ['rewire']
      },
      modules: {
        presets: [['@babel/preset-env', {
          modules: false,
          targets: {
            browsers: mainSupportedBrowsers,
            node: '12'
          }
        }]]
      }
    },
    plugins: [
      '@babel/plugin-proposal-object-rest-spread',
      [
        'inline-replace-variables',
        {
          // Inject version number into code
          __VERSION__: require('./package.json').version
        }
      ]
    ]
  }
}
