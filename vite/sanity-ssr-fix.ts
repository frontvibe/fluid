import {createRequire} from 'node:module';
import path from 'node:path';

import type {Plugin} from 'vite';

const require = createRequire(import.meta.url);

/**
 * Vite plugin to fix @sanity/react-loader resolution in SSR/worker environments.
 *
 * Problem: @sanity/react-loader exports both browser and worker builds. The browser
 * build is listed first in package.json exports, so Vite picks it during SSR when
 * 'browser' is in the resolve conditions. The browser build throws "setServerClient
 * is server only" errors because it's meant for client-side use only.
 *
 * Solution: This plugin intercepts resolution of @sanity/react-loader in SSR context
 * and redirects it to the server/worker build (dist/index.js) instead of the browser
 * build (dist/index.browser.js).
 *
 * @see https://github.com/sanity-io/visual-editing/tree/main/packages/react-loader
 */
export function sanitySSRFix(): Plugin {
  return {
    name: 'sanity-ssr-fix',
    enforce: 'pre',
    resolveId(id, _importer, options) {
      if (!options.ssr) return null;

      if (id === '@sanity/react-loader') {
        const pkgPath = require.resolve('@sanity/react-loader/package.json');
        const pkgDir = path.dirname(pkgPath);
        return path.join(pkgDir, 'dist/index.js');
      }

      return null;
    },
  };
}
