/**
 * This file is used by the Sanity CLI to load the project configuration.
 * @example `sanity schema extract`
 *
 * @see https://www.sanity.io/docs/cli
 *
 * NOTE: Sanity CLI will load environment variables
 */
import {defineSanityConfig} from '~/sanity/config';

const projectId = (process.env as Env).PUBLIC_SANITY_STUDIO_PROJECT_ID!;
const dataset = (process.env as Env).PUBLIC_SANITY_STUDIO_DATASET!;
const shopifyStoreDomain = (process.env as Env).PUBLIC_STORE_DOMAIN!;

export default defineSanityConfig({
  projectId,
  dataset,
  shopifyStoreDomain,
});
