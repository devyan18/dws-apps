import type { Config } from '@jest/types'
export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    verbose: true,
    setupFiles: ['dotenv/config'],
    testMatch: ['**/**/*.test.ts'],
    testEnvironment: 'node',
    detectOpenHandles: true,
    collectCoverage: false,
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    globalTeardown: '<rootDir>/src/tests/jest-globals-teardown.ts',
    forceExit: true,
    silent: true
  }
}
