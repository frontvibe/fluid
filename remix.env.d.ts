/// <reference types="@remix-run/dev" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.

import type {
  HydrogenCart,
  Storefront,
  HydrogenSessionData,
  CustomerAccount,
} from '@shopify/hydrogen';
import type {AriaAttributes, DOMAttributes} from 'react';

import '@total-typescript/ts-reset';

import type {HydrogenSession} from '~/lib/hydrogen.session.server';
import type {SanitySession} from '~/lib/sanity/sanity.session.server';
import type {I18nLocale} from '~/lib/type';

import type {Sanity} from './app/lib/sanity/sanity.server';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'development' | 'production'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    NODE_ENV: 'development' | 'production';
    PRIVATE_STOREFRONT_API_TOKEN: string;
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
    PUBLIC_STOREFRONT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
    PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
    PUBLIC_CHECKOUT_DOMAIN: string;
    SANITY_STUDIO_API_VERSION: string;
    SANITY_STUDIO_DATASET: string;
    SANITY_STUDIO_PROJECT_ID: string;
    SANITY_STUDIO_URL: string;
    SANITY_STUDIO_USE_PREVIEW_MODE: string;
    SESSION_SECRET: string;
  }
}

declare module '@shopify/remix-oxygen' {
  /**
   * Declare local additions to the Remix loader context.
   */
  export interface AppLoadContext {
    cart: HydrogenCart;
    customerAccount: CustomerAccount;
    env: Env;
    isDev: boolean;
    locale: I18nLocale;
    sanity: Sanity;
    sanityPreviewMode: boolean;
    sanitySession: SanitySession;
    session: HydrogenSession;
    storefront: Storefront;
    waitUntil: ExecutionContext['waitUntil'];
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
