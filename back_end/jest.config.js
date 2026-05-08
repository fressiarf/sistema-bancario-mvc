
const config = {
  testEnvironment: 'node',
  verbose: true,
  bail: 1,
  clearMocks: true,
  testMatch: [
    "**/tests/**/*.test.js",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
};

module.exports = config;
