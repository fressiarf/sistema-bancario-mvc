/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  verbose: true,
  bail: 1,
  clearMocks: true,
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
};

module.exports = config;
