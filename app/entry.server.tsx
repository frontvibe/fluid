import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';

import {RemixServer} from '@remix-run/react';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const {NonceProvider, header, nonce} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    ...createCspHeaders(),
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
      signal: request.signal,
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  // Set CSP headers only for non-preview environments
  // to allow vercel preview feedback/comments feature
  const VERCEL_ENV = getVercelEnv();
  if (!VERCEL_ENV || VERCEL_ENV !== 'preview') {
    responseHeaders.set('Content-Security-Policy', header);
  }

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

export const createCspHeaders = () => {
  // Default CSP headers, will be used as a base for all environments
  const defaultsCSPHeaders = {
    connectSrc: ['*', "'self'"],
    fontSrc: ['*.sanity.io', "'self'", 'localhost:*'],
    frameAncestors: ['localhost:*', '*.sanity.studio'],
    frameSrc: ["'self'"],
    imgSrc: ['*.sanity.io', 'https://cdn.shopify.com', "'self'", 'localhost:*'],
    scriptSrc: ["'self'", 'localhost:*', 'https://cdn.shopify.com'],
  };

  // For Vercel production environment white-list vitals.vercel-insights
  const VERCEL_ENV = getVercelEnv();
  if (VERCEL_ENV === 'production') {
    defaultsCSPHeaders.connectSrc.push('https://vitals.vercel-insights.com');
    defaultsCSPHeaders.imgSrc.push('blob:', 'data:');
  }

  return defaultsCSPHeaders;
};

const getVercelEnv = () => {
  if (typeof process !== 'undefined') {
    return process.env.VERCEL_ENV;
  }
  return null;
};
