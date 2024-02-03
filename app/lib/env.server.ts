/*
 * Vercel doesn't inject all environment variables into the runtime
 * some are only available through the process.env object
 */

export function envVariables(contextEnv: Env) {
  let env: Env | NodeJS.ProcessEnv;

  if (typeof process !== 'undefined') {
    // Process is accessible in Vercel environment
    env = process.env;
  } else {
    env = contextEnv;
  }

  return {
    NODE_ENV: env.NODE_ENV,
    PRIVATE_STOREFRONT_API_TOKEN: env.PRIVATE_STOREFRONT_API_TOKEN,
    PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
    PUBLIC_STOREFRONT_API_VERSION: env.PUBLIC_STOREFRONT_API_VERSION,
    PUBLIC_STOREFRONT_ID: env.PUBLIC_STOREFRONT_ID,
    SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
    SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
    SANITY_STUDIO_USE_STEGA: env.SANITY_STUDIO_USE_STEGA,
  };
}
