module.exports = {
  env: {
    node: true,
    jest: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: "ImportDeclaration[source.value='*']",
        message: 'Wildcard imports are forbidden.',
      },
    ],
  },
};
