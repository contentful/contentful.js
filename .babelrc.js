module.exports = {
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    [
      'inline-replace-variables',
      {
        __VERSION__: require('./package.json').version,
      },
    ],
  ],
}
