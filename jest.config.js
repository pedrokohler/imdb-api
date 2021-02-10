/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "jest-environment-node",
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
};
