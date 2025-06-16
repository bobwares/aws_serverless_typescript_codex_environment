const path = require('path');
module.exports = {
  env: { node: true, es2022: true, jest: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  plugins: ['@typescript-eslint', 'import'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  settings: { 'import/resolver': { node: { extensions: ['.ts','.js'] } } },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'import/no-unresolved': 'error',
    'no-restricted-syntax': ['error', 'ImportNamespaceSpecifier']
  }
};
