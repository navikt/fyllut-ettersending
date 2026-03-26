const { defineConfig, globalIgnores } = require('eslint/config');
const js = require('@eslint/js');
const pluginCypress = require('eslint-plugin-cypress');
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const prettier = require('eslint-config-prettier');

module.exports = defineConfig([
  js.configs.recommended,
  ...nextCoreWebVitals,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrorsIgnorePattern: '^[_$].*',
          argsIgnorePattern: '^[_$].*',
          varsIgnorePattern: '^[_$].*',
        },
      ],
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['cypress/**/*.{js,jsx,ts,tsx}'],
    ...pluginCypress.configs.recommended,
  },
  {
    files: ['**/mocks/**'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettier,
  globalIgnores(['**/**.config.js', '**/.next/**', '**/node_modules/**', 'next-env.d.ts']),
]);
