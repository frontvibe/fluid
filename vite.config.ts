import {reactRouter} from '@react-router/dev/vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import {vercel} from './lib/hydrogen-vercel';
import {typegenWatcher} from './types/plugin';
import {sanitySSRFix} from './vite/sanity-ssr-fix';

export default defineConfig(({command}) => ({
  plugins: [
    sanitySSRFix(),
    hydrogen(),
    command === 'serve' ? oxygen() : null,
    vercel(),
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
    typegenWatcher(),
  ].filter(Boolean),
  build: {
    assetsInlineLimit: 0,
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  },
  optimizeDeps: {
    include: [
      '@portabletext/react',
      '@sanity/asset-utils',
      '@sanity/client/stega',
      '@sanity/image-url',
      '@sanity/visual-editing',
      '@sanity/visual-editing/react-router',
      '@shopify/hydrogen-react',
      '@shopify/hydrogen-react/Image',
      '@tanem/react-nprogress',
      '@vercel/stega',
      'class-variance-authority',
      'color2k',
      'embla-carousel-autoplay',
      'embla-carousel-react',
      'motion/react',
      'radix-ui',
      'react-use/esm/useDebounce',
      'react-use/esm/useMedia',
      'tailwind-merge',
      'vaul',
    ],
  },
  ssr: {
    resolve: {
      conditions: ['workerd', 'worker'],
    },
    optimizeDeps: {
      include: [
        '@sanity/client',
        '@sanity/core-loader',
        '@sanity/image-url',
        '@sanity/visual-editing',
        'radix-ui',
        'react-router',
      ],
    },
  },
  server: {
    watch: {
      ignored: ['**/types/{sanity,shopify}/**', '**/types/index.ts'],
    },
  },
}));
