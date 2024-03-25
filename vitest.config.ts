import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      include: ['lib/**/*.{ts,tsx,js,jsx}'],
    },
    setupFiles: ['./vitest.setup.ts'],
  },
  // resolve: {
  //   alias: {
  //     axios: 'axios/dist/node/axios.cjs',
  //   },
  // },
})
