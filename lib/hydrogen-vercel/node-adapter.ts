/**
 * Node.js HTTP ↔ Web API bridge for Vercel serverless functions.
 *
 * Uses @mjackson/node-fetch-server (by React Router co-creator Michael Jackson)
 * to convert between Node.js IncomingMessage/ServerResponse and Web-standard
 * Request/Response objects.
 */
import type {IncomingMessage, ServerResponse} from 'node:http';
import {createRequest, sendResponse} from '@mjackson/node-fetch-server';

/** Options for configuring the Vercel handler. */
export interface VercelHandlerOptions {
  /** Enable verbose request logging. @default false */
  debug?: boolean;
}

/**
 * Workers module format with a fetch method.
 * This is the format used by Cloudflare Workers and mini-oxygen.
 */
type WorkersModule = {
  fetch: (
    request: Request,
    env?: unknown,
    ctx?: unknown,
  ) => Response | Promise<Response>;
};

/**
 * Handler type that accepts both plain functions and Workers modules.
 */
type Handler =
  | ((request: Request) => Response | Promise<Response>)
  | WorkersModule;

/**
 * Wraps a Web-standard request handler into a Node.js HTTP handler suitable
 * for Vercel's serverless function runtime.
 *
 * Uses @mjackson/node-fetch-server for efficient Request/Response conversion.
 * Supports both plain request handlers and Workers module format (objects with
 * a `fetch` method) for dev/prod parity with mini-oxygen.
 *
 * @param handler - A function or Workers module accepting a Web `Request` and returning a `Response`.
 * @param options - Optional configuration for logging and debugging.
 * @returns A Node.js-compatible `(req, res) => Promise<void>` handler.
 */
export function createVercelHandler(
  handler: Handler,
  options?: VercelHandlerOptions,
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  const debug = options?.debug ?? false;

  // Unwrap Workers module format if needed
  const handleRequest =
    typeof handler === 'function' ? handler : handler.fetch.bind(handler);

  return async (req, res) => {
    const startTime = Date.now();
    const url = req.url || '/';

    if (debug) {
      console.log(`[hydrogen-vercel] ${req.method} ${url}`);
    }

    try {
      // Create Web Request from Node.js IncomingMessage
      // The package handles AbortController and body streaming automatically
      const request = createRequest(req, res, {
        // Vercel's edge network sets these headers for the original client protocol/host
        // x-forwarded-proto is "https" (no colon), but the package expects "https:"
        protocol: `${(req.headers['x-forwarded-proto'] as string) || 'https'}:`,
        host: (req.headers['x-forwarded-host'] as string) || req.headers.host,
      });

      const response = await handleRequest(request);
      await sendResponse(res, response);

      if (debug) {
        console.log(
          `[hydrogen-vercel] ${response.status} ${url} (${Date.now() - startTime}ms)`,
        );
      }
    } catch (error) {
      console.error(`[hydrogen-vercel] Error: ${req.method} ${url}`, error);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.end('An unexpected error occurred');
      } else {
        res.end();
      }
    }
  };
}
