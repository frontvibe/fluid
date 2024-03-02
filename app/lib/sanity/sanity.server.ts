import type {SanityClient} from '@sanity/client';
import type {
  ClientPerspective,
  ContentSourceMap,
  FilteredResponseQueryOptions,
  QueryParams,
  UnfilteredResponseQueryOptions,
} from '@sanity/client/stega';
import type {BaseQuery, InferType, z} from 'groqd';

import {CacheShort, createWithCache} from '@shopify/hydrogen';

import {getSanityClient} from './client';
import {queryStore} from './sanity.loader';

type CreateSanityClientOptions = {
  cache: Cache;
  config: {
    apiVersion: string | undefined;
    dataset: string | undefined;
    projectId: string | undefined;
    studioUrl: string | undefined;
    useCdn: boolean | undefined;
    useStega: string | undefined;
  };
  isPreviewMode: boolean;
  waitUntil: ExecutionContext['waitUntil'];
};

type CachingStrategy = ReturnType<typeof CacheShort>;
type BaseType<T = any> = z.ZodType<T>;
type GroqdQuery = BaseQuery<BaseType<any>>;

export type Sanity = {
  client: SanityClient;
  query<T extends GroqdQuery>(options: {
    cache?: CachingStrategy;
    groqdQuery: T;
    params?: QueryParams;
    queryOptions?:
      | FilteredResponseQueryOptions
      | UnfilteredResponseQueryOptions;
  }): Promise<{
    data: InferType<T>;
    perspective?: ClientPerspective;
    sourceMap?: ContentSourceMap;
  }>;
};

export function createSanityClient(options: CreateSanityClientOptions) {
  const {cache, config, isPreviewMode, waitUntil} = options;
  const {apiVersion, dataset, projectId, studioUrl, useCdn, useStega} = config;

  if (
    typeof projectId === 'undefined' ||
    typeof apiVersion === 'undefined' ||
    typeof dataset === 'undefined' ||
    typeof studioUrl === 'undefined'
  ) {
    throw new Error('Missing required configuration for Sanity client');
  }

  const {client} = getSanityClient({
    apiVersion,
    dataset,
    projectId,
    studioUrl,
    useCdn: useCdn ?? true,
    useStega: isPreviewMode && useStega === 'true' ? useStega : 'false',
  });

  queryStore.setServerClient(client);
  const {loadQuery} = queryStore;

  const sanity: Sanity = {
    client,
    async query({
      cache: strategy = CacheShort(),
      groqdQuery,
      params,
      queryOptions,
    }) {
      const {query} = groqdQuery as GroqdQuery;
      const queryHash = await hashQuery(query, params);
      const withCache = createWithCache({
        cache,
        waitUntil,
      });

      return withCache(queryHash, strategy, () => {
        if (!queryOptions) {
          return loadQuery(query, params);
        }

        // NOTE: satisfy union type
        if (queryOptions.filterResponse === false) {
          return loadQuery(query, params, queryOptions);
        }

        return loadQuery(query, params, queryOptions);
      });
    },
  };

  return sanity;
}

/**
 * Create an SHA-256 hash as a hex string
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest#converting_a_digest_to_a_hex_string
 */
export async function sha256(message: string): Promise<string> {
  // encode as UTF-8
  const messageBuffer = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', messageBuffer);
  // convert bytes to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash query and its parameters for use as cache key
 * NOTE: Oxygen deployment will break if the cache key is long or contains `\n`
 */
function hashQuery(query: GroqdQuery['query'], params?: QueryParams) {
  let hash = query;

  if (params !== null) {
    hash += JSON.stringify(params);
  }

  return sha256(hash);
}
