// App: Full-Stack Application
// Directory: api
// File: eslint.config.js
// Version: 1.0.0
// Author: Bobwares CodeBot
// Date: 2025-06-12T06:58:30Z
// Description: Configure ESLint using the flat config format.

import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'test/**'],
  },
  eslintConfigPrettier,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    parser,
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'warn',
      'no-implicit-coercion': 'error',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
];
