const lines = [
  '  ---------------------------------------------------------------------------------------------',
  ('  contentful.js - the contentful delivery API (library)'),
  '',
  ('  🚨 We have just released contentful.js v10 in Beta with enhanced ✨ TypeScript ✨ support! 🚨'),
  ('  You can check it out on npm under the beta-v10 tag (go to the "Versions" tab to find it). '),
  '  The migration guide and updated v10 README and can be found on the beta-v10 branch.',
  '',
  `  ${('README:')} ${('https://github.com/contentful/contentful.js/blob/beta-v10/README.md')}`,
  `  ${('MIGRATION GUIDE:')} ${('https://github.com/contentful/contentful.js/blob/beta-v10/MIGRATION.md')}`,
  `  ${('BETA BRANCH:')} ${('https://github.com/contentful/contentful.js/tree/beta-v10')}`,
  '  ---------------------------------------------------------------------------------------------'
]
const message = lines.join('\n')
console.log(message)
