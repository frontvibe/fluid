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
      'react-use/esm/useIdle',
      'react-use/esm/useMedia',
      'react-use/esm/useDebounce',
      'react-use/esm/useSessionStorage',
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
        'rxjs',
        'react-compiler-runtime',
        '@sanity/image-url',
        '@sanity/client',
      ],
    },
  },
});
