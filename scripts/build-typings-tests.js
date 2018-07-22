const fs = require('fs')
const path = require('path')
const ts = require('typescript')
const tsr = require('ts-runtime')

const rootDir = path.resolve(__dirname, '..')
const testDir = path.join(rootDir, 'test', 'typings')
const buildDir = path.join(rootDir, 'build', 'typings-tests')

// Parse tsconfig.json and resole all paths relative to the project root.
const parsedTsConfig = require(path.join(testDir, 'tsconfig.json'))
parsedTsConfig.compilerOptions.outDir = buildDir
const compilerOptions = ts.convertCompilerOptionsFromJson(
  parsedTsConfig.compilerOptions,
  testDir
).options

const testFiles = fs.readdirSync(testDir)
  .filter(f => path.extname(f) === '.ts' && path.basename(f, '.ts').endsWith('test'))
  .map(f => path.join(testDir, f))
tsr.transform(
  testFiles,
  { compilerOptions }
)
