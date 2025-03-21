import type {FilterPattern, Plugin} from 'vite';

import {exec} from 'child_process';
import {promisify} from 'util';
import {createFilter} from 'vite';

const execPromise = promisify(exec);

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
        return execPromise('npm run sanity:extract && npm run sanity:generate')
          .then(({stdout, stderr}) => {
            if (stdout) console.log(stdout); // eslint-disable-line no-console
            if (stderr) console.error(stderr);
          })
          .catch((error: Error) => {
            console.error(
              '\x1b[31m%s\x1b[0m',
              `\nError executing script:\n\nThe Sanity schema is not valid and Typegen failed to extract the schema.\n\n${error.message}`,
            );
          });
      }

      if (queriesFilter(file)) {
        return execPromise('npm run sanity:generate')
          .then(({stdout, stderr}) => {
            if (stdout) console.log(stdout); // eslint-disable-line no-console
            if (stderr) console.error(stderr);
          })
          .catch((error: Error) => {
            console.error(
              '\x1b[31m%s\x1b[0m',
              `\nError executing script:\n\nA Sanity GROQ query is not valid and Typegen failed to generate the types.\n\n${error.message}`,
            );
          });
      }
    },
  };
}
