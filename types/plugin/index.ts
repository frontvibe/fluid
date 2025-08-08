import type {FilterPattern, Plugin} from 'vite';

import path from 'node:path';
import {createFilter} from 'vite';
import {execa, type ExecaChildProcess} from 'execa';

/**
 * Watch Sanity schema and GROQ queries to auto-run typegen.
 *
 * Performance goals:
 * - Debounce rapid file changes and batch work.
 * - Non-blocking HMR (do not return a promise from handleHotUpdate).
 * - Avoid npm/pnpm wrapper shells; call the local Sanity bin directly.
 * - Kill in-flight runs cleanly before starting a new one.
 */
export function typegenWatcher(options?: {
  queriesPath?: FilterPattern;
  schemaPath?: FilterPattern;
  debounceMs?: number;
}): Plugin {
  const queriesPath = options?.queriesPath ?? ['./app/data/sanity/**/*.{ts,tsx}'];
  const schemaPath = options?.schemaPath ?? ['./app/sanity/**/*.{ts,tsx}'];
  const debounceMs = options?.debounceMs ?? 200;

  const queriesFilter = createFilter(queriesPath);
  const schemaFilter = createFilter(schemaPath);

  const sanityBin = path.resolve(
    process.cwd(),
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'sanity.cmd' : 'sanity',
  );

  let timer: NodeJS.Timeout | null = null;
  let needSchema = false;
  let needQueries = false;
  let current: ExecaChildProcess | null = null;

  async function runTasks({schema, queries}: {schema: boolean; queries: boolean}) {
    // Cancel any in-flight run to avoid overlap
    if (current) {
      try {
        current.kill('SIGTERM', {forceKillAfterTimeout: 2000});
      } catch {}
      current = null;
    }

    const runExtract = schema;
    const runGenerate = schema || queries;

    try {
      if (runExtract) {
        await execa(
          sanityBin,
          ['schema', 'extract', '--path', './types/sanity/schema.json'],
          {stdio: 'inherit'},
        );
      }
      if (runGenerate) {
        current = execa(sanityBin, ['typegen', 'generate'], {stdio: 'inherit'});
        await current;
      }
    } catch (err) {
      console.error('\x1b[31m%s\x1b[0m', '[sanity-typegen] Error', err);
    } finally {
      current = null;
    }
  }

  function schedule(kind: 'schema' | 'queries') {
    if (kind === 'schema') needSchema = true;
    else needQueries = true;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const tasks = {schema: needSchema, queries: needQueries};
      needSchema = false;
      needQueries = false;
      // Fire-and-forget; do not block HMR cycle
      void runTasks(tasks);
    }, debounceMs);
  }

  return {
    name: 'vite-plugin-sanity-typegen-watcher',
    handleHotUpdate(ctx) {
      const f = ctx.file;
      if (schemaFilter(f)) schedule('schema');
      else if (queriesFilter(f)) schedule('queries');
    },
  };
}
