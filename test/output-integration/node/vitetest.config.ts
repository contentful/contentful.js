import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    dir: '.',
    environment: 'node',
    testTimeout: 10000,
  },
})