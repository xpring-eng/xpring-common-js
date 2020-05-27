module.exports = {
  root: true,

  parser: '@typescript-eslint/parser', // Make ESLint compatible with TypeScript
  parserOptions: {
    // Enable linting rules with type information from our tsconfig
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],

    sourceType: 'module', // Allow the use of imports / ES modules

    ecmaFeatures: {
      impliedStrict: true, // Enable global strict mode
    },
  },

  // Specify global variables that are predefined
  env: {
    browser: true, // Enable browser global variables
    node: true, // Enable node global variables & Node.js scoping
    es2020: true, // Add all ECMAScript 2020 globals and automatically set the ecmaVersion parser option to ES2020
  },

  plugins: [
    '@typescript-eslint', // Add some TypeScript specific rules, and disable rules covered by the typechecker
    'import', // Add rules that help validate proper imports
  ],

  extends: ['@xpring-eng/eslint-config-base/loose'],

  rules: {},

  overrides: [
    {
      files: 'test/**/*.test.ts',
      rules: {
        // We use non-null assertions liberally in tests to allow TypeScript to build
        '@typescript-eslint/no-non-null-assertion': 'off',

        // Because of gRPC, our tests have to have a ton of imports
        'import/max-dependencies': ['warn', { max: 11 }],

        // Because of gRPC, our tests have to have a ton of statements to be useful
        'max-statements': ['warn', { max: 40 }],

        // TODO:(@hbergren) We should be able to get rid of these two rules eventually,
        // because they are both specified in the core config.

        // describe blocks count as a function in Mocha tests, and can be insanely long
        'max-lines-per-function': 'off',

        // We should refactor our test files to be more specific / smaller, but for now, this is fine.
        'max-lines': ['warn', { max: 400 }],
      },
    },
  ],
}
