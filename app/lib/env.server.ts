export function envVariables(contextEnv: Env) {
  const env: Env = contextEnv;

  return {
    NODE_ENV: process.env.NODE_ENV,
    PRIVATE_STOREFRONT_API_TOKEN: checkRequiredEnv(
      env.PRIVATE_STOREFRONT_API_TOKEN,
      'PRIVATE_STOREFRONT_API_TOKEN',
    ),
    PUBLIC_CHECKOUT_DOMAIN: checkRequiredEnv(
      env.PUBLIC_CHECKOUT_DOMAIN,
      'PUBLIC_CHECKOUT_DOMAIN',
    ),
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: checkRequiredEnv(
      env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      'PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID',
    ),
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: checkRequiredEnv(
      env.PUBLIC_CUSTOMER_ACCOUNT_API_URL,
      'PUBLIC_CUSTOMER_ACCOUNT_API_URL',
    ),
    PUBLIC_STORE_DOMAIN: checkRequiredEnv(
      env.PUBLIC_STORE_DOMAIN,
      'PUBLIC_STORE_DOMAIN',
    ),
    PUBLIC_STOREFRONT_API_TOKEN: checkRequiredEnv(
      env.PUBLIC_STOREFRONT_API_TOKEN,
      'PUBLIC_STOREFRONT_API_TOKEN',
    ),
    PUBLIC_STOREFRONT_API_VERSION:
      env.PUBLIC_STOREFRONT_API_VERSION || '2024-01',
    PUBLIC_STOREFRONT_ID: env.PUBLIC_STOREFRONT_ID || '',
    PUBLIC_SANITY_STUDIO_DATASET: checkRequiredEnv(
      env.PUBLIC_SANITY_STUDIO_DATASET,
      'PUBLIC_SANITY_STUDIO_DATASET',
    ),
    PUBLIC_SANITY_STUDIO_PROJECT_ID: checkRequiredEnv(
      env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
      'PUBLIC_SANITY_STUDIO_PROJECT_ID',
    ),
    SANITY_STUDIO_TOKEN: checkRequiredEnv(
      env.SANITY_STUDIO_TOKEN,
      'SANITY_STUDIO_TOKEN',
    ),
    SANITY_STUDIO_USE_PREVIEW_MODE:
      env.SANITY_STUDIO_USE_PREVIEW_MODE || 'false',
    SESSION_SECRET: env.SESSION_SECRET || '',
    SHOP_ID: checkRequiredEnv(env.SHOP_ID, 'SHOP_ID'),
  };
}

function checkRequiredEnv(env: string | undefined, name: string) {
  if (typeof env !== 'string') {
    throw new Error(`Missing environment variable => ${name} is not set`);
  }

  return env;
}
