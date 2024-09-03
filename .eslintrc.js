module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'prettier',
    'next/core-web-vitals',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        caughtErrorsIgnorePattern: '^[_$].*',
        argsIgnorePattern: '^[_$].*',
        varsIgnorePattern: '^[_$].*',
      },
    ],
    '@typescript-eslint/no-var-requires': 'off', // For next config, mocks-server etc that uses js files and require()
  },
};
