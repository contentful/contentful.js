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

testFiles.forEach(testFile => {
  const { description, testFn } = require(testFile)
  test(description, (t) => {
    try {
      testFn()
    } catch (error) {
      t.end(error.message)
      return
    }
    t.pass()
    t.end()
  })
})
