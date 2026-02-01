export default {
     env: {
       node: true,
       es2021: true,
     },
     extends: [
       "eslint:recommended",
       "airbnb-base",
       "plugin:prettier/recommended"
     ],
     parserOptions: {
       ecmaVersion: "latest",
       sourceType: "module",
     },
     rules: {
       "no-console": "off", // Allow console.log
       "prettier/prettier": ["error", { "endOfLine": "auto" }],
       "import/no-extraneous-dependencies": "off",
       "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
     },
   };
   