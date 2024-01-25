// Virtual entry point for the app
import * as remixBuild from '@remix-run/dev/server-build';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
} from '@shopify/remix-oxygen';
import {getLocaleFromRequest} from 'countries';

import {CART_QUERY_FRAGMENT} from '~/graphql/fragments';
import {envVariables} from '~/lib/env.server';
import {HydrogenSession} from '~/lib/hydrogen.session.server';
import {SanitySession} from '~/lib/sanity/sanity.session.server';

import {createSanityClient} from './app/lib/sanity/sanity.server';

/*
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      /*
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      const envVars = envVariables(env);
      const isDev = envVars.NODE_ENV === 'development';
      const origin = new URL(request.url).origin;
      const locale = getLocaleFromRequest(request);
      const waitUntil = executionContext.waitUntil.bind(executionContext);
      const [cache, session, sanitySession] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [env.SESSION_SECRET]),
        SanitySession.init(request, [env.SESSION_SECRET]),
      ]);
      const sanityPreviewMode = await sanitySession.has('previewMode');

      /*
       * Create Hydrogen's Storefront client.
       */
      const {storefront} = createStorefrontClient({
        cache,
        i18n: {country: locale.country, language: locale.language},
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2023-10',
        storefrontHeaders: getStorefrontHeaders(request),
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        waitUntil,
      });

      /*
       * Create a cart handler that will be used to
       * create and update the cart in the session.
       */
      const cart = createCartHandler({
        cartQueryFragment: CART_QUERY_FRAGMENT,
        getCartId: cartGetIdDefault(request.headers),
        setCartId: cartSetIdDefault(),
        storefront,
      });

      /*
       * Sanity CMS client
       */
      const sanity = createSanityClient({
        cache,
        config: {
          apiVersion: envVars.SANITY_STUDIO_API_VERSION,
          dataset: envVars.SANITY_STUDIO_DATASET,
          projectId: envVars.SANITY_STUDIO_PROJECT_ID,
          studioUrl: envVars.SANITY_STUDIO_URL,
          useCdn: envVars.NODE_ENV === 'production',
          useStega: envVars.SANITY_STUDIO_USE_STEGA,
        },
        waitUntil,
      });

      /*
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        getLoadContext: () => ({
          cart,
          env: envVars,
          isDev,
          locale,
          sanity,
          sanityPreviewMode,
          sanitySession,
          session,
          storefront,
          waitUntil,
        }),
        mode: process.env.NODE_ENV,
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /*
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
