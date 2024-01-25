import type {QueryParams} from '@sanity/client/stega';
import type {AppLoadContext} from '@shopify/remix-oxygen';

type SanityPayload = {
  context: AppLoadContext;
  params: QueryParams;
  query: string;
};
/**
 * The `sanityPreviewPayload` object is used by the `useSanityData` hook.
 * It is used to pass the query and params to the Sanity client and fetch live data from Sanity Studio.
 * The payload will be returned as `null` if `sanityPreviewMode` is set to false.
 **/
export function sanityPreviewPayload({context, params, query}: SanityPayload) {
  const {sanityPreviewMode} = context;

  if (sanityPreviewMode) {
    return {
      sanity: {
        params,
        query,
      },
    };
  }

  return {
    sanity: null,
  };
}
