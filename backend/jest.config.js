const test = {
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  testMatch: ['**/test/**/*.test.js'],     // where your test files are located
  collectCoverageFrom: [
    'models/**/*.js',
    'controller/**/*.js',
    'routes/**/*.js',
    'app.js',
    '!**/node_modules/**',
  ],
};

export default test;