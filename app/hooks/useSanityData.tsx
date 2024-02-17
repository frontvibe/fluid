import type {
  ClientPerspective,
  ContentSourceMap,
  QueryParams,
} from '@sanity/client';
import type {EncodeDataAttributeCallback} from '@sanity/react-loader';

import {useMatches} from '@remix-run/react';
import {useEncodeDataAttribute} from '@sanity/react-loader';

import {useQuery} from '~/lib/sanity/sanity.loader';

import {useEnvironmentVariables} from './useEnvironmentVariables';
import {useRootLoaderData} from './useRootLoaderData';

type Initial = {
  data: unknown;
  perspective?: ClientPerspective;
  sourceMap?: ContentSourceMap;
};
type InitialData<U> = U extends {data: infer V} ? V : never;
/**
 * The `useSanityData` hook is needed to preview live data from Sanity Studio.
 * It must be used within a route that has a loader that returns a `sanityPreviewPayload` object.
 */
export function useSanityData<T extends Initial>(initial: T, routeId?: string) {
  const matches = useMatches();
  const loaderData = matches.pop() as {
    sanity?: {
      params?: QueryParams;
      query?: string;
    };
  };
  const rootLoaderData = useRootLoaderData();
  const env = useEnvironmentVariables();
  const studioUrl = env?.SANITY_STUDIO_URL!;

  const sanity =
    routeId && routeId === 'root' ? rootLoaderData?.sanity : loaderData?.sanity;

  if (matches.length > 1 && sanity === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'warn - The useSanityData hook must be used within a route that has a loader that returns a sanityPreviewPayload object.',
    );
  }

  const params = sanity?.params;
  const query = sanity?.query || '';

  // Todo: find a way to avoid using useQuery hook in production when STEGA is disabled
  const {data, loading, sourceMap} = useQuery(query || '', params, {
    initial: initial as any,
  });

  // `encodeDataAttribute` is a helpful utility for adding custom `data-sanity` attributes.
  const encodeDataAttribute = useEncodeDataAttribute(
    data,
    sourceMap,
    studioUrl,
  );

  return {data, encodeDataAttribute, loading, sourceMap} as {
    data: InitialData<T>;
    encodeDataAttribute: EncodeDataAttributeCallback;
    loading: boolean;
    sourceMap?: ContentSourceMap;
  };
}
