// Virtual entry point for the app
import type {AppLoadContext} from '@shopify/remix-oxygen';

import * as remixBuild from '@remix-run/dev/server-build';
import {createHydrogenContext, storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {getLocaleFromRequest} from 'countries';

import {CART_QUERY_FRAGMENT} from '~/graphql/fragments';
import {envVariables} from '~/lib/env.server';
import {HydrogenSession} from '~/lib/hydrogen.session.server';
import {createSanityClient} from '~/lib/sanity/sanity.server';
import {SanitySession} from '~/lib/sanity/sanity.session.server';

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
      const envVars = envVariables(env);
      const isDev = envVars.NODE_ENV === 'development';
      const locale = getLocaleFromRequest(request);
      const waitUntil = executionContext.waitUntil.bind(executionContext);

      /*
       * Open a cache instance in the worker and a custom session instance.
       */
      const [cache, session, sanitySession] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [envVars.SESSION_SECRET]),
        SanitySession.init(request, [envVars.SESSION_SECRET]),
      ]);

      const sanityPreviewMode = await sanitySession.has('previewMode');

      const hydrogenContext = createHydrogenContext({
        cache,
        cart: {
          queryFragment: CART_QUERY_FRAGMENT,
        },
        env: envVars,
        i18n: {country: locale.country, language: locale.language},
        request,
        session,
        waitUntil,
      });

      /*
       * Sanity CMS client
       */
      const sanity = createSanityClient({
        cache,
        config: {
          apiVersion: env.SANITY_STUDIO_API_VERSION,
          dataset: env.SANITY_STUDIO_DATASET,
          projectId: env.SANITY_STUDIO_PROJECT_ID,
          studioUrl: env.SANITY_STUDIO_URL,
          token: env.SANITY_STUDIO_TOKEN,
          useCdn: !env.NODE_ENV || env.NODE_ENV === 'production',
          useStega: env.SANITY_STUDIO_USE_PREVIEW_MODE,
        },
        isPreviewMode: sanityPreviewMode,
        request,
        waitUntil,
      });

      /*
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        getLoadContext: (): AppLoadContext => ({
          ...hydrogenContext,
          env: envVars,
          isDev,
          locale,
          sanity,
          sanityPreviewMode,
          sanitySession,
          session,
          waitUntil,
        }),
        mode: process.env.NODE_ENV,
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        /*
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      const errorString = error instanceof Error ? error.toString() : '';
      let message = 'An unexpected error occurred';

      if (errorString.includes('Missing environment variable')) {
        message = 'Missing environment variable';
      }

      // eslint-disable-next-line no-console
      console.error(error);
      return new Response(message, {status: 500});
    }
  },
};
