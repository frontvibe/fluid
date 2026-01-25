import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {waitUntil as vercelWaitUntil} from '@vercel/functions';
import {createAppLoadContext} from '~/lib/context';

/**
 * Maps process.env to the Env object expected by Hydrogen.
 * Used on Vercel where env vars come from process.env instead of Workers bindings.
 */
function getEnv(env?: Env): Env {
  if (env?.SESSION_SECRET) return env;
  return process.env as unknown as Env;
}

/**
 * Creates an ExecutionContext for Vercel environments.
 * Uses @vercel/functions waitUntil for background tasks.
 */
function getExecutionContext(ctx?: ExecutionContext): ExecutionContext {
  if (ctx?.waitUntil) return ctx;
  return {
    waitUntil: (p: Promise<unknown>) => vercelWaitUntil(p),
    passThroughOnException: () => {},
  } as ExecutionContext;
}

/*
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env?: Env,
    executionContext?: ExecutionContext,
  ): Promise<Response> {
    const resolvedEnv = getEnv(env);
    const resolvedContext = getExecutionContext(executionContext);

    try {
      const appLoadContext = await createAppLoadContext(
        request,
        resolvedEnv,
        resolvedContext,
      );

      /*
       * Create a request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
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
