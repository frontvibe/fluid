import type {
  ClientPerspective,
  ContentSourceMap,
  QueryParams,
} from '@sanity/client';
import type {EncodeDataAttributeCallback} from '@sanity/react-loader';

import {useMatches, useRouteLoaderData} from '@remix-run/react';

import {useQuery} from '~/lib/sanity/sanity.loader';
import {useRootLoaderData} from '~/root';

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
export function useSanityData<T extends Initial>({
  initial,
  isRoot,
}: {
  initial: T;
  isRoot?: boolean;
}) {
  const matches = useMatches();
  const {id: routeId} = matches[matches.length - 1];
  const rootLoaderData = useRootLoaderData();
  const loaderData = useRouteLoaderData<{
    sanity?: {
      params?: QueryParams;
      query?: string;
    };
  }>(routeId);
  const {env} = rootLoaderData;
  const studioUrl = env.SANITY_STUDIO_URL;
  const sanity = isRoot ? rootLoaderData.sanity : loaderData?.sanity;

  if (sanity === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'warn - The useSanityData hook must be used within a route that has a loader that returns a sanityPreviewPayload object.',
    );
  }

  const params = sanity?.params;
  const query = sanity?.query || '';

  // Todo: find a way to avoid using useQuery hook in production when STEGA is disabled
  const {data, encodeDataAttribute, loading, sourceMap} = useQuery(
    query,
    params,
    {
      initial: initial as any,
    },
  );

  return {data, encodeDataAttribute, loading, sourceMap} as {
    data: InitialData<T>;
    encodeDataAttribute: EncodeDataAttributeCallback;
    loading: boolean;
    sourceMap?: ContentSourceMap;
  };
}
