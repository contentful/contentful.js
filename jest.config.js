module.exports = {
  verbose: true,
  collectCoverageFrom: ['lib/**/*.{ts,tsx,js,jsx}'],
  globals: {
    __VERSION__: require('./package.json').version,
  },
}
