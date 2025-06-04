/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {HydrogenSessionData, HydrogenEnv} from '@shopify/hydrogen';
import type {createAppLoadContext} from '~/lib/context';
import type {AriaAttributes, DOMAttributes} from 'react';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: NodeJS.ProcessEnv['NODE_ENV']}};
  interface Env extends HydrogenEnv {
    NODE_ENV: NodeJS.ProcessEnv['NODE_ENV'];
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    PUBLIC_SANITY_STUDIO_DATASET: string;
    PUBLIC_SANITY_STUDIO_PROJECT_ID: string;
    SANITY_STUDIO_USE_PREVIEW_MODE: string;
    SANITY_STUDIO_TOKEN: string;
    SESSION_SECRET: string;
    SHOP_ID: string;
  }
}

declare module 'react-router' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {}

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Hydrogen session data here
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
