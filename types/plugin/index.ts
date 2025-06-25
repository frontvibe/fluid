import type {FilterPattern, Plugin} from 'vite';

import {spawn} from 'child_process';
import {createFilter} from 'vite';

// Track ongoing processes to cancel them
let schemaController: AbortController | null = null;
let queriesController: AbortController | null = null;

function runCommand(
  command: string,
  abortController: AbortController,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      stdio: 'pipe',
      signal: abortController.signal,
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        if (stdout) console.log(stdout); // eslint-disable-line no-console
        if (stderr) console.error(stderr);
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * @description This plugin is used to watch for changes in the Sanity schema and GROQ queries to generate the types.
 * @param options - The options for the plugin.
 * @param options.queriesPath - The path to the queries.
 * @param options.schemaPath - The path to the schema.
 */
export function typegenWatcher(options?: {
  queriesPath?: FilterPattern;
  schemaPath?: FilterPattern;
}): Plugin {
  const queriesPath = options?.queriesPath ?? [
    './app/data/sanity/**/*.{ts,tsx}',
  ];
  const schemaPath = options?.schemaPath ?? ['./app/sanity/**/*.{ts,tsx}'];
  const queriesFilter = createFilter(queriesPath);
  const schemaFilter = createFilter(schemaPath);

  return {
    name: 'vite-plugin-typegen-watcher',
    handleHotUpdate({file}) {
      if (schemaFilter(file)) {
        // Cancel ongoing schema process if it exists
        if (schemaController) {
          schemaController.abort();
        }

        schemaController = new AbortController();

        const promise = runCommand(
          'npm run sanity:extract && npm run sanity:generate',
          schemaController,
        )
          .then(() => {
            schemaController = null;
          })
          .catch((error: Error) => {
            if (error.name !== 'AbortError') {
              console.error(
                '\x1b[31m%s\x1b[0m',
                `\nError executing script:\n\nThe Sanity schema is not valid and Typegen failed to extract the schema.\n\n${error.message}`,
              );
            }
            schemaController = null;
          });

        return promise;
      }

      if (queriesFilter(file)) {
        // Cancel ongoing queries process if it exists
        if (queriesController) {
          queriesController.abort();
        }

        queriesController = new AbortController();

        const promise = runCommand('npm run sanity:generate', queriesController)
          .then(() => {
            queriesController = null;
          })
          .catch((error: Error) => {
            if (error.name !== 'AbortError') {
              console.error(
                '\x1b[31m%s\x1b[0m',
                `\nError executing script:\n\nA Sanity GROQ query is not valid and Typegen failed to generate the types.\n\n${error.message}`,
              );
            }
            queriesController = null;
          });

        return promise;
      }
    },
  };
}
