import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import alias from '@rollup/plugin-alias'
import terser from '@rollup/plugin-terser'
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'

const baseConfig = {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist-rollup/contentful.cjs.js',
    format: 'cjs',
  },
  plugins: [
    commonjs(),
    nodeResolve({
      preferBuiltins: true,
    }),
    json(),
    optimizeLodashImports(),
  ],
}

const cjsConfig = {
  ...baseConfig,
  output: {
    ...baseConfig.output,
  },
  external: ['axios', '@contentful/rich-text-types', 'json-stringify-safe'],
}

const browserConfig = {
  ...baseConfig,
  output: {
    file: 'dist-rollup/contentful.browser.js',
    format: 'iife',
    name: 'contentful',
  },
  plugins: [
    ...baseConfig.plugins,
    nodePolyfills({
      include: ["util"]
    }),
    alias({
      entries: [
        {
          find: 'axios',
          replacement: resolve(__dirname, './node_modules/axios/dist/browser/axios.cjs'),
        },
      ],
    }),
  ],
}

const browserMinConfig = {
  ...browserConfig,
  output: {
    ...browserConfig.output,
    file: 'dist-rollup/contentful.browser.min.js',
  },
  plugins: [
    ...browserConfig.plugins,
    terser({
      compress: {
        ecma: 2015, // Specify ECMAScript release: 5, 2015, 2016, etc.
        module: true,
        toplevel: true,
        drop_console: true, // Remove console logs for production
        drop_debugger: true,
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_proto: true,
        unsafe_undefined: true,
        unsafe_methods: true,
        unsafe_arrows: true,
        passes: 3, // The maximum number of times to run compress.
      },
      mangle: {
        toplevel: true,
        properties: {
          regex: /^_/, // Only mangle properties that start with an underscore
        },
      },
      format: {
        comments: false, // Remove all comments
        beautify: false, // Minify output
      },
      module: true,
      toplevel: true,
      keep_classnames: false,
      keep_fnames: false,
    }),
  ],
}

export default [cjsConfig, browserConfig, browserMinConfig]
