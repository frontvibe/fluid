/*
 * Vercel doesn't inject all environment variables into the runtime
 * some are only available through the process.env object
 */

export function envVariables(env: Env) {
  return {
    NODE_ENV: env.NODE_ENV ?? process.env.NODE_ENV,
    PRIVATE_STOREFRONT_API_TOKEN:
      env.PRIVATE_STOREFRONT_API_TOKEN ??
      process.env.PRIVATE_STOREFRONT_API_TOKEN,
    PUBLIC_STORE_DOMAIN:
      env.PUBLIC_STORE_DOMAIN ?? process.env.PUBLIC_STORE_DOMAIN,
    PUBLIC_STOREFRONT_API_TOKEN:
      env.PUBLIC_STOREFRONT_API_TOKEN ??
      process.env.PUBLIC_STOREFRONT_API_TOKEN,
    PUBLIC_STOREFRONT_API_VERSION:
      env.PUBLIC_STOREFRONT_API_VERSION ??
      process.env.PUBLIC_STOREFRONT_API_VERSION,

    PUBLIC_STOREFRONT_ID:
      env.PUBLIC_STOREFRONT_ID ?? process.env.PUBLIC_STOREFRONT_ID,
    SANITY_STUDIO_API_VERSION:
      env.SANITY_STUDIO_API_VERSION ?? process.env.SANITY_STUDIO_API_VERSION,
    SANITY_STUDIO_DATASET:
      env.SANITY_STUDIO_DATASET ?? process.env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_PROJECT_ID:
      env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_URL: env.SANITY_STUDIO_URL ?? process.env.SANITY_STUDIO_URL,
    SANITY_STUDIO_USE_STEGA:
      env.SANITY_STUDIO_USE_STEGA ?? process.env.SANITY_STUDIO_USE_STEGA,
  };
}
