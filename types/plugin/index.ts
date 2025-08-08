import type {FilterPattern, Plugin} from 'vite';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

import {createFilter} from 'vite';
import {execa} from 'execa';

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
  const queriesPath = options?.queriesPath ?? [
    './app/data/sanity/**/*.{ts,tsx}',
  ];
  const schemaPath = options?.schemaPath ?? ['./app/sanity/**/*.{ts,tsx}'];
  const debounceMs = options?.debounceMs ?? 200;

  const queriesFilter = createFilter(queriesPath);
  const schemaFilter = createFilter(schemaPath);

  let projectRoot: string = '';

  let timer: NodeJS.Timeout | null = null;
  let needSchema = false;
  let needQueries = false;
  let current: ReturnType<typeof execa> | null = null;
  const fileHashCache = new Map<string, string>();

  async function runTasks({
    schema,
    queries,
  }: {
    schema: boolean;
    queries: boolean;
  }) {
    // Cancel any in-flight run to avoid overlap
    if (current) {
      try {
        current.kill('SIGTERM');
      } catch {
        // ignore kill errors (process may have already exited)
        void 0;
      }
      current = null;
    }

    const runExtract = schema;
    const runGenerate = schema || queries;

    try {
      if (runExtract) {
        current = execa(
          'sanity',
          ['schema', 'extract', '--path', './types/sanity/schema.json'],
          {
            stdio: 'inherit',
            preferLocal: true,
            localDir: projectRoot,
            cwd: projectRoot,
          },
        );
        const proc = current;
        await proc;
      }
      if (runGenerate) {
        current = execa('sanity', ['typegen', 'generate'], {
          stdio: 'inherit',
          preferLocal: true,
          localDir: projectRoot,
          cwd: projectRoot,
        });
        const proc = current;
        await proc;
      }
    } catch (err) {
      const e = err as any;
      if (
        !(
          e?.killed &&
          (e?.signal === 'SIGTERM' || e?.signalDescription === 'Termination')
        )
      ) {
        console.error('\x1b[31m%s\x1b[0m', '[sanity-typegen] Error', err);
      }
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
    configResolved(config) {
      projectRoot = config.root;
    },
    handleHotUpdate(ctx) {
      const filePath = ctx.file;
      // Fire-and-forget content check; do not block HMR
      void (async () => {
        try {
          const content = await readFile(filePath);
          const hash = createHash('sha1').update(content).digest('hex');
          const previousHash = fileHashCache.get(filePath);
          if (previousHash === hash) return; // no-op save, ignore
          fileHashCache.set(filePath, hash);
          if (schemaFilter(filePath)) schedule('schema');
          else if (queriesFilter(filePath)) schedule('queries');
        } catch {
          // If we can't read the file for any reason, fall back to scheduling
          if (schemaFilter(filePath)) schedule('schema');
          else if (queriesFilter(filePath)) schedule('queries');
        }
      })();
    },
  };
}
