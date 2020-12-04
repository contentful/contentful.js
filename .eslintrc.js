module.exports = {
  parser: 'babel-eslint',
  extends: 'standard',
  env: {
    jest: true
  },
  plugins: [
    'standard',
    'promise'
  ],
  globals: {
    __VERSION__: true
  }
}
