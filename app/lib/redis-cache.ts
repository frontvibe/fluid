import {Redis} from '@upstash/redis';

interface CachedEntry {
  body: string; // Base64 encoded
  status: number;
  headers: [string, string][];
  timestamp: number;
}

interface CacheControlDirectives {
  maxAge: number;
  staleWhileRevalidate: number;
}

function parseCacheControl(header: string | null): CacheControlDirectives {
  const directives: CacheControlDirectives = {
    maxAge: 0,
    staleWhileRevalidate: 0,
  };

  if (!header) return directives;

  const parts = header.split(',').map((part) => part.trim().toLowerCase());

  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 'max-age' && value) {
      directives.maxAge = parseInt(value, 10) || 0;
    } else if (key === 'stale-while-revalidate' && value) {
      directives.staleWhileRevalidate = parseInt(value, 10) || 0;
    }
  }

  return directives;
}

function getCacheKey(request: Request): string {
  return `hydrogen:${request.url}`;
}

/**
 * Upstash Redis-based cache implementation for Hydrogen on Vercel.
 * Implements the Web Cache API interface to match Hydrogen's InMemoryCache behavior.
 */
export class UpstashCache implements Cache {
  private redis: Redis;
  private debug: boolean;

  constructor(redis: Redis, debug = false) {
    this.redis = redis;
    this.debug = debug;
  }

  private log(message: string) {
    if (this.debug) {
      console.log(message);
    }
  }

  async match(request: Request): Promise<Response | undefined> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return undefined;
    }

    const key = getCacheKey(request);

    try {
      const cached = await this.redis.get<CachedEntry>(key);

      if (!cached) {
        this.log(`[UpstashCache] MISS ${request.url}`);
        return undefined;
      }

      const {body, status, headers, timestamp} = cached;

      // Parse cache-control from stored headers
      const cacheControlHeader = headers.find(
        ([name]) => name.toLowerCase() === 'cache-control',
      );
      const {maxAge, staleWhileRevalidate} = parseCacheControl(
        cacheControlHeader?.[1] || null,
      );

      const age = Math.floor((Date.now() - timestamp) / 1000);
      const isStale = age > maxAge;
      const isExpired = age > maxAge + staleWhileRevalidate;

      if (isExpired) {
        this.log(`[UpstashCache] EXPIRED ${request.url} (age=${age}s)`);
        await this.delete(request);
        return undefined;
      }

      // Decode the base64 body
      const bodyBuffer = Uint8Array.from(atob(body), (c) => c.charCodeAt(0));

      // Build response headers, adding cache status
      const responseHeaders = new Headers(headers);
      responseHeaders.set('cache', isStale ? 'STALE' : 'HIT');
      responseHeaders.set('age', String(age));

      this.log(
        `[UpstashCache] ${isStale ? 'STALE' : 'HIT'} ${request.url} (age=${age}s)`,
      );

      return new Response(bodyBuffer, {
        status,
        headers: responseHeaders,
      });
    } catch (error) {
      console.error('[UpstashCache] match error:', error);
      return undefined;
    }
  }

  async put(request: Request, response: Response): Promise<void> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return;
    }

    // Don't cache 206 Partial Content
    if (response.status === 206) {
      return;
    }

    // Don't cache responses with Vary: *
    const vary = response.headers.get('vary');
    if (vary === '*') {
      return;
    }

    // Parse cache-control to determine TTL
    const cacheControl = response.headers.get('cache-control');
    const {maxAge, staleWhileRevalidate} = parseCacheControl(cacheControl);

    // Don't cache if no max-age or zero TTL
    const totalTtl = maxAge + staleWhileRevalidate;
    if (totalTtl <= 0) {
      return;
    }

    const key = getCacheKey(request);

    try {
      // Clone response to read body without consuming the original
      const clonedResponse = response.clone();
      const bodyArrayBuffer = await clonedResponse.arrayBuffer();
      const bodyBase64 = btoa(
        String.fromCharCode(...new Uint8Array(bodyArrayBuffer)),
      );

      // Serialize headers as array of tuples
      const headers: [string, string][] = [];
      response.headers.forEach((value, name) => {
        headers.push([name, value]);
      });

      const entry: CachedEntry = {
        body: bodyBase64,
        status: response.status,
        headers,
        timestamp: Date.now(),
      };

      // Set with TTL = max-age + stale-while-revalidate
      await this.redis.set(key, entry, {ex: totalTtl});
      this.log(
        `[UpstashCache] PUT ${request.url} (ttl=${totalTtl}s, maxAge=${maxAge}s, swr=${staleWhileRevalidate}s)`,
      );
    } catch (error) {
      console.error('[UpstashCache] put error:', error);
    }
  }

  async delete(request: Request): Promise<boolean> {
    const key = getCacheKey(request);

    try {
      const deleted = await this.redis.del(key);
      return deleted > 0;
    } catch (error) {
      console.error('[UpstashCache] delete error:', error);
      return false;
    }
  }

  async keys(_request?: Request): Promise<readonly Request[]> {
    // Note: Full implementation would require SCAN, but this is rarely used.
    // Return empty array for now as this method is not commonly used by Hydrogen.
    return [];
  }

  // Required by Cache interface but not commonly used
  async add(_request: RequestInfo | URL): Promise<void> {
    throw new Error('UpstashCache.add() is not implemented');
  }

  async addAll(_requests: RequestInfo[]): Promise<void> {
    throw new Error('UpstashCache.addAll() is not implemented');
  }

  async matchAll(
    _request?: RequestInfo | URL,
    _options?: CacheQueryOptions,
  ): Promise<readonly Response[]> {
    // Not commonly used by Hydrogen
    return [];
  }
}

/**
 * A no-op cache implementation for when Redis is not configured.
 * All operations return empty results, effectively disabling caching.
 */
class NoOpCache implements Cache {
  async match(_request: Request): Promise<Response | undefined> {
    return undefined;
  }

  async put(_request: Request, _response: Response): Promise<void> {
    // No-op
  }

  async delete(_request: Request): Promise<boolean> {
    return false;
  }

  async keys(_request?: Request): Promise<readonly Request[]> {
    return [];
  }

  async add(_request: RequestInfo | URL): Promise<void> {
    // No-op
  }

  async addAll(_requests: RequestInfo[]): Promise<void> {
    // No-op
  }

  async matchAll(
    _request?: RequestInfo | URL,
    _options?: CacheQueryOptions,
  ): Promise<readonly Response[]> {
    return [];
  }
}

interface UpstashCacheOptions {
  debug?: boolean;
}

/**
 * Creates an UpstashCache instance if Redis credentials are configured.
 * Returns a no-op cache if not configured, so the app still works without caching.
 */
export function createUpstashCache(options: UpstashCacheOptions = {}): Cache {
  const {debug = false} = options;

  try {
    const redis = Redis.fromEnv();
    if (debug) {
      console.log('[UpstashCache] Initialized successfully');
    }
    return new UpstashCache(redis, debug);
  } catch (error) {
    console.warn('[UpstashCache] Redis not configured. Caching disabled.');
    return new NoOpCache();
  }
}
