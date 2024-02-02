/* eslint perfectionist/sort-objects: 0 */
import type {Config} from 'tailwindcss';

import typographyPlugin from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';
import tailwindAnimatePlugin from 'tailwindcss-animate';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
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
        'mobile-menu-trigger': {
          '0%, 1%': {
            transform: 'translateY(-120%)',
            opacity: '0',
            position: 'absolute',
            top: '0',
          },
          '100%': {
            transform: 'translateY(-120%)',
            opacity: '1',
            position: 'absolute',
            top: '0',
          },
        },
      },
      animation: {
        'mobile-menu-trigger': 'mobile-menu-trigger 0.2s 1 forwards',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    typographyPlugin,
    tailwindAnimatePlugin,
    plugin(({addComponents}) => {
      addComponents({
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
