// @ts-nocheck

// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';

import type {Context} from '@netlify/edge-functions';

import {storefrontRedirect} from '@shopify/hydrogen';
import {
  createHydrogenAppLoadContext,
  createRequestHandler,
} from '@netlify/remix-edge-adapter';

import {createAppLoadContext} from '~/lib/context';

/*
 * Export a fetch handler in module format.
 */
export default async function (
  request: Request,
  netlifyContext: Context,
): Promise<Response | undefined> {
  try {
    const appLoadContext = await createHydrogenAppLoadContext(
      request,
      netlifyContext,
      createAppLoadContext,
    );

    /*
     * Create a Remix request handler and pass
     * Hydrogen's Storefront client to the loader context.
     */
    const handleRequest = createRequestHandler({
      build: remixBuild,
      mode: process.env.NODE_ENV,
    });

    const response = await handleRequest(request, appLoadContext);

    if (!response) {
      return;
    }

    if (appLoadContext.session.isPending) {
      response.headers.set('Set-Cookie', await appLoadContext.session.commit());
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

    // eslint-disable-next-line no-console
    console.error(error);
    return new Response(message, {status: 500});
  }
}
