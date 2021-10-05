module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverageFrom: ['lib/**/*.{ts,tsx,js,jsx}'],
  globals: {
    __VERSION__: require('./package.json').version,
  },
};
