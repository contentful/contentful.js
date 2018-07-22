const fs = require('fs')
const path = require('path')
const rewriteContext = require('require-rewrite')(__dirname)
const test = require('blue-tape')

const rootDir = path.resolve(__dirname, '..')

rewriteContext.use('contentful', path.join(rootDir, 'dist', 'contentful.node.js'))

const testsDir = path.join(rootDir, 'build', 'typings-tests')
const testFiles = fs.readdirSync(testsDir)
  .filter(f => path.basename(f, '.js').endsWith('test'))
  .map(f => path.join(testsDir, f))

testFiles.map(async (testFile) => {
  const { description, testFn } = require(testFile)
  test(description, async (t) => {
    try {
      await testFn()
    } catch (error) {
      t.fail(error.message)
      return
    }
    t.pass()
  })
})
