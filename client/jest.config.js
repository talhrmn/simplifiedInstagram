const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Fix the regex pattern - remove the leading/trailing slashes
    "^@/(.*)$": "<rootDir>/$1"
  },
}

module.exports = createJestConfig(customJestConfig)