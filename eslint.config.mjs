/* eslint-disable */
import { builtinModules, createRequire } from 'node:module';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import parserTs from '@typescript-eslint/parser';
import pluginTs from '@typescript-eslint/eslint-plugin';

const require = createRequire(import.meta.url);
const pluginImport = require('eslint-plugin-import');

function stripLegacyPluginConfig(plugin) {
  const { configs: _, ...rest } = plugin;
  return rest;
}

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.node,
    },
    plugins: {
      js,
      prettier: eslintPluginPrettier,
      'simple-import-sort': simpleImportSort,
      import: stripLegacyPluginConfig(pluginImport),
      '@typescript-eslint': pluginTs,
    },
    extends: ['js/recommended'],
    rules: {
      'no-var': 'error',
      'prefer-const': ['error', { destructuring: 'all', ignoreReadBeforeAssign: false }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "VariableDeclaration[kind='let']",
          message: "Use 'const' instead of 'let'.",
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [`^node:`, `^(${builtinModules.join('|')})(/|$)`],
            ['^@?\\w'],
            ['^(@|src|utils|lib|components)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'prettier/prettier': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'import/no-unresolved': 'error',

      // Type-checking rules for JS
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',

      ...prettier.rules,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
]);
