import {vitePlugin as remix} from '@remix-run/dev';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vercelPreset} from '@vercel/remix/vite';
import {defineConfig} from 'vite';
import envOnly from 'vite-env-only';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  optimizeDeps: {
    include: [
      'react-use/esm/useIdle',
      'react-use/esm/useMedia',
      'react-use/esm/useDebounce',
      'react-use/esm/useSessionStorage',
    ]
  },
  plugins: [
    envOnly(),
    hydrogen(),
    oxygen(),
    remix({presets: [hydrogen.preset(), vercelPreset()]}),
    tsconfigPaths(),
  ],
  ssr: {
    optimizeDeps: {
      include: [
        '@sanity/image-url',
      ],
    },
  },
});
