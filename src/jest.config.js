// jest.config.js
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'],
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.ts",
        "!**/node_modules/**",
        "!**/build/**",
        "!**/*.d.ts",
        "!**/main.ts",
        "!tests/**"
    ],
};
