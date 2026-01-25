import {existsSync} from 'node:fs';
import {cp, mkdir, rm, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import type {Plugin} from 'vite';

const PLUGIN_DIR = dirname(fileURLToPath(import.meta.url));

/** Configuration options for the hydrogen-vercel Vite plugin. */
export interface VercelPluginOptions {
  /** Path to the server entry file, relative to the project root. @default './server.ts' */
  serverEntry?: string;
  /** Vercel Functions runtime identifier. @default 'nodejs22.x' */
  runtime?: string;
  /** Memory allocation (MB) for the serverless function. */
  memory?: number;
  /** Maximum execution time (seconds) for the serverless function. */
  maxDuration?: number;
  /** Vercel regions to deploy to (e.g., `['iad1', 'sfo1']`). */
  regions?: string[];
  /** Enable response streaming (Vercel Fluid Compute). @default true */
  streaming?: boolean;
  /** Enable verbose request logging. @default false */
  debug?: boolean;
}

const VIRTUAL_ENTRY_ID = 'virtual:hydrogen-vercel/entry';
const RESOLVED_VIRTUAL_ENTRY_ID = '\0virtual:hydrogen-vercel/entry';

/**
 * Creates the Vercel Build Output API v3 route configuration.
 */
function createVercelRoutes(assetsDir: string) {
  return [
    // Immutable cache for hashed assets
    {
      src: `^/${assetsDir}/(.*)$`,
      headers: {'Cache-Control': 'public, max-age=31536000, immutable'},
      continue: true,
    },
    // Block source maps (security)
    {src: '^.*\\.map$', status: 404},
    // Serve static files
    {handle: 'filesystem'},
    // Catch-all to serverless function
    {src: '/(.*)', dest: '/index'},
  ];
}

/**
 * Vite plugin that builds a Hydrogen storefront for Vercel's serverless platform.
 *
 * Returns three internal plugins:
 * - **config** — configures the SSR build (bundling, resolve conditions).
 * - **entry** — provides a virtual module that wires the user's server entry
 *   to the Node.js adapter.
 * - **output** — generates the Vercel Build Output API v3 directory structure
 *   in `.vercel/output/`.
 *
 * In non-SSR builds (the client build), all three plugins are no-ops.
 */
export function vercel(options: VercelPluginOptions = {}): Plugin[] {
  const {
    serverEntry = './server.ts',
    runtime = 'nodejs22.x',
    memory,
    maxDuration,
    regions,
    streaming = true,
    debug = false,
  } = options;

  let root: string;
  let isSsr = false;
  let assetsDir: string;

  return [
    {
      name: 'hydrogen-vercel:config',
      config(_, {isSsrBuild}) {
        isSsr = !!isSsrBuild;
        if (!isSsrBuild) return;

        return {
          build: {
            rollupOptions: {
              input: VIRTUAL_ENTRY_ID,
              output: {entryFileNames: 'index.js'},
            },
          },
          ssr: {
            // Bundle all dependencies into a single file for serverless deployment.
            noExternal: true,
            resolve: {
              // Prefer edge/browser condition exports so React uses
              // renderToReadableStream (streaming SSR) instead of the Node.js
              // renderToPipeableStream path.
              conditions: ['workerd', 'worker', 'browser'],
            },
          },
        };
      },
      configResolved(config) {
        root = config.root;
        assetsDir = config.build.assetsDir;

        // Validate serverEntry exists early to provide a clear error message
        if (isSsr) {
          const entryPath = join(config.root, serverEntry);
          if (!existsSync(entryPath)) {
            throw new Error(
              `hydrogen-vercel: serverEntry not found at "${serverEntry}". ` +
                `Expected file at: ${entryPath}`,
            );
          }
        }
      },
    },
    {
      name: 'hydrogen-vercel:entry',
      resolveId(id) {
        if (id === VIRTUAL_ENTRY_ID) return RESOLVED_VIRTUAL_ENTRY_ID;
      },
      load(id) {
        if (id === RESOLVED_VIRTUAL_ENTRY_ID) {
          // Generate a virtual entry module that imports the user's server
          // handler and wraps it with the Node.js adapter.
          const resolvedServerEntry = join(root, serverEntry).replace(/\\/g, '/');
          const adapterImportPath = join(PLUGIN_DIR, 'node-adapter.ts').replace(/\\/g, '/');
          return [
            `import handler from '${resolvedServerEntry}';`,
            `import { createVercelHandler } from '${adapterImportPath}';`,
            `export default createVercelHandler(handler, { debug: ${debug} });`,
          ].join('\n');
        }
      },
    },
    {
      name: 'hydrogen-vercel:output',
      enforce: 'post',
      apply: 'build',
      closeBundle: {
        sequential: true,
        order: 'post',
        async handler() {
          if (!isSsr) return;

          const dist = join(root, 'dist');
          const output = join(root, '.vercel/output');

          // Validate build outputs exist
          if (!existsSync(join(dist, 'server')) || !existsSync(join(dist, 'client'))) {
            throw new Error(
              'hydrogen-vercel: dist/server/ or dist/client/ not found. ' +
                'Ensure both client and server builds complete before this plugin runs.',
            );
          }

          // Clean and create output directories
          await rm(output, {recursive: true, force: true});
          await mkdir(join(output, 'functions/index.func'), {recursive: true});
          await mkdir(join(output, 'static'), {recursive: true});

          // Copy build artifacts
          await cp(join(dist, 'client'), join(output, 'static'), {recursive: true});
          await cp(join(dist, 'server'), join(output, 'functions/index.func'), {recursive: true});

          // Generate function config
          const vcConfig: Record<string, unknown> = {
            runtime,
            handler: 'index.js',
            launcherType: 'Nodejs',
            supportsResponseStreaming: streaming,
          };
          if (memory) vcConfig.memory = memory;
          if (maxDuration) vcConfig.maxDuration = maxDuration;
          if (regions) vcConfig.regions = regions;

          await writeFile(
            join(output, 'functions/index.func/.vc-config.json'),
            JSON.stringify(vcConfig, null, 2),
          );

          await writeFile(
            join(output, 'functions/index.func/package.json'),
            JSON.stringify({type: 'module'}, null, 2),
          );

          await writeFile(
            join(output, 'config.json'),
            JSON.stringify({version: 3, routes: createVercelRoutes(assetsDir)}, null, 2),
          );

          // Build summary
          console.log('hydrogen-vercel: Build Output generated at .vercel/output/');
          console.log(`  - Static assets copied to static/`);
          console.log(`  - Function: index.func/ (${runtime}${streaming ? ', streaming' : ''})`);
        },
      },
    },
  ];
}
