import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
    },
    ...pluginJs.configs.recommended,
    rules: {
      // Ignore unused variables and arguments that start with "_"
      "no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      // Disable console warnings if needed
      "no-console": "off"
    }
  }
];
