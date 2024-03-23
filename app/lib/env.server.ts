/*
 * Vercel doesn't inject all environment variables into the runtime
 * some are only available through the process.env object
 */

export function envVariables(contextEnv: Env) {
  let env: Env | NodeJS.ProcessEnv = contextEnv;

  if (typeof process !== 'undefined') {
    // Process is accessible in Vercel environment
    env = process.env;
  }

  checkEnv(env as Env);

  return {
    NODE_ENV: env.NODE_ENV,
    PRIVATE_STOREFRONT_API_TOKEN: env.PRIVATE_STOREFRONT_API_TOKEN,
    PUBLIC_STORE_DOMAIN: env.PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_API_TOKEN: env.PUBLIC_STOREFRONT_API_TOKEN,
    PUBLIC_STOREFRONT_API_VERSION:
      env.PUBLIC_STOREFRONT_API_VERSION || '2024-01',
    PUBLIC_STOREFRONT_ID: env.PUBLIC_STOREFRONT_ID,
    SANITY_STUDIO_API_VERSION: env.SANITY_STUDIO_API_VERSION,
    SANITY_STUDIO_DATASET: env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_PROJECT_ID: env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_URL: env.SANITY_STUDIO_URL,
    SANITY_STUDIO_USE_PREVIEW_MODE: env.SANITY_STUDIO_USE_PREVIEW_MODE,
  };
}

function checkEnv(env: Env) {
  const requiredVariables: (keyof Env)[] = [
    'PUBLIC_STORE_DOMAIN',
    'PUBLIC_STOREFRONT_API_TOKEN',
    'PRIVATE_STOREFRONT_API_TOKEN',
    'SESSION_SECRET',
    'SANITY_STUDIO_API_VERSION',
    'SANITY_STUDIO_PROJECT_ID',
    'SANITY_STUDIO_DATASET',
    'SANITY_STUDIO_URL',
  ] as const;

  for (const requiredEnv of requiredVariables) {
    if (!env[requiredEnv]) {
      throw new Error(
        `Missing environment variable => ${requiredEnv} is not set`,
      );
    }
  }
}
