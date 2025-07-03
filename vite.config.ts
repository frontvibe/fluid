import {reactRouter} from '@react-router/dev/vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import {typegenWatcher} from './types/plugin';

export default defineConfig({
  optimizeDeps: {
    include: [
      'react-use/esm/useMedia',
      'react-use/esm/useDebounce',
      '@shopify/hydrogen-react',
      'radix-ui',
      'class-variance-authority',
      '@sanity/client/stega',
      'color2k',
      '@sanity/image-url',
      'tailwind-merge',
      '@sanity/visual-editing/react-router',
      'embla-carousel-autoplay',
      'motion/react',
      '@tanem/react-nprogress',
      '@sanity/asset-utils',
      'embla-carousel-react',
      '@portabletext/react',
      'vaul',
      '@shopify/hydrogen-react/Image',
      '@vercel/stega',
    ],
  },
  plugins: [
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
    tailwindcss(),
    typegenWatcher(),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  },
  ssr: {
    resolve: {
      conditions: ['workerd', 'worker', 'browser'],
    },
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        'radix-ui',
        'react-router',
        'react-compiler-runtime',
        '@sanity/image-url',
        '@sanity/client',
      ],
    },
  },
  server: {
    watch: {
      ignored: ['**/types/{sanity,shopify}/**', '**/types/index.ts'],
    },
  },
});
