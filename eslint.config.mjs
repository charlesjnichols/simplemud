/* eslint-disable */
import { builtinModules, createRequire } from 'node:module';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

const require = createRequire(import.meta.url);
const pluginImport = require('eslint-plugin-import');

function stripLegacyPluginConfig(plugin) {
  const { configs: _, ...rest } = plugin;
  return rest;
}

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      prettier: eslintPluginPrettier,
      'simple-import-sort': simpleImportSort,
      import: stripLegacyPluginConfig(pluginImport),
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
      ...prettier.rules,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
  },
]);
