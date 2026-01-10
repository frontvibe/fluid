import {defineCliConfig} from 'sanity/cli';

const projectId = process.env.PUBLIC_SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.PUBLIC_SANITY_STUDIO_DATASET!;

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  typegen: {
    path: [
      "'./app/{sanity,sections}/**/*.{ts,tsx}'",
      "'./app/data/sanity/**/*.{ts,tsx}'",
    ],
    schema: './types/sanity/schema.json',
    generates: './types/sanity/sanity.generated.d.ts',
  },
});
