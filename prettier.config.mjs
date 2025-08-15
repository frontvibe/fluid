/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  arrowParens: 'always',
  bracketSpacing: false,
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  trailingComma: 'all',
  tailwindStylesheet: './app/styles/tailwind.css',
  tailwindFunctions: ['cx', 'cva', 'cn'],
};

export default config;
