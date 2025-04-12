import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-var": "error",
      "prefer-const": ["error", {
        destructuring: "all",
        ignoreReadBeforeAssign: false,
      }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "VariableDeclaration[kind='let']",
          message: "Use 'const' instead of 'let'."
        }
      ]
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node },
  },
]);
