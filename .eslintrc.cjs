/**
 * @type {import("@types/eslint").Linter.BaseConfig}
 */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    '@remix-run/eslint-config',
    'plugin:perfectionist/recommended-natural',
    'plugin:hydrogen/typescript',
  ],
  ignorePatterns: ['studio/*'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'hydrogen/prefer-image-component': 'off',
    'no-case-declarations': 'off',
    'no-useless-escape': 'off',
  },
};
