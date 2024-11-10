// Virtual entry point for the app
import type {AppLoadContext} from '@shopify/remix-oxygen';

import * as remixBuild from '@remix-run/dev/server-build';
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';

import {createAppLoadContext} from '~/lib/context';
import {envVariables} from '~/lib/env.server';
import {HydrogenSession} from '~/lib/hydrogen.session.server';
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
      /*
       * Open a cache instance in the worker and a custom session instance.
       */
      const [cache, session, sanitySession] = await Promise.all([
        caches.open('hydrogen'),
        HydrogenSession.init(request, [envVars.SESSION_SECRET]),
        SanitySession.init(request, [envVars.SESSION_SECRET]),
      ]);

      const appLoadContext = await createAppLoadContext({
        cache,
        env: envVars,
        request,
        sanitySession,
        session,
        waitUntil: executionContext.waitUntil,
      });

      /*
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        getLoadContext: (): AppLoadContext => appLoadContext,
        mode: process.env.NODE_ENV,
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        /*
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: appLoadContext.storefront,
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
