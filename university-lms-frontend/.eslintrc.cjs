/* eslint-env node */

/**
 * ESLint configuration for University LMS Frontend
 * -------------------------------------------------
 * - Strictly enforces clean, maintainable, and production-ready React + Vite code.
 * - All UI logic should use global/shared components (see project structure).
 * - Plugin configuration focuses on accessibility, hooks, and import hygiene.
 * - Path aliases are handled by Vite and jsconfig/tsconfig (no false errors).
 * - Overrides for Node config files and Jest/test files.
 */

module.exports = {
  // Ensures no inheritance from parent ESLint configs.
  root: true,

  // Environment: modern browsers and ES specs.
  env: {
    browser: true,
    es2022: true
  },

  // Use modern JS and JSX parsing.
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },

  // React settings auto-detect version.
  settings: {
    react: {
      version: 'detect'
    }
  },

  // Plugins: React, hooks, a11y, imports.
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'import'
  ],

  // Baseline and plugin rules.
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended'
  ],

  rules: {
    // General code hygiene and runtime safety
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Only allow warn/error logs in prod code
    'no-debugger': 'warn',

    // Enforce shared UI/component usage
    // (Custom rule: You may add a lint-plugin for this if your org desires)
    // e.g. 'project/no-raw-html': 'error',

    // React/JSX best practices
    'react/prop-types': 'off', // Use TypeScript or JSDoc in a production system
    'react/react-in-jsx-scope': 'off', // Not necessary in React 17+
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/self-closing-comp': 'warn',

    // Hooks must follow the rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility: always use a11y attributes and global UI components
    'jsx-a11y/no-autofocus': ['warn', { ignoreNonDOM: true }],
    'jsx-a11y/no-static-element-interactions': [
      'warn',
      { allowExpressionValues: true }
    ],

    // Import/order: enforce structure and organize cleanly
    'import/no-unresolved': 'off', // Vite/jsconfig/tsconfig enforce alias paths
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal', // "@/" imports (must sort to top)
          'parent',
          'sibling',
          'index',
          'object',
          'type'
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ]
  },

  overrides: [
    // Node/config/script files (not browser)
    {
      files: ['*.config.cjs', '*.config.js', 'vite.config.*'],
      env: {
        node: true,
        browser: false
      }
    },
    // Jest/test files
    {
      files: ['src/**/*.test.js', 'src/**/*.test.jsx'],
      env: {
        jest: true
      }
    }
  ]
};