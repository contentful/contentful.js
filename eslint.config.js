// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['test/output-integration/*'],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Library
  {
    files: ['lib/**/*'],
    rules: {
      // Things we probably should fix at some point
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-namespace': 'warn',
      // Things we won't allow
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: true, // Allow `const { props, state } = this`; false by default
          allowedNames: ['self'], // Allow `const self = this`; `[]` by default
        },
      ],
    },
  },
  // Tests
  {
    files: ['test/**/*'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
    },
  },
)
