// Readd promise polyfills for legacy browsers since karma-webpack removes them
require('core-js/fn/promise')
require('core-js/fn/object/assign')
require('core-js/fn/array/from')
require('core-js/fn/array/find')
require('core-js/fn/set')

// This file is required due to an issue with karma-tap
// https://github.com/tmcw-up-for-adoption/karma-tap/issues/10
require('./unit/contentful-test.js')
require('./unit/create-contentful-api-test.js')
require('./unit/paged-sync-test.js')
require('./unit/entities/asset-test.js')
require('./unit/entities/content-type-test.js')
require('./unit/entities/entry-test.js')
require('./unit/mocks.js')
require('./integration/tests.js')
