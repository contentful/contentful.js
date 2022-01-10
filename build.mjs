import browserList from '@contentful/browserslist-config'
import esbuild from 'esbuild'

const transformedBrowserList = browserList.map(spec => {
  const parts = spec.split(' ')
  return (parts[0] + parts[2]).toLowerCase()
})

const build = (options) => esbuild
  .build({
    entryPoints: ['lib/index.ts'],
    logLevel: 'info',
    allowOverwrite: true,
    ...options
  })
  .catch(() => process.exit(1))

// browser (esm)
const browserConfig = {
  bundle: true,
  format: 'esm',
  outfile: 'dist/contentful.esm.js',
  platform: 'node',
  target: ['node16'],
  // target: transformedBrowserList
}

// browser (esm) minified
const browserConfigMinified = {
  ...browserConfig,
  outfile: 'dist/contentful.esm.min.js',
  minify: true
}

const nodeConfig = {
  bundle: true,
  outfile: 'dist/contentful.cjs.cjs',
  format: 'cjs',
  target: ['node12'],
  platform: 'node'
}

// node (cjs) minified
const nodeConfigMinified = {
  ...nodeConfig,
  outfile: 'dist/contentful.cjs.min.cjs',
  minify: true
}

for (const config of [
  browserConfig,
  browserConfigMinified,
  nodeConfig,
  nodeConfigMinified
]) {
  await build(config)
}
