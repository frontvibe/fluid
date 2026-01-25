import type {AppLoadContext, EntryContext} from '@shopify/remix-oxygen';

import {ServerRouter} from 'react-router';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

import {
  createSafeSignal,
  wrapStreamWithCompletion,
} from '../lib/hydrogen-vercel';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: AppLoadContext,
) {
  const {header, nonce, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    ...createCspHeaders({
      projectId: context.env.PUBLIC_SANITY_STUDIO_PROJECT_ID,
    }),
  });

  // Create a safe abort signal to prevent "Controller is already closed" errors
  // when the stream completes but the request signal fires afterwards
  const {signal, markComplete} = createSafeSignal(request.signal);

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        nonce={nonce}
        url={request.url}
      />
    </NonceProvider>,
    {
      nonce,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
      signal,
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  // Wrap the stream to mark completion before closing
  const safeBody = wrapStreamWithCompletion(body, markComplete);

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(safeBody, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

export const createCspHeaders = ({projectId}: {projectId: string}) => {
  // Default CSP headers, will be used as a base for all environments
  const defaultsCSPHeaders = {
    connectSrc: [
      '*',
      "'self'",
      `https://${projectId}.api.sanity.io`,
      `wss://${projectId}.api.sanity.io`,
    ],
    fontSrc: ['*.sanity.io', "'self'", 'localhost:*'],
    frameAncestors: ["'self'", 'https://www.sanity.io'],
    frameSrc: ["'self'"],
    imgSrc: [
      '*.sanity.io',
      'https://cdn.shopify.com',
      "'self'",
      'localhost:*',
      'https://lh3.googleusercontent.com',
      'data:',
    ],
    scriptSrc: ["'self'", 'localhost:*', 'https://cdn.shopify.com'],
  };

  return defaultsCSPHeaders;
};
