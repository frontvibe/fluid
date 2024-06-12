import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';

import {defer} from '@shopify/remix-oxygen';
import {DEFAULT_LOCALE} from 'countries';

import {mergeMeta} from '~/lib/meta';
import {resolveShopifyPromises} from '~/lib/resolveShopifyPromises';
import {sanityPreviewPayload} from '~/lib/sanity/sanity.payload.server';
import {getSeoMetaFromMatches} from '~/lib/seo';
import {seoPayload} from '~/lib/seo.server';
import {PAGE_QUERY} from '~/qroq/queries';

import PageRoute from './($locale).$';

export const meta: MetaFunction<typeof loader> = mergeMeta(({matches}) =>
  getSeoMetaFromMatches(matches),
);

export async function loader({context, request}: LoaderFunctionArgs) {
  const {env, locale, sanity, storefront} = context;
  const language = locale?.language.toLowerCase();
  const queryParams = {
    defaultLanguage: DEFAULT_LOCALE.language.toLowerCase(),
    handle: 'home',
    language,
  };

  const page = await sanity.query({
    groqdQuery: PAGE_QUERY,
    params: queryParams,
  });

  const {
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
  } = resolveShopifyPromises({
    document: page,
    request,
    storefront,
  });

  if (!page.data) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not Found',
    });
  }

  const seo = seoPayload.home({
    page: page.data,
    sanity: {
      dataset: env.SANITY_STUDIO_DATASET,
      projectId: env.SANITY_STUDIO_PROJECT_ID,
    },
  });

  return defer({
    collectionListPromise,
    featuredCollectionPromise,
    featuredProductPromise,
    page,
    seo,
    ...sanityPreviewPayload({
      context,
      params: queryParams,
      query: PAGE_QUERY.query,
    }),
  });
}

/*
 * Homepage route component is the same as the page route component
 * so we can just export the page route component as the homepage route component.
 */
export default PageRoute;
