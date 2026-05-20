/* eslint-env node */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, webextensions: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "react-refresh"],
  settings: { react: { version: "detect" } },
  ignorePatterns: [
    "node_modules",
    ".output",
    ".wxt",
    "dist",
    "public",
    "package-lock.json",
  ],
  rules: {
    "react-refresh/only-export-components": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/prop-types": "off",
  },
  overrides: [
    {
      files: [
        "*.cjs",
        "*.config.js",
        "postcss.config.js",
        "tailwind.config.js",
      ],
      env: { node: true },
      rules: { "@typescript-eslint/no-var-requires": "off" },
    },
  ],
};
