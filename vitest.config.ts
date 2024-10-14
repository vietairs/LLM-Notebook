import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    setupFiles: ['<rootDir>/src/setupTests.ts'],
    globals: true,
    css: false,
    alias: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
      '\\.(gif|ttf|eot|svg)$': '<rootDir>/src/__mocks__/fileMock.js',
    },
  },
});