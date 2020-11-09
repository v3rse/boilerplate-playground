module.exports = {
  testEnvironment: 'node',
  verbose: true,
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/tests/**/*.js'
  ]
}
