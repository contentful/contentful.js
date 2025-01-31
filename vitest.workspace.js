import { defineWorkspace } from 'vitest/config'
import vitestConfig from './vitest.config'

export default defineWorkspace([
  {
    test: {
      ...vitestConfig.test,
      include: ['test/output-integration/**/*.{test,spec}.ts'],
      name: 'output',
      setupFiles: ['./vitest.setup.ts'],
      environment: 'node',
      maxConcurrency: 10,
    },
  },
  {
    test: {
      ...vitestConfig.test,
      include: ['test/unit/**/*.{test,spec}.ts'],
      name: 'unit',
      setupFiles: ['./vitest.setup.ts', './vitest.setup.unit.ts'],
      environment: 'node',
      maxConcurrency: 10,
    },
  },
  {
    test: {
      ...vitestConfig.test,
      include: ['test/types/**/*.test-d.ts'],
      name: 'types',
      setupFiles: ['./vitest.setup.ts', './vitest.setup.unit.ts'],
      maxConcurrency: 10,
      typecheck: {
        enabled: true,
      },
    },
  },
  {
    test: {
      ...vitestConfig.test,
      include: ['test/integration/**/*.{test,spec}.ts'],
      name: 'integration',
      setupFiles: ['./vitest.setup.ts'],
      environment: 'node',
      maxConcurrency: 1,
      testTimeout: 60000,
      hookTimeout: 60000,
      bail: 100,
    },
    teardownTimeout: 120000,
    slowTestThreshold: 1000,
  },
  {
    test: {
      ...vitestConfig.test,
      include: ['test/unit/**/*.{test,spec}.ts'],
      name: 'browser-unit',
      setupFiles: ['./vitest.setup.browser.ts', './vitest.setup.ts', './vitest.setup.unit.ts'],
      maxConcurrency: 10,
      browser: {
        enabled: true,
        provider: 'playwright',
        name: 'chromium',
      },
    },
  },
  {
    test: {
      ...vitestConfig.test,
      include: ['test/integration/**/*.{test,spec}.ts'],
      name: 'browser-integration',
      setupFiles: ['./vitest.setup.browser.ts', './vitest.setup.ts'],
      browser: {
        enabled: true,
        provider: 'playwright',
        name: 'chromium',
      },
      maxConcurrency: 1,
      testTimeout: 60000,
      hookTimeout: 60000,
      bail: 100,
    },
    teardownTimeout: 120000,
    slowTestThreshold: 1000,
  },
])
