import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier';

export default [
  eslint.configs.recommended,
  {
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'error',
      'no-console': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportNamespaceSpecifier',
          message: 'Wildcard imports are forbidden',
        },
      ],
    },
  },
];
