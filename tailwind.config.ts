/* eslint perfectionist/sort-objects: 0 */
import type {Config} from 'tailwindcss';

import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
import tailwindAnimatePlugin from 'tailwindcss-animate';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'color-scheme-bg': 'rgb(var(--backgroundColor) / <alpha-value>)',
        'color-scheme-text': 'rgb(var(--textColor) / <alpha-value>)',
        'color-scheme-primary-button-bg':
          'rgb(var(--primaryButtonBackground) / <alpha-value>)',
        'color-scheme-primary-button-label':
          'rgb(var(--primaryButtonLabel) / <alpha-value>)',
        'color-scheme-outline-button':
          'rgb(var(--outlineButton) / <alpha-value>)',
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'},
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'},
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    formsPlugin,
    typographyPlugin,
    tailwindAnimatePlugin,
    plugin(({addComponents}) => {
      addComponents({
        '.color-scheme': {
          '@apply bg-color-scheme-bg': '',
          '@apply text-color-scheme-text': '',
        },
        '.inverted-color-scheme': {
          '@apply bg-color-scheme-text': '',
          '@apply text-color-scheme-bg': '',
        },
        '.section-padding': {
          paddingBottom: 'calc(var(--paddingBottom) * .75)',
          paddingTop: 'calc(var(--paddingTop) * .75)',
          '@screen sm': {
            paddingBottom: 'var(--paddingBottom)',
            paddingTop: 'var(--paddingTop)',
          },
        },
      });
    }),
  ],
} satisfies Config;
