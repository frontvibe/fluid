import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
// Virtual entry point for the app
// @ts-expect-error remixBuild is not typed
// eslint-disable-next-line import/no-unresolved
import * as remixBuild from 'virtual:remix/server-build';

import {createAppLoadContext} from '~/lib/context';

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
      const appLoadContext = await createAppLoadContext(
        request,
        env,
        executionContext,
      );

      /*
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        getLoadContext: () => appLoadContext,
        mode: process.env.NODE_ENV,
      });

      const response = await handleRequest(request);

      if (appLoadContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await appLoadContext.session.commit(),
        );
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

      console.error(error);
      return new Response(message, {status: 500});
    }
  },
};
