// ===============================================================
// Airbnb JavaScript Style Guide
// https://github.com/airbnb/javascript
// https://github.com/walmartlabs/eslint-config-defaults
// http://eslint.org/docs/rules/
// ===============================================================

module.exports = {
  extends: ['airbnb-base'],
  plugins: ['svelte3'],
  env: {
    es6: true,
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  rules: {
    eqeqeq: 0,
    'no-multi-assign': 0,
    'no-new': 0,
    'no-restricted-syntax': 0,
    'max-len': 1,
    'import/no-extraneous-dependencies': 1,
    'import/no-mutable-exports': 0,
    'import/no-unresolved': [2, { ignore: ['svelte-fa'] }],
  },
};
