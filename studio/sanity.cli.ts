import {defineCliConfig, getStudioEnvironmentVariables} from 'sanity/cli';

const envDir = '../';
// Load environment variables from the root of the project so Sanity CLI can use them
getStudioEnvironmentVariables({
  envFile: {
    mode: 'development',
    envDir,
  },
});

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_DATASET!;

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  vite: (config) => {
    // Tell vite to load environment variables from the root of the project so they're available in the browser
    // Only variables prefixed with SANITY_STUDIO_ will be available
    config.envDir = envDir;

    return config;
  },
});
