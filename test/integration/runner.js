require('@babel/register')({
  ignore: [/node_modules(?!\/contentful-resolve-response)/]
})

require('./tests.js')
