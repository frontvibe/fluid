import {defineCliConfig} from 'sanity/cli';

const projectId = (process.env as Env).PUBLIC_SANITY_STUDIO_PROJECT_ID!;
const dataset = (process.env as Env).PUBLIC_SANITY_STUDIO_DATASET!;

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
