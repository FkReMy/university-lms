/* eslint-env node */

/**
 * ESLint configuration for a Vite + React (JSX) LMS front-end.
 * - Uses React, hooks, accessibility, and import plugins.
 * - Supports path aliases (import/no-unresolved disabled; let Vite/tsconfig handle).
 * - Includes overrides for Node configs and tests.
 */
module.exports = {
  // Ensure no parent .eslintrc files are used.
  root: true,

  // Environments: browser runtime and modern ES syntax.
  env: {
    browser: true,
    es2022: true,
  },

  // Parser options for modern JS + JSX modules.
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },

  // Auto-detect React version.
  settings: {
    react: {
      version: 'detect',
    },
  },

  // Plugins to extend linting.
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import'],

  // Base rule sets.
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
  ],

  rules: {
    // General hygiene
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'warn',

    // React / JSX
    'react/prop-types': 'off', // Prefer TypeScript or JSDoc if needed
    'react/react-in-jsx-scope': 'off', // Not required with React 17+
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',

    // Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Imports
    'import/no-unresolved': 'off', // Handled by Vite/tsconfig path aliases
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',  // Node built-ins
          'external', // npm deps
          'internal', // alias imports (e.g., @/components)
          'parent',   // ../
          'sibling',  // ./
          'index',    // ./index
          'object',   // imported within an object
          'type',     // import type
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },

  overrides: [
    // Node-focused config files
    {
      files: ['*.config.cjs', '*.config.js', 'vite.config.*'],
      env: {
        node: true,
        browser: false,
      },
    },
    // Jest test files
    {
      files: ['src/**/*.test.js', 'src/**/*.test.jsx'],
      env: {
        jest: true,
      },
    },
  ],
};