import {vitePlugin as remix} from '@remix-run/dev';
import {hydrogen, oxygen} from '@shopify/cli-hydrogen/experimental-vite';
import {defineConfig} from 'vite';
import envOnly from 'vite-env-only';
import commonjs from 'vite-plugin-commonjs';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    commonjsOptions: {
      exclude: ['node_modules/react-use/**'],
      transformMixedEsModules: true,
    },
  },
  plugins: [
    envOnly(),
    hydrogen(),
    oxygen(),
    remix({buildDirectory: 'dist'}),
    tsconfigPaths(),
    commonjs({
      filter(id) {
        if (
          id.includes('fast-deep-equal') ||
          id.includes('hoist-non-react-statics') ||
          id.includes('react-is')
        ) {
          return true;
        }
      },
    }),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        '@sanity/core-loader',
        '@sanity/react-loader',
        '@sanity/client',
        '@sanity/visual-editing',
        '@sanity/image-url',
        'parse-headers',
        'debug',
      ],
    },
  },
});
