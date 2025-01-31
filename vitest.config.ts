import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      include: ['lib/**/*.{ts,tsx,js,jsx}'],
    },
    // @todo In a future version of Vitest, we hope to be able to set these options to our integration tests through Vitest workspaces.
    // Currently, we’re specifying them in the package.json CLI parameters.
    // maxWorkers: 3,
    // minWorkers: 1,
    // fileParallelism: false,
  },
})
