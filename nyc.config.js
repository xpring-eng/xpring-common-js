'use strict'

module.exports = {
  extension: ['.ts', '.tsx'],
  include: ['src/**/*.ts'],

  // Instrument all files, not just ones touched by test suite
  all: true,

  // Controls color highlighting for tests.
  // >= 95% is green, 80-95 is yellow, and < 80 is red.
  watermarks: {
    lines: [80, 95],
    functions: [80, 95],
    branches: [80, 95],
    statements: [80, 95],
  },
}
