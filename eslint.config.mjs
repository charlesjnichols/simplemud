import { builtinModules } from 'module';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      js,
      prettier: eslintPluginPrettier,
      'simple-import-sort': simpleImportSort,
    },
    extends: ['js/recommended'],
    rules: {
      'no-var': 'error',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false,
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "VariableDeclaration[kind='let']",
          message: "Use 'const' instead of 'let'.",
        },
      ],

      // 📦 Import sorting (grouped)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 🔷 Node.js built-ins
            [`^node:`, `^(${builtinModules.join('|')})(/|$)`],
            // 📦 External packages
            ['^@?\\w'],
            // 💎 Internal modules
            ['^(@|src|utils|lib|components)(/.*|$)'],
            // 🔍 Side effect imports
            ['^\\u0000'],
            // 🏃 Relative imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // 🎨 Styles
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // 🧼 Prettier formatting enforcement
      'prettier/prettier': 'error',

      // ⛔ Disable conflicting ESLint formatting rules
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
