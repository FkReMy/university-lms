/* eslint-env node */

/**
 * ESLint configuration for a Vite + React (JSX) project
 * tuned for a university LMS front-end.
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
  ],
  rules: {
    // General
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',

    // React / JSX
    'react/prop-types': 'off', // prefer TS or JSDoc later if you want
    'react/react-in-jsx-scope': 'off', // not needed with React 17+
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Imports
    'import/no-unresolved': 'off', // Vite + jsconfig paths can be custom
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',    // Node "builtin" modules
          'external',   // npm packages
          'internal',   // alias imports
          'parent',     // ../
          'sibling',    // ./
          'index',      // ./index
          'object',     // imported within an object
          'type',       // import type
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
  overrides: [
    {
      files: ['*.config.cjs', '*.config.js', 'vite.config.*'],
      env: {
        node: true,
        browser: false,
      },
    },
    {
      files: ['src/**/*.test.js', 'src/**/*.test.jsx'],
      env: {
        jest: true,
      },
    },
  ],
};
